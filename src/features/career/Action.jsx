import { ArrowUpRight } from "lucide-react";

export function Action({ icon: I, title, detail, onClick, disabled }) {
  return (
    <button className="action" disabled={disabled} onClick={onClick}>
      <span className="action-icon">
        <I size={22} />
      </span>
      <strong>{title}</strong>
      <small>{detail}</small>
      <span className="action-cost">
        1 SEMANA <ArrowUpRight size={13} />
      </span>
    </button>
  );
}
