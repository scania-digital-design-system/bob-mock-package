function HeaderTitle({ children }) {
  return (
    <li className="tl-header-title">
      <h4 className="tl-header-title__heading">
        <span className="tl-header-title__text">{children}</span>
      </h4>
    </li>
  );
}
