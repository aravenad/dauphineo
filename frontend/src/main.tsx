import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router";
import App from "./App";
import { themePour } from "./theme";
import { SessionProvider } from "./session";
import { LangueProvider, useLangue } from "./i18n";

// Le thème suit la langue pour les textes intégrés de MUI
// eslint-disable-next-line react-refresh/only-export-components
function Theme({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={themePour(useLangue().langue)}>{children}</ThemeProvider>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangueProvider>
      <Theme>
        <CssBaseline />
        {/* Sur GitHub Pages le site est servi sous /dauphineo/ */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <SessionProvider>
            <App />
          </SessionProvider>
        </BrowserRouter>
      </Theme>
    </LangueProvider>
  </StrictMode>
);
