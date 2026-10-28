function Modal({
  header,
  prevent = false,
  size = 'md',
  actionsPosition = 'static',
  selector,
  referenceEl,
  show,
  closable = true,
  tdsAlertDialog = 'dialog',
  body,
  actions,
  onTdsClose,
  onTdsOpen,
}) {
  let detach;
  const close = (dialog, event) => {
    const tdsClose = new CustomEvent('tdsClose', { cancelable: true, detail: event });
    if (onTdsClose) onTdsClose(tdsClose);
    if (!tdsClose.defaultPrevented) dialog.close();
  };
  const open = (dialog) => {
    const tdsOpen = new CustomEvent('tdsOpen', { cancelable: true });
    if (onTdsOpen) onTdsOpen(tdsOpen);
    if (!tdsOpen.defaultPrevented) dialog.showModal();
  };
  return (
    <dialog
      ref={(dialog) => {
        if (!dialog) {
          if (detach) detach();
          return;
        }
        if (show === true && !dialog.open) dialog.showModal();
        if (show === false && dialog.open) dialog.close();
        const reference = referenceEl || (selector ? document.querySelector(selector) : null);
        if (!reference) return;
        const toggle = (event) => (dialog.open ? close(dialog, event) : open(dialog));
        reference.addEventListener('click', toggle);
        detach = () => reference.removeEventListener('click', toggle);
      }}
      className={`tl-modal tl-modal--${size} tl-modal--actions-${actionsPosition}`}
      role={tdsAlertDialog}
      aria-modal="true"
      aria-label={typeof header === 'string' ? header : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!prevent) close(event.currentTarget, event.nativeEvent);
      }}
      onClick={(event) => {
        if (event.target.closest('[data-dismiss-modal]')) {
          close(event.currentTarget, event.nativeEvent);
        }
      }}
    >
      <div
        className="tl-modal__backdrop"
        onClick={(event) => {
          if (!prevent) close(event.currentTarget.parentElement, event.nativeEvent);
        }}
      />
      <div className="tl-modal__box">
        <div className="tl-modal__header">
          {typeof header === 'string' ? <h1 className="tl-modal__title">{header}</h1> : header}
          {closable && (
            <button
              type="button"
              className="tl-modal__close"
              aria-label="close"
              onClick={(event) => close(event.currentTarget.closest('dialog'), event.nativeEvent)}
            >
              <svg viewBox="0 0 33 32" aria-hidden="true">
                <path d="M4.793 4.293a1 1 0 0 1 1.414 0L16.5 14.586 26.793 4.293a1 1 0 1 1 1.414 1.414L17.914 16l10.293 10.293a1 1 0 0 1-1.414 1.414L16.5 17.414 6.207 27.707a1 1 0 0 1-1.414-1.414L15.086 16 4.793 5.707a1 1 0 0 1 0-1.414Z" />
              </svg>
            </button>
          )}
        </div>
        <div className="tl-modal__body">{body}</div>
        {actions && <div className="tl-modal__actions">{actions}</div>}
      </div>
    </dialog>
  );
}
