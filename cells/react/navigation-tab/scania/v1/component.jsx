function NavigationTab({ disabled = false, children }) {
  return (
    <div
      ref={(tab) => {
        if (!tab) return;
        tab.querySelectorAll('button, a').forEach((item) => {
          if (disabled) item.setAttribute('aria-disabled', 'true');
          else item.removeAttribute('aria-disabled');
        });
      }}
      className={`tl-navigation-tab tl-navigation-tab--disabled-${disabled}`}
    >
      {children}
    </div>
  );
}
