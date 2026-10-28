function SideMenuUserImage({ src, alt, children }) {
  return (
    <span className="tl-side-menu-user-image">
      {children}
      {src && <img className="tl-side-menu-user-image__img" src={src} alt={alt} />}
    </span>
  );
}
