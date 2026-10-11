import { battleVictory } from "../../game/selectors/battleVictory.js";

// Somente apresentação. Não usa o RNG da campanha nem modifica saves.
export function audioScene(run, tab = "journey", modal = null) {
  if (modal === "hall") return { track: "hall", label: "Hall da Fama" };
  if (!run) return { track: "opening", label: "Boas-vindas" };
  if (["origin", "starter", "draft", "ready"].includes(run.phase))
    return { track: "welcome", label: "Criando sua região" };
  if (run.phase === "ended")
    return { track: run.won ? "hall" : "ending", label: "Fim da jornada" };
  if (run.phase === "result")
    return {
      track: battleVictory(run) ? "victory" : "ending",
      label: "Resultado",
    };
  // Consultar a equipe no meio do combate mantém a trilha de batalha.
  if (run.phase === "battle")
    return {
      track:
        run.battle.kind === "league" &&
        run.leagueIndex >= (run.league?.length || 5) - 1
          ? "champion"
          : ["gym", "league"].includes(run.battle.kind)
            ? "gym"
            : "trainer",
      label: run.battle.name || "Batalha",
    };
  if (["encounter", "capture"].includes(run.phase)) {
    const index =
      run.captureAttempt?.index ??
      run.exploration?.activeIndex ??
      run.eventEncounterIndex ??
      run.encounters?.findIndex((mon) => !mon.used);
    return {
      track: run.encounters?.[index]?.legendary ? "legendary" : "wild",
      label: "Encontro selvagem",
    };
  }
  if (tab === "team" || tab === "bag")
    return { track: "center", label: "Cuidando da equipe" };
  const place = run.route?.[run.position],
    biome = place?.biome;
  if (run.phase === "exploration")
    return {
      track:
        run.exploration?.surfing || ["lake", "coast"].includes(biome)
          ? "surf"
          : biome === "forest"
            ? "forest"
            : ["mountain", "snow"].includes(biome)
              ? "cave"
              : ["route1", "route3", "route12"][(run.position || 0) % 3],
      label: run.routeName || "Exploração",
    };
  return {
    track:
      place?.kind === "origin"
        ? "pallet"
        : (run.position || 0) % 2
          ? "pewter"
          : "cerulean",
    label: place?.name || "Jornada",
  };
}

export function nextTrack(tracks, current, direction = 1) {
  if (!tracks.length) return null;
  const index = Math.max(
    0,
    tracks.findIndex((track) => track.id === current),
  );
  return tracks[(index + direction + tracks.length) % tracks.length].id;
}
