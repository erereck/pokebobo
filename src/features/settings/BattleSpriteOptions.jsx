export function BattleSpriteOptions({ style, onChange, saved }) {
  return (
    <fieldset className="battle-sprite-options">
      <legend>Sprites de batalha</legend>
      <div>
        <button
          type="button"
          className="button secondary"
          aria-pressed={style === "3d"}
          onClick={() => onChange("3d")}
        >
          3D · modelos
        </button>
        <button
          type="button"
          className="button secondary"
          aria-pressed={style === "2d"}
          onClick={() => onChange("2d")}
        >
          2D · pixel art
        </button>
      </div>
      <p>
        Vale para os dois lados da batalha. Você pode mudar durante a partida.
      </p>
      {!saved && (
        <p role="status">
          A escolha vale agora, mas o navegador não conseguiu guardá-la para a
          próxima visita.
        </p>
      )}
    </fieldset>
  );
}
