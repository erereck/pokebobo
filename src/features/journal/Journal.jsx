import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
import { Tag } from "../../components/ui/Tag.jsx";

export function Journal({ run: r }) {
  return (
    <>
      <ScreenHeading
        eyebrow={`REGISTRO DE VIAGEM · RUN ${String(r.number).padStart(3, "0")}`}
        title="Diário da jornada"
        text="Pequenas decisões. Uma história que só existe nesta run."
      />
      <div className="journal">
        {r.journal.map((n, i) => (
          <article key={`${i}-${n.week}`}>
            <span>
              SEM.<b>{String(n.week).padStart(2, "0")}</b>
            </span>
            <p>{n.text}</p>
            {i === 0 && <Tag>AGORA</Tag>}
          </article>
        ))}
      </div>
    </>
  );
}
