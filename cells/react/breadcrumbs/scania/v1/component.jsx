function Breadcrumbs({ tdsAriaLabel, children }) {
  return (
    <nav aria-label={tdsAriaLabel} className="tl-breadcrumbs">
      <div role="list" className="tl-breadcrumbs__list">
        {children}
      </div>
    </nav>
  );
}
