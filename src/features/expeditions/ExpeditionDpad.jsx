import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

export function ExpeditionDpad({ controls, disabled }) {
  return (
    <div className="field-dpad" aria-label="Controles da expedição">
      {[
        [0, -1, "cima", ArrowUp],
        [-1, 0, "esquerda", ArrowLeft],
        [0, 1, "baixo", ArrowDown],
        [1, 0, "direita", ArrowRight],
      ].map(([dx, dy, label, Icon]) => (
        <button
          key={label}
          className="hardware-button"
          aria-label={`Caminhar para ${label}`}
          disabled={disabled}
          data-field-dx={dx}
          data-field-dy={dy}
          onPointerDown={(event) => controls.press(event, dx, dy)}
          onPointerUp={controls.release}
          onPointerCancel={controls.release}
          onLostPointerCapture={controls.release}
          onClick={(event) => {
            if (event.detail === 0) controls.move(dx, dy);
          }}
        >
          <Icon size={22} />
        </button>
      ))}
    </div>
  );
}
