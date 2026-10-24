import { heroEpithet } from "../../game/heroes/heroes.js";

export function PokemonFeats({ mon, run }) {
  const record = run.heroRecords?.[mon.id];
  return (
    <section
      className="pokemon-feats"
      aria-label={`Feitos de ${mon.nickname || mon.name}`}
    >
      <div className="section-head">
        <h3>História desse parceiro</h3>
        {record?.battles > 0 && (
          <span className="tag">{heroEpithet(record)}</span>
        )}
      </div>
      <dl>
        <div>
          <dt>Nocautes diretos</dt>
          <dd>{record?.knockouts || 0}</dd>
        </div>
        <div>
          <dt>Vitórias em campo</dt>
          <dd>{record?.wins || 0}</dd>
        </div>
        <div>
          <dt>Vitórias após 1 HP</dt>
          <dd>{record?.clutches || 0}</dd>
        </div>
      </dl>
      <p className="muted small">
        {record?.battles
          ? `${record.battles} combate(s) em campo. O feito de 1 HP exige resistir a um golpe e vencer sem cair. Efeitos residuais e ataques adiados não contam como nocautes diretos.`
          : "Os feitos começam nos próximos combates concluídos em que entrar em campo."}
      </p>
    </section>
  );
}
