function Tag({ text, size = 'lg', variant = 'Neutral', prefix }) {
  return (
    <div className={`tl-tag tl-tag--${size} tl-tag--${variant}`}>
      <div className="tl-tag__content">
        {prefix}
        <span>{text}</span>
      </div>
    </div>
  );
}
