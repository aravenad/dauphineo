import { createTheme } from "@mui/material/styles";
import SatoshiRegular from "./assets/fonts/Satoshi-Regular.woff2";
import SatoshiMedium from "./assets/fonts/Satoshi-Medium.woff2";
import SatoshiBold from "./assets/fonts/Satoshi-Bold.woff2";
import SatoshiBlack from "./assets/fonts/Satoshi-Black.woff2";

const theme = createTheme({
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
        .join(""),
      
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body2: "span",
        },
      },
    },
  },
});

export default theme;