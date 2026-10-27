// Reads a component's public API out of @scania/tegel's generated components.d.ts:
// props from `namespace Components`, events from `LocalJSX` (the `on<Event>` handlers
// the React wrappers expose).

function interfaceBody(dts: string, namespaceStart: string, tag: string): string {
  const namespaceAt = dts.indexOf(namespaceStart);
  if (namespaceAt < 0) {
    return '';
  }
  const start = dts.indexOf(`interface ${tag} {`, namespaceAt);
  if (start < 0) {
    return '';
  }
  const end = dts.indexOf('\n    }', start);
  return dts.slice(start, end < 0 ? undefined : end);
}

function memberNames(body: string): string[] {
  return [...body.matchAll(/^\s+"(\w+)"\??:/gm)].map((m) => m[1] ?? '');
}

export function tegelInterfaceName(component: string): string {
  return `Tds${component
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;
}

export function tegelProps(dts: string, tag: string): string[] {
  return memberNames(interfaceBody(dts, 'export namespace Components {', tag));
}

export function tegelEvents(dts: string, tag: string): string[] {
  return memberNames(interfaceBody(dts, 'declare namespace LocalJSX {', tag)).filter((name) =>
    /^on[A-Z]/.test(name),
  );
}
