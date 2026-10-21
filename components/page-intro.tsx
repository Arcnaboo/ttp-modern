export function PageIntro({
  kicker = "Terörsüz Türkiye Platformu",
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="page-intro">
      <div className="site-container">
        <span className="page-intro-kicker">{kicker}</span>
        <h1 className="page-intro-title">{title}</h1>
        {lead ? <p className="page-intro-lead">{lead}</p> : null}
      </div>
    </header>
  );
}
