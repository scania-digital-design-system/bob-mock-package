import type { FC } from 'react';
import { createRoot } from 'react-dom/client';
import '../tokens/scania.css';
import '../cells/react/badge/scania/v1/component.css';
import '../cells/react/button/scania/v1/component.css';
import '../cells/react/link/scania/v1/component.css';
import '../cells/react/spinner/scania/v1/component.css';
import Badge from '../cells/react/badge/scania/v1/component.jsx';
import Button from '../cells/react/button/scania/v1/component.jsx';
import Link from '../cells/react/link/scania/v1/component.jsx';
import Spinner from '../cells/react/spinner/scania/v1/component.jsx';
import { ICON_PATH, SECTIONS } from './cases';

const COMPONENTS: Record<string, FC<Record<string, unknown>>> = {
  badge: Badge,
  button: Button,
  link: Link,
  spinner: Spinner,
};

const icon = (
  <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden="true">
    <path d={ICON_PATH} />
  </svg>
);

function Preview() {
  return SECTIONS.map(({ component, cases }) => {
    const Component = COMPONENTS[component];
    return (
      <section key={component}>
        <h2>{component}</h2>
        <dl className="cases">
          {cases.map(({ label, props, dark }) => (
            <div className="case" key={label}>
              <dt>{label}</dt>
              <dd className={dark ? 'dark' : undefined}>
                {Component && <Component {...props} icon={props.icon ? icon : undefined} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  });
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('demo: #root is missing');
}
createRoot(root).render(<Preview />);
