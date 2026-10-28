import { useState } from 'react';

function Banner({
  icon,
  header,
  subheader,
  variant = 'default',
  bannerId,
  isHidden = false,
  roleType = 'banner',
  actions,
  onTdsClose,
}) {
  const [hidden, setHidden] = useState(isHidden);
  const icons = {
    info: 'M16.013 4.004c-6.642 0-12.026 5.384-12.026 12.025 0 6.642 5.384 12.026 12.026 12.026 6.641 0 12.025-5.384 12.025-12.026 0-6.641-5.384-12.025-12.025-12.025ZM1.987 16.029c0-7.746 6.28-14.025 14.026-14.025 7.746 0 14.025 6.28 14.025 14.025 0 7.746-6.28 14.026-14.025 14.026-7.746 0-14.026-6.28-14.026-14.026ZM16.025 14.126a1 1 0 0 1 1 1v5.616a1 1 0 0 1-2 0v-5.616a1 1 0 0 1 1-1Zm0-3.809a1 1 0 0 1 1 1v.217a1 1 0 1 1-2 0v-.217a1 1 0 0 1 1-1Z',
    error:
      'M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zM2 16C2 8.3 8.3 2 16 2s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16zm12.8-1.5V10h2.4v4.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4z',
    warning:
      'M14.8 16.5V13h2.4v3.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4zM16 2c.4 0 .7.2.9.5l13 25c.2.3.1.7 0 1-.2.3-.6.5-.9.5H3c-.3 0-.7-.2-.9-.5-.2-.3-.2-.7 0-1l13-25c.2-.3.5-.5.9-.5zM4.6 27h22.7L16 5.2 4.6 27z',
    tick: 'M27.7 8.5c.4.4.4 1 0 1.4L19 18.6l-1.2 1.2-4.8 4.8c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-7.4-7.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l6.6 6.7 4.1-4.1 1.2-1.2c2.4-2.4 5.2-5.1 8.6-8.7.6-.4 1.3-.4 1.6 0z',
  };
  const defaultIcons = { error: 'error', information: 'info' };
  const iconPath = icons[icon ?? defaultIcons[variant]];
  const close = () => {
    const event = new CustomEvent('tdsClose', { cancelable: true, detail: { bannerId } });
    if (onTdsClose) onTdsClose(event);
    if (!event.defaultPrevented) setHidden(true);
  };
  return (
    <div
      role={roleType}
      aria-hidden={hidden ? 'true' : 'false'}
      aria-live={roleType === 'alert' ? 'assertive' : 'polite'}
      hidden={hidden}
      className={`tl-banner tl-banner--${variant}`}
    >
      {iconPath && (
        <div className="tl-banner__icon">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d={iconPath} />
          </svg>
        </div>
      )}
      <div className="tl-banner__content">
        <div className="tl-banner__titles">
          {header && <div className="tl-banner__header">{header}</div>}
          {subheader && <div className="tl-banner__subheader">{subheader}</div>}
        </div>
        {actions && <div className="tl-banner__actions">{actions}</div>}
      </div>
      <div className="tl-banner__close">
        <button type="button" aria-label="Close banner" className="tl-banner__close-button" onClick={close}>
          <svg className="tl-banner__close-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M4.793 4.293a1 1 0 0 1 1.414 0L16.5 14.586 26.793 4.293a1 1 0 1 1 1.414 1.414L17.914 16l10.293 10.293a1 1 0 0 1-1.414 1.414L16.5 17.414 6.207 27.707a1 1 0 0 1-1.414-1.414L15.086 16 4.793 5.707a1 1 0 0 1 0-1.414Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
