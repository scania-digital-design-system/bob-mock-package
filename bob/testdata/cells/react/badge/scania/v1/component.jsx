function Badge({ value, size = 'lg' }) {
  return <span className={`tl-badge tl-badge--${size}`}>{value}</span>;
}
