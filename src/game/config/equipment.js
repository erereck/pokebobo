export const HELD_ITEMS = Object.freeze([
  {
    id: "leftovers",
    name: "Leftovers",
    price: 1200,
    tag: "RECUPERAÇÃO",
    description:
      "Recupera 1/16 do HP máximo ao fim de cada turno. Pode ser usado em várias batalhas.",
    consumable: false,
  },
  {
    id: "focussash",
    name: "Focus Sash",
    price: 700,
    tag: "ÚLTIMA CHANCE",
    description:
      "Com HP cheio, resiste a um golpe que o derrubaria e fica com 1 HP. Consumido quando ativa; não protege de dano residual ou de golpes seguintes.",
    consumable: true,
  },
  {
    id: "choicescarf",
    name: "Choice Scarf",
    price: 1000,
    tag: "VELOCIDADE",
    description:
      "Aumenta a Velocidade em 50%, mas prende no primeiro golpe escolhido até sair de campo. Não é consumido.",
    consumable: false,
  },
]);
