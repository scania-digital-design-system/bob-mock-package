function HeaderItem({ active = false, selected = false, children }) {
  return (
    <li className={`tl-header-item tl-header-item--active-${active} tl-header-item--selected-${selected}`}>
      {children}
    </li>
  );
}
