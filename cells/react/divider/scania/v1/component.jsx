function Divider({ orientation = 'horizontal', variant = 'subtle' }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={`tl-divider tl-divider--${orientation} tl-divider--${variant}`}
    />
  );
}
