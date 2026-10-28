import { useState } from 'react';

function FooterGroup({ titleText, tdsListAriaLabel, title, children }) {
  const [open, setOpen] = useState(false);
  const heading = title || titleText;
  return (
    <div className="tl-footer-group">
      {heading && <div className="tl-footer-group__title">{heading}</div>}
      <button
        type="button"
        className="tl-footer-group__toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {heading}
        <svg className="tl-footer-group__chevron" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M4.273 9.783a1 1 0 0 1 1.415 0l9.888 9.888a.6.6 0 0 0 .848 0l9.888-9.888a1 1 0 1 1 1.415 1.414l-9.889 9.889a2.6 2.6 0 0 1-3.677 0l-9.888-9.889a1 1 0 0 1 0-1.414Z" />
        </svg>
      </button>
      <nav aria-label={tdsListAriaLabel}>
        <div role="list" className="tl-footer-group__list">
          {children}
        </div>
      </nav>
    </div>
  );
}
