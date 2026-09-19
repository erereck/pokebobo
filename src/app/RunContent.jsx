import { BagScreen } from "../features/inventory/BagScreen.jsx";
import { useEffect, useRef } from "react";
import { BattleScreen } from "../features/battle/BattleScreen.jsx";
import { ResultScreen } from "../features/battle/ResultScreen.jsx";
import { Encounter } from "../features/encounters/Encounter.jsx";
import { Career } from "../features/career/Career.jsx";
import { TeamScreen } from "../features/team/TeamScreen.jsx";
import { RegionScreen } from "../features/region/RegionScreen.jsx";
import { Journal } from "../features/journal/Journal.jsx";
import { WeekEventScreen } from "../features/events/WeekEventScreen.jsx";

export function RunContent({
  tab,
  run,
  act,
  selectedMonId,
  battleControlRef,
  onBattleSidebarChange,
}) {
  const mainRef = useRef(null);
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [tab, run.phase, run.position]);
  return (
    <main
      ref={mainRef}
      className={"play-main view-" + tab + " phase-" + run.phase}
      id="main-content"
    >
      {tab === "journey" ? (
        run.phase === "battle" ? (
          <BattleScreen
            run={run}
            act={act}
            battleControlRef={battleControlRef}
            onSidebarState={onBattleSidebarChange}
          />
        ) : run.phase === "result" ? (
          <ResultScreen run={run} act={act} />
        ) : run.phase === "encounter" ? (
          <Encounter run={run} act={act} />
        ) : run.phase === "event" ? (
          <WeekEventScreen run={run} act={act} />
        ) : (
          <Career run={run} act={act} />
        )
      ) : tab === "team" ? (
        <TeamScreen run={run} act={act} selectedMonId={selectedMonId} />
      ) : tab === "bag" ? (
        <BagScreen run={run} act={act} />
      ) : tab === "region" ? (
        <RegionScreen run={run} />
      ) : (
        <Journal run={run} />
      )}
    </main>
  );
}
