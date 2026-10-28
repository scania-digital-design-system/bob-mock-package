function SideMenuCollapseButton({ children, onTdsCollapse }) {
  return (
    <div className="tl-side-menu-collapse-button">
      <button
        className="tl-side-menu-collapse-button__button"
        type="button"
        onClick={(event) => {
          const menu = event.currentTarget.closest('.tl-side-menu');
          const tdsCollapse = new CustomEvent('tdsCollapse', {
            cancelable: true,
            detail: { collapsed: !(menu && menu.dataset.collapsed === 'true') },
          });
          if (onTdsCollapse) onTdsCollapse(tdsCollapse);
          if (tdsCollapse.defaultPrevented) event.preventDefault();
        }}
      >
        <svg className="tl-side-menu-collapse-button__collapse" viewBox="0 0 32 32" role="img">
          <title>Collapse the side menu</title>
          <path className="tl-side-menu-collapse-button__arrow-left" />
        </svg>
        <svg className="tl-side-menu-collapse-button__expand" viewBox="0 0 32 32" role="img">
          <title>Expand the side menu</title>
          <path className="tl-side-menu-collapse-button__arrow-right" />
        </svg>
        <span className="tl-side-menu-collapse-button__label">{children}</span>
      </button>
    </div>
  );
}
