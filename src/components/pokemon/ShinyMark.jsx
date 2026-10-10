export function ShinyMark({ shiny }) {
  return shiny ? (
    <span className="shiny-mark" role="img" aria-label="Shiny" title="Shiny">
      ✦
    </span>
  ) : null;
}
