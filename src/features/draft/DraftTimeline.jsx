import React from "react";
import { ArrowRight } from "lucide-react";
import { cx } from "../../shared/classNames.js";

export function DraftTimeline({ r }) {
  return (
    <div className="draft-timeline">
      <div className="section-label">SUA REGIÃO ESTÁ TOMANDO FORMA</div>
      <div className="draft-chips">
        {r.route.map((c, i) => (
          <React.Fragment key={c.id}>
            {i > 0 && <ArrowRight size={14} />}
            <span className={cx(i === r.route.length - 1 && "latest")}>
              {c.name}
            </span>
          </React.Fragment>
        ))}
        <ArrowRight size={14} />
        <span className="unknown">?</span>
        <span className="draft-remaining">
          + {10 - r.route.length}{" "}
          {10 - r.route.length === 1 ? "escolha" : "escolhas"}
        </span>
      </div>
    </div>
  );
}
