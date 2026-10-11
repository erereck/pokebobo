import {
  VOLATILE_CONDITIONS,
  SIDE_CONDITIONS,
  FIELD_CONDITIONS,
  WEATHER_NAMES,
  TERRAIN_NAMES,
} from "../../game/data/battleConditions.js";

export function FieldConditions({ mon, field, side }) {
  if (!mon) {
    const entries = [
      ...(field?.weather
        ? [
            [
              WEATHER_NAMES[field.weather] || field.weather,
              "Clima atual do campo.",
            ],
          ]
        : []),
      ...(field?.terrain
        ? [
            [
              TERRAIN_NAMES[field.terrain] || field.terrain,
              "Terreno atual; seus efeitos dependem de o Pokémon estar tocando o chão.",
            ],
          ]
        : []),
      ...(field?.effects || []).map((id) => FIELD_CONDITIONS[id]),
    ].filter(Boolean);
    return entries.length ? (
      <div className="notebook-environment">
        {entries.map(([name, text]) => (
          <p key={name}>
            <strong>{name}</strong>
            <span>{text}</span>
          </p>
        ))}
      </div>
    ) : null;
  }
  const entries = [
    ...(mon.conditions || []).map((id) => VOLATILE_CONDITIONS[id]),
    ...(
      field?.sides?.find((entry) => entry.side === side)?.conditions || []
    ).map(({ id, layers }) => {
      const entry = SIDE_CONDITIONS[id];
      return (
        entry && [
          entry[0] + (layers > 1 ? ` · ${layers} camadas` : ""),
          entry[1],
        ]
      );
    }),
  ].filter(Boolean);
  return entries.length ? (
    <ul className="notebook-conditions">
      {entries.map(([name, text]) => (
        <li key={name}>
          <strong>{name}</strong>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  ) : null;
}
