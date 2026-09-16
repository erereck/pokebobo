import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
import { RegionMap } from "./RegionMap.jsx";
import { Compass } from "lucide-react";

export function RegionScreen({ run: r }) {
  return (
    <section className="region-screen">
      <ScreenHeading
        eyebrow="O MAPA QUE VOCÊ ESCOLHEU"
        title="Mapa da região"
        text="Olhe adiante. Lembre dos jogos. Prepare o time para o que vem."
      />
      <RegionMap run={r} />
      <div className="notice">
        <Compass size={18} />
        <p>
          As cidades foram escolhidas por você. Os encontros de cada rota são
          sorteados ao chegar.
        </p>
      </div>
    </section>
  );
}
