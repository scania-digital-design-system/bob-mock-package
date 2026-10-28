function SideMenuDropdownListItem({ selected = false, children }) {
  return (
    <li
      className={`tl-side-menu-dropdown-list-item tl-side-menu-dropdown-list-item--selected-${selected}`}
    >
      {children}
    </li>
  );
}
