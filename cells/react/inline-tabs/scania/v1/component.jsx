function InlineTabs({
  defaultSelectedIndex = '0',
  selectedIndex,
  leftPadding = '32',
  tdsScrollLeftAriaLabel = 'Scroll left',
  tdsScrollRightAriaLabel = 'Scroll right',
  children,
  onTdsChange,
}) {
  const select = (list, index) =>
    Array.from(list.children).forEach((tab, tabIndex) =>
      tab
        .querySelectorAll('button, a')
        .forEach((item) => item.setAttribute('aria-selected', String(tabIndex === index))),
    );
  const showScrollButtons = (wrapper) => {
    wrapper.firstElementChild.disabled = wrapper.scrollLeft <= 0;
    wrapper.lastElementChild.disabled =
      wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth;
  };
  const scroll = (event, direction) => {
    const wrapper = event.currentTarget.parentElement;
    wrapper.scrollLeft += (direction * wrapper.clientWidth) / 2;
    showScrollButtons(wrapper);
  };
  const change = (event) => {
    const tabs = Array.from(event.currentTarget.children);
    const index = tabs.findIndex((tab) => tab.contains(event.target));
    if (index < 0 || tabs[index].querySelector('[aria-disabled="true"]')) return;
    const tdsChange = new CustomEvent('tdsChange', {
      cancelable: true,
      detail: { selectedTabIndex: index },
    });
    if (onTdsChange) onTdsChange(tdsChange);
    if (!tdsChange.defaultPrevented && selectedIndex === undefined) {
      select(event.currentTarget, index);
    }
  };
  return (
    <div className={`tl-inline-tabs tl-inline-tabs--left-padding-${leftPadding}`} role="tablist">
      <div
        ref={(wrapper) => {
          if (wrapper) showScrollButtons(wrapper);
        }}
        className="tl-inline-tabs__wrapper"
        onScroll={(event) => showScrollButtons(event.currentTarget)}
      >
        <button
          type="button"
          className="tl-inline-tabs__scroll-left"
          aria-label={tdsScrollLeftAriaLabel}
          onClick={(event) => scroll(event, -1)}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M22.217 4.273a1 1 0 0 1 0 1.415l-9.888 9.888a.6.6 0 0 0 0 .848l9.888 9.888a1 1 0 0 1-1.414 1.415l-9.889-9.889a2.6 2.6 0 0 1 0-3.677l9.889-9.888a1 1 0 0 1 1.414 0Z" />
          </svg>
        </button>
        <div
          ref={(list) => {
            if (!list) return;
            if (selectedIndex !== undefined) select(list, Number(selectedIndex));
            else if (!list.querySelector('[aria-selected="true"]')) {
              select(list, Number(defaultSelectedIndex));
            }
          }}
          className="tl-inline-tabs__tabs"
          onClick={change}
        >
          {children}
        </div>
        <button
          type="button"
          className="tl-inline-tabs__scroll-right"
          aria-label={tdsScrollRightAriaLabel}
          onClick={(event) => scroll(event, 1)}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.783 27.727a1 1 0 0 1 0-1.415l9.888-9.888a.6.6 0 0 0 0-.848L9.783 5.688a1 1 0 0 1 1.414-1.415l9.889 9.889a2.6 2.6 0 0 1 0 3.676l-9.889 9.889a1 1 0 0 1-1.414 0Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
