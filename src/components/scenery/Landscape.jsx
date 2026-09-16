import { cx } from "../../shared/classNames.js";
import { BIOMES } from "../../game/data/biomes.js";

export function Landscape({ biome = "meadow", variant = 0, large = false }) {
  const snow = biome === "snow",
    coast = biome === "coast" || biome === "lake",
    mountain = biome === "mountain";
  const tree = (x, y, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} key={`${x}-${y}`}>
      <path d="M-4 0h8v24h-8z" fill="#627858" />
      <path
        d="M-24 0v-12h8v-14h9v-13H7v13h9v14h8V0z"
        fill={snow ? "#9baea0" : "#527a59"}
      />
      <path
        d="M-18-7v-11h8v-13H3v13h9v11z"
        fill={snow ? "#eff4e9" : "#739765"}
      />
      <path d="M-12-17h8v-8h7v8h6v7h-21z" fill={snow ? "#fffdf5" : "#89a572"} />
    </g>
  );
  const house = (x, y, red = false) => (
    <g transform={`translate(${x} ${y})`} key={`${x}-${y}`}>
      <path d="M-4 43h78v8H-4z" fill="#6c825c" opacity=".2" />
      <path d="M0 0h68v44H0z" fill="#ece7cb" />
      <path d="M0 5h68v7H0z" fill="#cac8ad" />
      <path
        d="M-8 0v-9h9v-10h9v-9h45v9h9v10h12V0z"
        fill={red ? "#bd6251" : "#788887"}
      />
      <path d="M4-10h59v-7H11v7z" fill={red ? "#d88765" : "#9ca7a0"} />
      <path d="M28 21h16v23H28z" fill="#6e857b" />
      <path d="M8 16h12v13H8zm42 0h12v13H50z" fill="#9abbb1" />
      <path d="M8 20h12m36-4v13" stroke="#e9e6c8" strokeWidth="3" />
      <path d="M27 45h18v5H27z" fill="#cac6a6" />
    </g>
  );
  return (
    <svg
      className={cx("landscape", large && "large")}
      viewBox="0 0 800 280"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Paisagem em pixel art: ${BIOMES[biome]}`}
      shapeRendering="crispEdges"
    >
      <rect width="800" height="280" fill={snow ? "#dae4dc" : "#d9e2ca"} />
      <path
        d="M0 83h70V67h80V54h93v22h119V57h71v-9h104v29h134V57h69v27h60v196H0z"
        fill={snow ? "#bbcec2" : "#afc397"}
      />
      {mountain && (
        <path
          d="M-30 135 120 10l160 135L440 8l210 139 130-100 110 104"
          fill="#9ba993"
        />
      )}
      <path
        d="M0 126h95v-17h157v16h106v-20h114v10h176v-9h152v174H0z"
        fill={snow ? "#e4ece2" : "#c3d09b"}
      />
      {coast ? (
        <>
          <path d="M520 150h280v130H445v-39h38v-46h37z" fill="#b0c9c0" />
          <path
            d="M562 179h64m77 50h66m-204 24h58"
            stroke="#d7e5d2"
            strokeWidth="4"
          />
        </>
      ) : (
        <path
          d="M0 236h100v-27h42v-25h158v30h202v21h130v-25h168v70H0z"
          fill={snow ? "#d1e0d5" : "#b5c88c"}
        />
      )}
      <path d="M336 280V177h-91v-40h147v143z" fill="#e5d4aa" />
      <path d="M343 280V185h-84v-7h91v102z" fill="#ecddba" />
      {[25, 70, 118, 177, 225, 490, 542, 590, 680, 730, 780].map((x, i) =>
        tree(x, 126 + (i % 3) * 14, 0.7 + (i % 2) * 0.15),
      )}
      {house(235 + (variant % 2) * 8, 123, true)}
      {house(427, 140)}
      {house(114, 187)}
      <path d="M313 200h-19v5h19zm-20 5h5v26h-5z" fill="#7e8b69" />
      <path d="M294 206h18v9h-18z" fill="#ece0b5" />
      <g transform="translate(370 228)">
        <ellipse cy="20" rx="11" ry="4" fill="#7b966c" opacity=".3" />
        <path d="M-6 7h5v13h-5zm8 0h5v13H2z" fill="#53676b" />
        <path d="M-9-8H8V9H-9z" fill="#cb6452" />
        <path d="M-7-18H6v12H-7z" fill="#f0c5a0" />
        <path d="M-9-21H6v5h5v4H-9z" fill="#cd5c4a" />
        <path d="M-11-6h5V8h-5z" fill="#e1be7b" />
      </g>
      {[42, 87, 215, 255, 421, 465, 611, 646, 716, 758].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${210 + (i % 3) * 23}v-6m-4 5v-3m8 3v-4`}
          stroke={snow ? "#a9c0ab" : "#8ba976"}
          strokeWidth="2"
        />
      ))}
      {tree(60, 245, 1.3)}
      {tree(752, 230, 1.2)}
      {tree(707, 260, 1.05)}
    </svg>
  );
}
