import { createTheme } from "@mui/material/styles";
import SatoshiLight from './assets/fonts/Satoshi-Light.ttf'
import SatoshiRegular from './assets/fonts/Satoshi-Regular.ttf'
import SatoshiMedium from './assets/fonts/Satoshi-Medium.ttf'
import SatoshiBold from './assets/fonts/Satoshi-Bold.ttf'
import SatoshiBlack from './assets/fonts/Satoshi-Black.ttf'

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
      styleOverrides: `
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Satoshi'), local('Satoshi-Regular'), url(${SatoshiRegular}) format('woff2');
          unicodeRange: U+0000-00FF;
        },
         @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: 300;
          src: local('Satoshi'), local('Satoshi-Light'), url(${SatoshiLight}) format('woff2');
          unicodeRange: U+0000-00FF;
        },
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Satoshi'), local('Satoshi-Medium'), url(${SatoshiMedium}) format('woff2');
          unicodeRange: U+0000-00FF;
        },
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('Satoshi'), local('Satoshi-Bold'), url(${SatoshiBold}) format('woff2');
          unicodeRange: U+0000-00FF;
        }
          @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight:800;
          src: local('Satoshi'), local('Satoshi-Black'), url(${SatoshiBlack}) format('woff2');
          unicodeRange: U+0000-00FF;
        }
      `,
      
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