function HeaderDropdownListUser({ imgUrl, imgAlt, header, subheader, thumbnail }) {
  return (
    <li className="tl-header-dropdown-list-user">
      <div className="tl-header-dropdown-list-user__box">
        {imgUrl && <img className="tl-header-dropdown-list-user__image" src={imgUrl} alt={imgAlt} />}
        {thumbnail && <span className="tl-header-dropdown-list-user__thumbnail">{thumbnail}</span>}
        <div className="tl-header-dropdown-list-user__content">
          <div className="tl-header-dropdown-list-user__header">{header}</div>
          <div className="tl-header-dropdown-list-user__subheader">{subheader}</div>
        </div>
      </div>
    </li>
  );
}
