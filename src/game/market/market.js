import catalog from "../catalog.json" with { type: "json" };
import compatibility from "../data/marketCompatibility.json" with { type: "json" };
import { MARKET_RULES, MARKET_TMS } from "../config/market.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";

export function pokemonSalePrice(mon) {
  const species = catalog[mon?.name];
  if (!species || !Number.isFinite(mon.level) || mon.level < 1) return 0;
  const total = Object.values(species.stats).reduce(
    (sum, value) => sum + value,
    0,
  );
  const value =
    MARKET_RULES.referenceValue *
    (total / MARKET_RULES.referenceStats) ** MARKET_RULES.statsExponent *
    (Math.min(100, mon.level) / MARKET_RULES.referenceLevel) **
      MARKET_RULES.levelExponent;
  return Math.max(
    MARKET_RULES.minimumValue,
    Math.round(value / MARKET_RULES.priceStep) * MARKET_RULES.priceStep,
  );
}

export function canSellPokemon(run, id) {
  return (
    run.box?.some((mon) => mon.id === id) ||
    (run.party.length > 1 && run.party.some((mon) => mon.id === id))
  );
}

export function tmEligibility(mon, tmId) {
  if (mon.moves?.includes(tmId)) return "Já conhece este golpe";
  if (!compatibility[mon.name]?.includes(tmId)) return "Não compatível";
  return "Pode aprender";
}

export function marketOffer(run, tmId) {
  const tm = MARKET_TMS.find((offer) => offer.id === tmId);
  if (!tm || run.marketPurchases?.includes(tmId)) return null;
  return tm;
}

export function marketIsOpen(run) {
  return (
    run.phase === "market" &&
    run.badges === CAMPAIGN_RULES.gymCount &&
    !run.inLeague &&
    run.leagueIndex === 0 &&
    run.league?.length === CAMPAIGN_RULES.leagueBattles
  );
}
