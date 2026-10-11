import { useEffect, useState } from "react";
import {
  invitationFromLocation,
  parseInvitation,
} from "../../shared/regionInvitation.js";

export function useRegionInvitation({
  run,
  name,
  mode,
  moveLearningMode,
  act,
  setModal,
  setError,
  switchSaveSlot,
}) {
  const [invitationText, setInvitationText] = useState(() =>
    invitationFromLocation(window.location),
  );
  const [incomingInvitation, setIncomingInvitation] = useState(() =>
    Boolean(invitationFromLocation(window.location)),
  );
  useEffect(() => {
    const receive = () => {
      const code = invitationFromLocation(window.location);
      setInvitationText(code);
      setIncomingInvitation(Boolean(code));
      setModal(null);
    };
    window.addEventListener("hashchange", receive);
    return () => window.removeEventListener("hashchange", receive);
  }, [setModal]);
  const clearLocation = () => {
    if (invitationFromLocation(window.location))
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    setIncomingInvitation(false);
  };
  const startJourney = () => {
    try {
      const invitation = parseInvitation(invitationText);
      if (run && run.phase !== "ended") return;
      if (
        act({
          type: "NEW",
          name,
          mode,
          moveLearningMode,
          seed: invitation?.seed,
          fixedSeedDraft: Boolean(invitation && !invitation.challenge),
          challenge: invitation?.challenge,
        })
      ) {
        clearLocation();
        setInvitationText("");
        setModal(null);
      }
    } catch (e) {
      setError(e.message);
    }
  };
  const closeInvitation = () => {
    clearLocation();
    setModal(null);
  };
  const switchInvitationSlot = (slot) => {
    if (switchSaveSlot(slot)) {
      setIncomingInvitation(false);
      setModal("challenge");
    }
  };
  return {
    invitationText,
    setInvitationText,
    incomingInvitation,
    startJourney,
    closeInvitation,
    switchInvitationSlot,
  };
}
