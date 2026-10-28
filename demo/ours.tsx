import type { FC, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts';
import '../tokens/scania.css';
import '../cells/react/badge/scania/v1/component.css';
import '../cells/react/button/scania/v1/component.css';
import '../cells/react/link/scania/v1/component.css';
import '../cells/react/spinner/scania/v1/component.css';
import '../cells/react/card/scania/v1/component.css';
import '../cells/react/divider/scania/v1/component.css';
import '../cells/react/block/scania/v1/component.css';
import '../cells/react/tag/scania/v1/component.css';
import '../cells/react/message/scania/v1/component.css';
import '../cells/react/breadcrumbs/scania/v1/component.css';
import '../cells/react/breadcrumb/scania/v1/component.css';
import '../cells/react/stepper/scania/v1/component.css';
import '../cells/react/step/scania/v1/component.css';
import '../cells/react/footer/scania/v1/component.css';
import '../cells/react/footer-group/scania/v1/component.css';
import '../cells/react/footer-item/scania/v1/component.css';
import '../cells/react/checkbox/scania/v1/component.css';
import '../cells/react/radio-button/scania/v1/component.css';
import '../cells/react/toggle/scania/v1/component.css';
import '../cells/react/chip/scania/v1/component.css';
import '../cells/react/textarea/scania/v1/component.css';
import '../cells/react/accordion/scania/v1/component.css';
import '../cells/react/accordion-item/scania/v1/component.css';
import '../cells/react/banner/scania/v1/component.css';
import '../cells/react/toast/scania/v1/component.css';
import '../cells/react/text-field/scania/v1/component.css';
import Accordion from '../cells/react/accordion/scania/v1/component.jsx';
import AccordionItem from '../cells/react/accordion-item/scania/v1/component.jsx';
import Badge from '../cells/react/badge/scania/v1/component.jsx';
import Banner from '../cells/react/banner/scania/v1/component.jsx';
import Block from '../cells/react/block/scania/v1/component.jsx';
import Breadcrumb from '../cells/react/breadcrumb/scania/v1/component.jsx';
import Breadcrumbs from '../cells/react/breadcrumbs/scania/v1/component.jsx';
import Button from '../cells/react/button/scania/v1/component.jsx';
import Card from '../cells/react/card/scania/v1/component.jsx';
import Checkbox from '../cells/react/checkbox/scania/v1/component.jsx';
import Chip from '../cells/react/chip/scania/v1/component.jsx';
import Divider from '../cells/react/divider/scania/v1/component.jsx';
import Footer from '../cells/react/footer/scania/v1/component.jsx';
import FooterGroup from '../cells/react/footer-group/scania/v1/component.jsx';
import FooterItem from '../cells/react/footer-item/scania/v1/component.jsx';
import Link from '../cells/react/link/scania/v1/component.jsx';
import Message from '../cells/react/message/scania/v1/component.jsx';
import RadioButton from '../cells/react/radio-button/scania/v1/component.jsx';
import Spinner from '../cells/react/spinner/scania/v1/component.jsx';
import Step from '../cells/react/step/scania/v1/component.jsx';
import Stepper from '../cells/react/stepper/scania/v1/component.jsx';
import Tag from '../cells/react/tag/scania/v1/component.jsx';
import TextField from '../cells/react/text-field/scania/v1/component.jsx';
import Textarea from '../cells/react/textarea/scania/v1/component.jsx';
import Toast from '../cells/react/toast/scania/v1/component.jsx';
import Toggle from '../cells/react/toggle/scania/v1/component.jsx';
import {
  ACCORDION,
  CRUMBS,
  FOOTER_END,
  FOOTER_START,
  FOOTER_TOP,
  ICON_PATH,
  NESTED_BLOCKS,
  SECTIONS,
  STEPS,
  THUMBNAIL_SRC,
} from './cases';

const COMPONENTS: Record<string, FC<Record<string, unknown>>> = {
  badge: Badge,
  button: Button,
  link: Link,
  spinner: Spinner,
  card: Card,
  divider: Divider,
  block: Block,
  tag: Tag,
  message: Message,
  breadcrumbs: Breadcrumbs,
  stepper: Stepper,
  footer: Footer,
  checkbox: Checkbox,
  'radio-button': RadioButton,
  toggle: Toggle,
  chip: Chip,
  textarea: Textarea,
  accordion: Accordion,
  banner: Banner,
  toast: Toast,
  'text-field': TextField,
};

const crumbs = CRUMBS.map((name, i) => (
  <Breadcrumb key={name} current={i === CRUMBS.length - 1}>
    <a href="#breadcrumbs">{name}</a>
  </Breadcrumb>
));

const steps = STEPS.map(({ index, state, label }) => (
  <Step key={index} index={index} state={state} label={label} />
));

function footerGroup(label: string, items: string[], title?: string) {
  return (
    <FooterGroup key={label} tdsListAriaLabel={label} title={title && <h6>{title}</h6>}>
      {items.map((item) => (
        <FooterItem key={item}>
          <a href="#footer">{item}</a>
        </FooterItem>
      ))}
    </FooterGroup>
  );
}

const icon = (
  <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden="true">
    <path d={ICON_PATH} />
  </svg>
);

const prefix = (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d={ICON_PATH} />
  </svg>
);

// Blocks inside blocks, NESTED_BLOCKS deep, to show the alternating backgrounds.
function nestedBlocks(depth: number): ReactNode {
  return depth === 0 ? null : (
    <Block>
      Level {NESTED_BLOCKS - depth + 1}
      {nestedBlocks(depth - 1)}
    </Block>
  );
}

const thumbnail = <img src={THUMBNAIL_SRC} alt="" width="100%" height="100%" />;

const actions = (
  <div className="actions">
    <Button size="sm" text="Primary" />
    <Button size="sm" text="Secondary" variant="secondary" />
  </div>
);

const accordionItems = ACCORDION.map(({ header, text, expanded }) => (
  <AccordionItem key={header} header={header} expanded={expanded}>
    {text}
  </AccordionItem>
));

const actionLink = <a href="#actions">Read more</a>;

// Turns the shared case flags into the nodes our cells take as props.
function nodeProps(props: Record<string, unknown>): Record<string, unknown> {
  return {
    ...props,
    icon: props.icon ? icon : undefined,
    thumbnail: props.thumbnail ? thumbnail : undefined,
    actions: props.actions ? actions : props.actionLink ? actionLink : undefined,
    prefix: props.prefix ? prefix : undefined,
    suffix: props.suffix ? prefix : undefined,
    top: props.top ? FOOTER_TOP.map((g) => footerGroup(g.title, g.items, g.title)) : undefined,
    start: props.start ? footerGroup('Legal', FOOTER_START) : undefined,
    end: props.end ? footerGroup('Social', FOOTER_END) : undefined,
    children: props.nested ? (
      <>Level 1{nestedBlocks(NESTED_BLOCKS - 1)}</>
    ) : props.crumbs ? (
      crumbs
    ) : props.steps ? (
      steps
    ) : props.items ? (
      accordionItems
    ) : (
      props.children
    ),
  };
}

function Preview() {
  return SECTIONS.map(({ component, cases }) => {
    const Component = COMPONENTS[component];
    return (
      <section key={component} data-component={component}>
        <h2>{component}</h2>
        <dl className="cases">
          {cases.map(({ label, props, dark }) => (
            <div className="case" key={label}>
              <dt>{label}</dt>
              <dd className={dark ? 'dark' : undefined}>
                {Component && <Component {...nodeProps(props)} />}
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
