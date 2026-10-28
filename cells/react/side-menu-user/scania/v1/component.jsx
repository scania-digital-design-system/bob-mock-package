function SideMenuUser({ heading, subheading, imgSrc, imgAlt, icon }) {
  return (
    <span className="tl-side-menu-user">
      <span className="tl-side-menu-user__image">
        {icon}
        {imgSrc && <img className="tl-side-menu-user__img" src={imgSrc} alt={imgAlt} />}
      </span>
      <span className="tl-side-menu-user__label">
        {heading}
        {subheading && <span className="tl-side-menu-user__subheading">{subheading}</span>}
      </span>
    </span>
  );
}
