function Accordion({ hideLastBorder = false, children }) {
  return (
    <div className={`tl-accordion tl-accordion--hide-last-border-${hideLastBorder}`}>
      {children}
    </div>
  );
}
