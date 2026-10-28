function Icon({ name = 'truck', size = '16px', svgTitle, tdsAriaHidden = false, svgDescription }) {
  return (
    <svg
      className={`tl-icon tl-icon--${name}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-hidden={tdsAriaHidden}
      aria-labelledby={svgTitle ? `title-${name}` : undefined}
      aria-describedby={svgDescription ? `desc-${name}` : undefined}
    >
      {svgTitle && <title id={`title-${name}`}>{svgTitle}</title>}
      {svgDescription && <desc id={`desc-${name}`}>{svgDescription}</desc>}
      <path className="tl-icon__path" />
    </svg>
  );
}
