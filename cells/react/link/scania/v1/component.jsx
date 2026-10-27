function Link({
  href,
  target,
  children,
  disabled = false,
  underline = true,
  standalone = false,
}) {
  return (
    <a
      href={href}
      target={target}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      className={`tl-link tl-link--underline-${underline} tl-link--standalone-${standalone}`}
    >
      {children}
    </a>
  );
}
