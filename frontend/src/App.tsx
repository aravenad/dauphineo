import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { Alert, Container, Typography } from "@mui/material";
import { Header, Footer } from "./components";
import { Home, Reglementation, FAQ, MentionsLeg, CGU, SPR, Explorer, MonCompte } from "./pages";
import { modeDemo } from "./api";

function PageIntrouvable() {
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
        <>
            {modeDemo && (
                <Alert severity="info" sx={{ borderRadius: 0, justifyContent: "center" }}>
                    Version de démonstration : les données sont simulées dans votre navigateur et les recommandations
                    viennent du moteur local.
                </Alert>
            )}
            <Header />
            <Container component="main" sx={{ padding: "2em" }} disableGutters>
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
            </Container>
            <Footer />
        </>
    );
}

export default App;
