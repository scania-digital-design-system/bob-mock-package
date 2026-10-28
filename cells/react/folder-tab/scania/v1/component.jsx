function FolderTab({ disabled = false, children }) {
  return (
    <div
      ref={(tab) => {
        if (!tab) return;
        tab.querySelectorAll('button, a').forEach((item) => {
          if (disabled) item.setAttribute('aria-disabled', 'true');
          else item.removeAttribute('aria-disabled');
        });
      }}
      className={`tl-folder-tab tl-folder-tab--disabled-${disabled}`}
    >
      {children}
    </div>
  );
}
