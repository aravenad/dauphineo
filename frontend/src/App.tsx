import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Alert, Box, Container, Skeleton, Typography } from "@mui/material";
import { Header, Footer } from "./components";
import RetourEnHaut from "./components/RetourEnHaut";
import Home from "./pages/Home";
import { modeDemo } from "./api";
import { useTitre } from "./hooks";

// L'accueil part avec le premier fichier ; les autres pages ne sont téléchargées qu'à la première visite
const Explorer = lazy(() => import("./pages/Explorer"));
const SPR = lazy(() => import("./pages/SPR"));
const MonCompte = lazy(() => import("./pages/MonCompte"));
const Reglementation = lazy(() => import("./pages/Reglementation"));
const FAQ = lazy(() => import("./pages/FAQ"));
const MentionsLeg = lazy(() => import("./pages/MentionsLeg"));
const CGU = lazy(() => import("./pages/CGU"));
function PageIntrouvable() {
    useTitre("Page introuvable");
    return (
        <Typography variant="h4" component="h1" sx={{ textAlign: "center", padding: "3em 0" }}>
            Cette page n'existe pas.
        </Typography>
    );
}

function App() {
    const { pathname } = useLocation();

    // Chaque nouvelle page s'ouvre en haut
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        // Le pied de page reste en bas de l'écran même quand la page est courte
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
            {modeDemo && (
                <Alert severity="info" sx={{ borderRadius: 0, justifyContent: "center" }}>
                    Version de démonstration : les données sont simulées dans votre navigateur et les recommandations
                    viennent du moteur local.
                </Alert>
            )}
            <Header />
            <Container component="main" sx={{ flex: "1 0 auto", padding: { xs: "1em", sm: "1.5em", md: "2em" } }} disableGutters>
                <Suspense fallback={<Skeleton variant="rounded" height={400} aria-label="Chargement de la page" />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/reglementation" element={<Reglementation />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/spr/:id" element={<SPR />} />
                        <Route path="/explorer" element={<Explorer />} />
                        <Route path="/mentions-legales" element={<MentionsLeg />} />
                        <Route path="/cgu" element={<CGU />} />
                        <Route path="/mon-compte" element={<MonCompte />} />
                        <Route path="*" element={<PageIntrouvable />} />
                    </Routes>
                </Suspense>
            </Container>
            <Footer />
            <RetourEnHaut />
        </Box>
    );
}

export default App;
