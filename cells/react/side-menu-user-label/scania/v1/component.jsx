function SideMenuUserLabel({ heading, subheading }) {
  return (
    <span className="tl-side-menu-user-label">
      {heading}
      {subheading && <span className="tl-side-menu-user-label__subheading">{subheading}</span>}
    </span>
  );
}
