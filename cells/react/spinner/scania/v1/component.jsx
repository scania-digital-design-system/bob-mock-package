function Spinner({ size = 'lg', variant = 'standard' }) {
  return (
    <div aria-live="assertive" role="status" aria-label="loading" className="tl-spinner">
      <svg className={`tl-spinner__svg tl-spinner__svg--${size}`} aria-hidden="true">
        <circle className={`tl-spinner__circle tl-spinner__circle--${variant}`} />
      </svg>
    </div>
  );
}
