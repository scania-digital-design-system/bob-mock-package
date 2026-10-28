function HeaderHamburger({ tdsAriaLabel, onClick }) {
  return (
    <li className="tl-header-hamburger">
      <button
        className="tl-header-hamburger__button"
        type="button"
        aria-label={tdsAriaLabel}
        aria-haspopup="true"
        aria-expanded="false"
        onClick={onClick}
      >
        <svg className="tl-header-hamburger__icon" viewBox="0 0 32 32" aria-hidden="true">
          <path className="tl-header-hamburger__burger" />
        </svg>
      </button>
    </li>
  );
}
