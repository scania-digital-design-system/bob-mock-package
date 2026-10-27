function Card({
  header,
  subheader,
  thumbnail,
  bodyImg,
  bodyImgAlt,
  bodyImage,
  bodyDivider = false,
  body,
  actions,
  imagePlacement = 'below-header',
  clickable = false,
  stretch = false,
  expandable = false,
  expanded = false,
  cardId,
  onTdsClick,
}) {
  const headerId = cardId ? `header-${cardId}` : undefined;
  const bodyId = cardId ? `body-${cardId}` : undefined;
  const below = imagePlacement === 'below-header';
  const above = imagePlacement === 'above-header';

  const titles = (
    <>
      {thumbnail ? <span className="tl-card__thumbnail">{thumbnail}</span> : null}
      <span className="tl-card__titles" id={headerId}>
        {header ? <span className="tl-card__title">{header}</span> : null}
        {subheader ? <span className="tl-card__subtitle">{subheader}</span> : null}
      </span>
    </>
  );
  const headerElement = expandable ? (
    <summary className="tl-card__header">
      {titles}
      <span className="tl-card__chevron" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="100%" height="100%">
          <path d="M1.65 5.15l.7-.7L8 10.1l5.65-5.65.7.7L8 11.5z" />
        </svg>
      </span>
    </summary>
  ) : (
    <div className="tl-card__header">{titles}</div>
  );
  const image = (
    <>
      {bodyImage ? <div className="tl-card__body-image">{bodyImage}</div> : null}
      {bodyImg ? <img className="tl-card__img" src={bodyImg} alt={bodyImgAlt} /> : null}
    </>
  );
  const divider = bodyDivider ? <hr className="tl-card__divider" /> : null;
  const bodyText = body ? <div className="tl-card__body-text">{body}</div> : null;

  const content = expandable ? (
    <>
      {above ? image : null}
      <details className="tl-card__expander" open={expanded}>
        {headerElement}
        <div className="tl-card__body" id={bodyId}>
          {below ? image : null}
          {divider}
          {bodyText}
        </div>
      </details>
    </>
  ) : (
    <>
      {below ? headerElement : null}
      <div className="tl-card__body" id={bodyId}>
        {image}
        {above ? headerElement : null}
        {divider}
        {bodyText}
      </div>
    </>
  );
  const inner = (
    <div
      className={`tl-card__inner tl-card__inner--stretch-${stretch}`}
      aria-describedby={body ? bodyId : undefined}
    >
      {content}
      {actions ? <div className="tl-card__actions">{actions}</div> : null}
    </div>
  );

  if (clickable) {
    return (
      <button
        type="button"
        className={`tl-card tl-card--stretch-${stretch} tl-card--clickable-${clickable}`}
        aria-label={header || (cardId ? `Card ${cardId}` : 'Card')}
        aria-describedby={headerId}
        onClick={() => {
          if (onTdsClick) {
            onTdsClick(new CustomEvent('tdsClick', { detail: { cardId } }));
          }
        }}
      >
        {inner}
      </button>
    );
  }
  return (
    <div className={`tl-card tl-card--stretch-${stretch} tl-card--clickable-${clickable}`}>
      {inner}
    </div>
  );
}
