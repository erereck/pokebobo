export function spend(r, action = "") {
  r.spent++;
  r.week++;
  r.lastWeekAction = action || r.lastWeekAction || "";
}
