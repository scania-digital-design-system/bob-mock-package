function Breadcrumb({ current = false, children }) {
  return (
    <div role="listitem" className={`tl-breadcrumb tl-breadcrumb--current-${current}`}>
      <div className="tl-breadcrumb__item" aria-current={current ? 'page' : undefined}>
        {children}
      </div>
    </div>
  );
}
