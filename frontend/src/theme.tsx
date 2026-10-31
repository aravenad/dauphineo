import { createTheme } from "@mui/material/styles";
import { enUS, frFR } from "@mui/material/locale";
import type { Langue } from "./i18n";
import SatoshiRegular from "./assets/fonts/Satoshi-Regular.woff2";
import SatoshiMedium from "./assets/fonts/Satoshi-Medium.woff2";
import SatoshiBold from "./assets/fonts/Satoshi-Bold.woff2";
import SatoshiBlack from "./assets/fonts/Satoshi-Black.woff2";

const options = {
  palette: {
    common :{
      black: "#1E1E1E",
      white: "#FCFAF9"
    },
    primary: {
      main: "#407E76",
      light: "#E8F9F4",
      dark:"#162521"
    },
    info: {
      main: "#E6AF2E",
    },
    grey: {
      50: "#F3F3F3"
    },
    text: {
      secondary: "#838383",
    },
    divider:"#838383",
  },
  typography: {
    fontFamily: ["Satoshi", "sans-serif"].join(","),
  },
  components: {
    MuiCssBaseline: {
      // Une règle par graisse utilisée : 400, 500, 700 (bold) et 800 pour les grands titres
      styleOverrides: [
        [400, SatoshiRegular],
        [500, SatoshiMedium],
        [700, SatoshiBold],
        [800, SatoshiBlack],
      ]
        .map(
          ([poids, fichier]) => `
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: ${poids};
          src: url(${fichier}) format('woff2');
        }`,
        )
        .join("") +
        // Quand le système demande moins de mouvement, animations et transitions deviennent instantanées
        `
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-delay: 0s !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }`,
      
    },
    // Le site est arrondi partout : les surfaces que MUI dessine en angle presque droit suivent le même rayon
    MuiButton: {
      styleOverrides: { root: { borderRadius: "2em" } },
    },
    MuiPopover: {
      styleOverrides: { paper: { borderRadius: "1em" } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { marginTop: 8, boxShadow: "0 8px 24px rgba(22, 37, 33, 0.12)" },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: { root: { borderRadius: "0.75em", gap: 4 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { "&:not(.MuiDialog-paperFullScreen)": { borderRadius: "1.5em" } } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: "1em" } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: "0.75em" } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: "0.5em" } },
    },
    MuiSkeleton: {
      styleOverrides: { rounded: { borderRadius: "1em" } },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body2: "span",
        },
      },
    },
  },
} satisfies Parameters<typeof createTheme>[0];

// La locale traduit les textes intégrés de MUI, comme le bouton « Fermer » des alertes
const themes = { fr: createTheme(options, frFR), en: createTheme(options, enUS) };

export function themePour(langue: Langue) {
  return themes[langue];
}
