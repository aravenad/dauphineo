import { Header, Footer } from "./components/index";
import { Routes, Route } from "react-router";
import { Home, Reglementation, FAQ} from "./pages";
import { Container } from "@mui/material";
import SPR from "./pages/SPR.tsx";
import Explorer from "./pages/Explorer.tsx";
import {useEffect, useState} from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Gère l'état de connexion

    // Vérifier si un utilisateur est déjà connecté (si un token existe dans localStorage)
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token); // Si le token existe, l'utilisateur est connecté
    }, []);

    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Container sx={{ padding: "2em 2em" }} disableGutters={true}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reglementation" element={<Reglementation />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/spr" element={<SPR />} />
                    <Route path="/explorer" element={<Explorer />} />
                </Routes>
            </Container>
            <Footer />
        </>
    );
}

export default App;
