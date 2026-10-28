function BodyCell({
  cellValue,
  cellKey,
  disablePadding = false,
  textAlign,
  verticalAlign = 'top',
  colSpan,
  rowSpan,
  children,
}) {
  return (
    <td
      className={`tl-body-cell tl-body-cell--${verticalAlign} tl-body-cell--disable-padding-${disablePadding}`}
      data-cell-key={cellKey}
      data-text-align={textAlign}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {cellValue}
      {children}
    </td>
  );
}
