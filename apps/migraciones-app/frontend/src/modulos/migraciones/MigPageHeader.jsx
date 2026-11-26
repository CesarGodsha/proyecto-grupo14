export default function MigPageHeader({
  eyebrow = 'PORTAL DE ATENCIÓN · GRUPO 14',
  title,
  description,
  metaLabel,
  metaValue,
  action,
}) {
  return (
    <header className="mig-page-header">
      <div className="mig-page-header-copy">
        <span className="mig-page-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action || (
        <aside className="mig-page-header-meta">
          <span>{metaLabel}</span>
          <strong>{metaValue}</strong>
        </aside>
      )}
    </header>
  );
}
