import { Modal } from "../../components/ui/Modal.jsx";
import { AudioOptions } from "./AudioOptions.jsx";
export function AudioDialog({ onClose }) {
  return (
    <Modal title="Som e playlist" onClose={onClose} className="audio-dialog">
      <AudioOptions />
    </Modal>
  );
}
