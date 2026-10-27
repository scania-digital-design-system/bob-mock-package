// The bootstrap prompt's rules that the hard gate does not check
// (backbone pipeline/prompts/bootstrap_system_react.txt; ADR 0002 D5). Each rule is a
// pure function over one cell and returns its findings; an empty list is a pass.

export type Finding = { rule: string; detail: string };

export type PromptRuleInput = {
  component: string;
  markup: string;
  styles: string;
  // Surface property name → declared values, as the payload declares them.
  properties: Record<string, string[]>;
};

type PromptRule = (cell: PromptRuleInput) => Finding[];

const CONTEXT_CLASS_PREFIX = 'tl-context-';

// "Never a literal like "#0a1f33" or "8px"" (L7), read as: no colour literal, no
// length or time literal, and no unitless number on the properties where a bare number
// is a size or a weight. Zero, percentages, angles and keywords stay allowed.
const HEX_COLOR = /#[0-9a-f]{3,8}\b/i;
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i;
const NAMED_COLOR =
  /(?:^|[\s,(])(?:white|black|red|green|blue|gray|grey|yellow|orange|purple|pink|navy|silver)(?=$|[\s,)])/i;
const UNIT_LITERAL = /(?:^|[^\w.-])-?(?:\d*\.)?\d+(?:px|rem|em|vh|vw|vmin|vmax|pt|ch|ex|ms|s)\b/i;
const BARE_NUMBER = /(?:^|[^\w.#-])-?(?:\d*\.)?\d+(?![\w.%])/;
const UNITLESS_SIZE_PROPERTIES = new Set(['line-height', 'opacity', 'font-weight', 'font-size']);

function finding(rule: string, detail: string): Finding {
  return { rule, detail };
}

export function pascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const functionShape: PromptRule = ({ component, markup }) => {
  const name = pascalCase(component);
  const shape = new RegExp(`^function ${name}\\(\\s*\\{`);
  return shape.test(markup.trimStart())
    ? []
    : [finding('function-shape', `source must start with "function ${name}({ … })"`)];
};

const noModule: PromptRule = ({ markup }) =>
  [...markup.matchAll(/^\s*(import|export)\b.*$/gm)].map((m) => finding('no-module', m[0].trim()));

const noStyleAttribute: PromptRule = ({ markup }) =>
  [...markup.matchAll(/\bstyle\s*=/g)].map((m) => finding('no-style-attribute', m[0]));

const classNameOnly: PromptRule = ({ markup }) =>
  [...markup.matchAll(/\bclass\s*=/g)].map((m) => finding('class-name-only', m[0]));

const noTokensObject: PromptRule = ({ markup }) =>
  [...markup.matchAll(/\btokens\.\w+/g)].map((m) => finding('no-tokens-object', m[0]));

// Class tokens the markup names, interpolations left in place: className="a b" and
// className={`a ${x}`}.
export function markupClassTokens(markup: string): string[] {
  const literal = [...markup.matchAll(/className\s*=\s*"([^"]*)"/g)].map((m) => m[1] ?? '');
  const template = [...markup.matchAll(/className\s*=\s*\{\s*`([^`]*)`\s*\}/g)].map(
    (m) => m[1] ?? '',
  );
  return [...literal, ...template].flatMap((list) => list.split(/\s+/)).filter(Boolean);
}

// Every class a token can render: each ${name} is replaced by each declared value of
// the property whose name matches case-insensitively (as the gate expands it). A token
// naming no declared property expands to nothing; the gate reports that one.
export function expandClassToken(token: string, properties: Record<string, string[]>): string[] {
  const match = /\$\{\s*(\w+)\s*\}/.exec(token);
  if (!match) {
    return [token];
  }
  const name = (match[1] ?? '').toLowerCase();
  const key = Object.keys(properties).find((k) => k.toLowerCase() === name);
  const values = key ? (properties[key] ?? []) : [];
  return values.flatMap((value) => expandClassToken(token.replace(match[0], value), properties));
}

const classPrefix: PromptRule = ({ component, markup }) => {
  const base = `tl-${component}`;
  return markupClassTokens(markup)
    .filter(
      (token) => token !== base && !token.startsWith(`${base}__`) && !token.startsWith(`${base}--`),
    )
    .map((token) =>
      finding('class-prefix', `"${token}" is not ${base}, ${base}__<part> or ${base}--<value>`),
    );
};

// Class names used in selectors, outside declaration blocks and at-rule preludes.
export function definedClasses(styles: string): Set<string> {
  const css = styles.replace(/\/\*[\s\S]*?\*\//g, '');
  const classes = new Set<string>();
  for (const [, prelude = ''] of css.matchAll(/([^{}]+)\{/g)) {
    if (prelude.trim().startsWith('@')) {
      continue;
    }
    for (const [, name = ''] of prelude.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      classes.add(name);
    }
  }
  return classes;
}

const noExtraRules: PromptRule = ({ markup, styles, properties }) => {
  const renderable = new Set(
    markupClassTokens(markup).flatMap((token) => expandClassToken(token, properties)),
  );
  return [...definedClasses(styles)]
    .filter((name) => !name.startsWith(CONTEXT_CLASS_PREFIX) && !renderable.has(name))
    .map((name) =>
      finding('no-extra-rules', `.${name} has a rule but the markup cannot render it`),
    );
};

export type Declaration = { property: string; value: string };

// Declarations inside the innermost blocks, so keyframe steps are included.
export function declarations(styles: string): Declaration[] {
  const css = styles.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...css.matchAll(/\{([^{}]*)\}/g)]
    .flatMap((m) => (m[1] ?? '').split(';'))
    .map((decl) => {
      const colon = decl.indexOf(':');
      return {
        property: decl.slice(0, colon).trim().toLowerCase(),
        value: decl.slice(colon + 1).trim(),
      };
    })
    .filter((d) => d.property !== '' && d.value !== '');
}

// The value with every var(...) removed, so a fallback inside var() is not judged.
function outsideVar(value: string): string {
  let out = value;
  let previous = '';
  while (out !== previous) {
    previous = out;
    out = out.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ' ');
  }
  return out;
}

export function literalIn({ property, value }: Declaration): string | undefined {
  const bare = outsideVar(value);
  const checks: [RegExp, boolean][] = [
    [HEX_COLOR, true],
    [COLOR_FUNCTION, true],
    [NAMED_COLOR, true],
    [UNIT_LITERAL, true],
    [BARE_NUMBER, UNITLESS_SIZE_PROPERTIES.has(property)],
  ];
  for (const [pattern, applies] of checks) {
    const hit = applies ? pattern.exec(bare) : null;
    if (hit && hit[0].trim().replace(/^[(,]/, '') !== '0') {
      return hit[0].trim();
    }
  }
  return undefined;
}

const noLiteralValue: PromptRule = ({ styles }) =>
  declarations(styles).flatMap((decl) => {
    const literal = literalIn(decl);
    return literal === undefined
      ? []
      : [finding('no-literal-value', `${decl.property}: ${decl.value} (literal ${literal})`)];
  });

export const PROMPT_RULES: PromptRule[] = [
  functionShape,
  noModule,
  noStyleAttribute,
  classNameOnly,
  noTokensObject,
  classPrefix,
  noExtraRules,
  noLiteralValue,
];

export function checkPromptRules(cell: PromptRuleInput): Finding[] {
  return PROMPT_RULES.flatMap((rule) => rule(cell));
}
