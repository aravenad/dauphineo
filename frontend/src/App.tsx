import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Alert, Box, Container, Skeleton, Typography } from "@mui/material";
import { Header, Footer } from "./components";
import RetourEnHaut from "./components/RetourEnHaut";
import FilAriane from "./components/FilAriane";
import Home from "./pages/Home";
import { modeDemo } from "./api";
import { useTitre } from "./hooks";
import { entree } from "./animations";
import { useTextes } from "./i18n";

// L'accueil part avec le premier fichier ; les autres pages ne sont téléchargées qu'à la première visite
const Explorer = lazy(() => import("./pages/Explorer"));
const SPR = lazy(() => import("./pages/SPR"));
const MonCompte = lazy(() => import("./pages/MonCompte"));
const Reglementation = lazy(() => import("./pages/Reglementation"));
const FAQ = lazy(() => import("./pages/FAQ"));
const MentionsLeg = lazy(() => import("./pages/MentionsLeg"));
const CGU = lazy(() => import("./pages/CGU"));
function PageIntrouvable() {
    const t = useTextes({
        fr: { titre: "Page introuvable", texte: "Cette page n'existe pas." },
        en: { titre: "Page not found", texte: "This page does not exist." },
    });
    useTitre(t.titre);
    return (
        <Typography variant="h4" component="h1" sx={{ textAlign: "center", padding: "3em 0" }}>
            {t.texte}
        </Typography>
    );
}

function App() {
    const { pathname } = useLocation();
    const t = useTextes({
        fr: {
            demo: "Version de démonstration : les données sont simulées dans votre navigateur et les recommandations viennent du moteur local.",
            chargement: "Chargement de la page",
        },
        en: {
            demo: "Demo version: the data is simulated in your browser and the recommendations come from the local engine.",
            chargement: "Loading the page",
        },
    });

    // Chaque nouvelle page s'ouvre en haut
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        // Le pied de page reste en bas de l'écran même quand la page est courte
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
            {modeDemo && (
                <Alert severity="info" sx={{ borderRadius: 0, justifyContent: "center" }}>
                    {t.demo}
                </Alert>
            )}
            <Header />
            <Container component="main" sx={{ flex: "1 0 auto", padding: { xs: "1em", sm: "1.5em", md: "2em" } }} disableGutters>
                <Suspense fallback={<Skeleton variant="rounded" height={400} aria-label={t.chargement} />}>
                    {/* La clé recrée le bloc à chaque page, ce qui rejoue son animation d'arrivée */}
                    <Box key={pathname} sx={entree}>
                        {/* Sur l'accueil, le fil se réduirait à « Accueil » */}
                        {pathname !== "/" && <FilAriane />}
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
                    </Box>
                </Suspense>
            </Container>
            <Footer />
            <RetourEnHaut />
        </Box>
    );
}

export default App;
