import { useRef } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useId } from "react";

export function Modal({
  title,
  onClose,
  children,
  className = "",
  dismissible = true,
}) {
  const ref = useRef();
  const backdropPointer = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.stopPropagation();
        if (!dismissible) event.preventDefault();
        else onClose();
      }}
      onPointerDown={(event) => {
        const bounds = ref.current.getBoundingClientRect();
        backdropPointer.current =
          dismissible && event.target === ref.current &&
          (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom)
            ? { id: event.pointerId, released: false } : null;
      }}
      onPointerUp={(event) => {
        const bounds = ref.current.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (backdropPointer.current?.id === event.pointerId)
          backdropPointer.current.released = outside;
      }}
      onClick={(event) => {
        if (dismissible && event.target === ref.current &&
            backdropPointer.current?.released) onClose();
        backdropPointer.current = null;
      }}
      onPointerCancel={() => { backdropPointer.current = null; }}
    >
      <div className="modal-head">
        <h2 id={titleId}>{title}</h2>
        {dismissible && (
          <button className="icon-button" aria-label="Fechar" onClick={onClose}>
            <X />
          </button>
        )}
      </div>
      {children}
    </dialog>
  );
}
