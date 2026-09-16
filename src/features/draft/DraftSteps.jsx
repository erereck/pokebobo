import { cx } from "../../shared/classNames.js";
import { Check } from "lucide-react";

export function DraftSteps({ step }) {
  return (
    <div className="setup-steps">
      {["Sua origem", "Seu parceiro", "Sua região"].map((x, i) => (
        <span
          key={x}
          className={cx(step === i + 1 && "current", step > i + 1 && "done")}
        >
          <b>{step > i + 1 ? <Check size={12} /> : `0${i + 1}`}</b>
          {x}
        </span>
      ))}
    </div>
  );
}
