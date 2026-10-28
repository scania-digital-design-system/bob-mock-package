function Footer({ top, start, end, copyright }) {
  return (
    <footer className="tl-footer">
      {top && <div className="tl-footer__top">{top}</div>}
      <div className="tl-footer__main">
        {(start || end) && (
          <div className="tl-footer__main-top">
            {start && <div className="tl-footer__start">{start}</div>}
            {end && <div className="tl-footer__end">{end}</div>}
          </div>
        )}
        <div className="tl-footer__main-bottom">
          <small className="tl-footer__copyright">
            {copyright || `Copyright © ${new Date().getFullYear()} Scania`}
          </small>
          <div className="tl-footer__brand">
            <p>Scania</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
