import tegelCss from '@scania/tegel/dist/tegel/tegel.css?raw';

// The package does not ship the Scania Sans fonts (docs/tokens.md, "Not included"), so
// a consumer loads them. This page does the same with only Tegel's @font-face rules, so
// both preview pages render the same fonts. Their local asset URLs do not resolve here;
// each rule falls back to Tegel's CDN.
const style = document.createElement('style');
style.textContent = (tegelCss.match(/@font-face\s*\{[^}]*\}/g) ?? []).join('\n');
document.head.append(style);
