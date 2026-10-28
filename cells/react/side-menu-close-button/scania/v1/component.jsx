function SideMenuCloseButton({ onClick }) {
  return (
    <button
      className="tl-side-menu-close-button"
      type="button"
      aria-label="Close"
      onClick={(event) => {
        document
          .querySelectorAll('.tl-header-hamburger__button')
          .forEach((button) => button.setAttribute('aria-expanded', 'false'));
        if (onClick) onClick(event);
      }}
    >
      <svg className="tl-side-menu-close-button__icon" viewBox="0 0 32 32" aria-hidden="true">
        <path className="tl-side-menu-close-button__cross" />
      </svg>
    </button>
  );
}
