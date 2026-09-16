export function ScreenHeading({ eyebrow, title, text }) {
  return (
    <div className="screen-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
