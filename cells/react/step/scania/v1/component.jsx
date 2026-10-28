function Step({ index, state = 'upcoming', tdsAriaCurrent, label }) {
  const icons = {
    success:
      'M27.7 8.5c.4.4.4 1 0 1.4L19 18.6l-1.2 1.2-4.8 4.8c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-7.4-7.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l6.6 6.7 4.1-4.1 1.2-1.2c2.4-2.4 5.2-5.1 8.6-8.7.6-.4 1.3-.4 1.6 0z',
    error:
      'M14.8 16.5V13h2.4v3.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4zM16 2c.4 0 .7.2.9.5l13 25c.2.3.1.7 0 1-.2.3-.6.5-.9.5H3c-.3 0-.7-.2-.9-.5-.2-.3-.2-.7 0-1l13-25c.2-.3.5-.5.9-.5zM4.6 27h22.7L16 5.2 4.6 27z',
  };
  return (
    <div
      role="listitem"
      aria-disabled={state === 'upcoming' ? 'true' : 'false'}
      aria-current={tdsAriaCurrent}
      tabIndex={-1}
      aria-label={`Step ${index}: ${state}`}
      className={`tl-step tl-step--${state}`}
    >
      <span className="tl-step__marker">
        {icons[state] ? (
          <svg className="tl-step__icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d={icons[state]} />
          </svg>
        ) : (
          <span aria-hidden="true">{index}</span>
        )}
      </span>
      <div aria-hidden="true" className="tl-step__label">
        {label}
      </div>
    </div>
  );
}
