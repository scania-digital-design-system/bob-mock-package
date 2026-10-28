function Block({ componentTag = 'div', children }) {
  const Tag = componentTag;
  return <Tag className="tl-block">{children}</Tag>;
}
