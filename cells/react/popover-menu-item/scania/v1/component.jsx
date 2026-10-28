function PopoverMenuItem({ disabled = false, children }) {
  return (
    <div
      className={`tl-popover-menu-item tl-popover-menu-item--disabled-${disabled}`}
      role="menuitem"
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
}
