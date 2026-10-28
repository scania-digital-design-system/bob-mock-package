function Stepper({
  orientation = 'horizontal',
  labelPosition = 'below',
  size = 'lg',
  hideLabels = false,
  stepperId,
  tdsAriaLabel = 'Progress steps',
  children,
}) {
  return (
    <div
      role="list"
      aria-label={tdsAriaLabel}
      className={`tl-stepper tl-stepper--${orientation} tl-stepper--${labelPosition} tl-stepper--${size} tl-stepper--hide-labels-${hideLabels}`}
    >
      {children}
    </div>
  );
}
