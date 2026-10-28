function HeaderDropdownListItem({ selected = false, size = 'md', children }) {
  return (
    <li
      className={`tl-header-dropdown-list-item tl-header-dropdown-list-item--selected-${selected} tl-header-dropdown-list-item--${size}`}
    >
      {children}
    </li>
  );
}
