function SideMenuItem({ selected = false, active = false, children }) {
  return (
    <div
      className={`tl-side-menu-item tl-side-menu-item--selected-${selected} tl-side-menu-item--active-${active}`}
    >
      {children}
    </div>
  );
}
