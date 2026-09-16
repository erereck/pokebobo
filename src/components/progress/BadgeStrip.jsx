import { cx } from "../../shared/classNames.js";
import { Check } from "lucide-react";

export function BadgeStrip({ count = 0 }) {
  return (
    <div className="badge-strip" aria-label={`${count} de 8 insígnias`}>
      {Array.from(
        {
          length: 8,
        },
        (_, i) => (
          <span key={i} className={cx("badge", i < count && "earned")}>
            <span>{i < count ? <Check size={12} /> : i + 1}</span>
          </span>
        ),
      )}
    </div>
  );
}
