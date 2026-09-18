import { handleNew } from "../actions/new.js";
import { handleOtherOrigins } from "../actions/other-origins.js";
import { handleOrigin } from "../actions/origin.js";
import { handleStarter } from "../actions/starter.js";
import { handleDraft } from "../actions/draft.js";
import { handleBegin } from "../actions/begin.js";
import { handleLead } from "../actions/lead.js";
import { handleTrain } from "../actions/train.js";
import { handleExplore } from "../actions/explore.js";
import { handleCapture } from "../actions/capture.js";
import { handleSkipEncounter } from "../actions/skip-encounter.js";
import { handleForage } from "../actions/forage.js";
import { handlePrepare } from "../actions/prepare.js";
import { handleChallenge } from "../actions/challenge.js";
import { handleBattleChoice } from "../actions/battle-choice.js";
import { handleResult } from "../actions/result.js";
import { handleAbandon } from "../actions/abandon.js";
import { handleEventChoice } from "../actions/event-choice.js";
import { handleMoveChoice } from "../actions/move-choice.js";
import { handleBox } from "../actions/box.js";
import { handleReorderParty } from "../actions/reorder-party.js";

const handlers = {
  NEW: handleNew,
  OTHER_ORIGINS: handleOtherOrigins,
  ORIGIN: handleOrigin,
  STARTER: handleStarter,
  DRAFT: handleDraft,
  BEGIN: handleBegin,
  LEAD: handleLead,
  TRAIN: handleTrain,
  EXPLORE: handleExplore,
  CAPTURE: handleCapture,
  SKIP_ENCOUNTER: handleSkipEncounter,
  FORAGE: handleForage,
  PREPARE: handlePrepare,
  CHALLENGE: handleChallenge,
  BATTLE_CHOICE: handleBattleChoice,
  RESULT: handleResult,
  ABANDON: handleAbandon,
  EVENT_CHOICE: handleEventChoice,
  MOVE_CHOICE: handleMoveChoice,
  BOX_TO_RESERVE: handleBox,
  BOX_TO_PARTY: handleBox,
  BOX_SWAP: handleBox,
  REORDER_PARTY: handleReorderParty,
};
export function reducer(state, action) {
  const handler = handlers[action.type];
  if (!handler || (action.type !== "NEW" && !state.run)) return state;
  return handler(structuredClone(state), action, state);
}
