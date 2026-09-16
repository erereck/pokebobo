import { cx } from "../../shared/classNames.js";

export function Tag({ children, red = false }) {
  return <span className={cx("tag", red && "red")}>{children}</span>;
}
