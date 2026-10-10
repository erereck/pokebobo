import cityCovers from "./cityCovers.json" with { type: "json" };

export const ROUTE_COVERS = Object.freeze(cityCovers);

// Um cenário pertence ao lugar, nunca ao seu bioma. Um mapa desconhecido
// deve ficar sem imagem em vez de mostrar outra cidade.
export const coverFor = (place) =>
  Object.hasOwn(ROUTE_COVERS, place?.id) ? ROUTE_COVERS[place.id] : undefined;
