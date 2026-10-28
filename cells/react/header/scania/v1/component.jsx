function Header({ hamburger, title, children, end }) {
  return (
    <div className="tl-header">
      <nav className="tl-header__nav">
        <ul className="tl-header__list">
          {hamburger}
          {title}
          {children}
          <li className="tl-header__spacer" />
          {end}
        </ul>
      </nav>
    </div>
  );
}
