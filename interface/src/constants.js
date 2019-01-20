import Color from "color";

const RAW_JQUERY_COLORS = {
  aqua: "#00ffff",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgrey: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkviolet: "#9400d3",
  fuchsia: "#ff00ff",
  gold: "#ffd700",
  green: "#008000",
  indigo: "#4b0082",
  khaki: "#f0e68c",
  lightblue: "#add8e6",
  lightcyan: "#e0ffff",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  magenta: "#ff00ff",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  orange: "#ffa500",
  pink: "#ffc0cb",
  purple: "#800080",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  white: "#ffffff",
  yellow: "#ffff00"
};

export const JQUERY_COLORS = (() => {
  const out = {};
  Object.keys(RAW_JQUERY_COLORS).map((name) => {
    const value = RAW_JQUERY_COLORS[name];
    out[name] = Color(value);
  });
  return out;
})();

export const ALPHABET_COLORS = {
  A: JQUERY_COLORS.aqua.alpha(0.4),
  C: JQUERY_COLORS.gold.alpha(0.4),
  D: JQUERY_COLORS.green.alpha(0.4),
  E: JQUERY_COLORS.black.alpha(0.4),
  F: JQUERY_COLORS.blue.alpha(0.4),
  G: JQUERY_COLORS.brown.alpha(0.4),
  H: JQUERY_COLORS.cyan.alpha(0.4),
  I: JQUERY_COLORS.darkblue.alpha(0.4),
  K: JQUERY_COLORS.darkcyan.alpha(0.4),
  L: JQUERY_COLORS.darkgrey.alpha(0.4),
  M: JQUERY_COLORS.darkgreen.alpha(0.4),
  N: JQUERY_COLORS.darkkhaki.alpha(0.4),
  P: JQUERY_COLORS.darkmagenta.alpha(0.4),
  Q: JQUERY_COLORS.darkolivegreen.alpha(0.4),
  R: JQUERY_COLORS.darkorange.alpha(0.4),
  S: JQUERY_COLORS.darkorchid.alpha(0.4),
  T: JQUERY_COLORS.darkred.alpha(0.4),
  V: JQUERY_COLORS.darksalmon.alpha(0.4),
  W: JQUERY_COLORS.darkviolet.alpha(0.4),
  Y: JQUERY_COLORS.fuchsia.alpha(0.4)
};
