import { useEffect, useState } from "react";
import {
    Stack,
    Box,
    Link,
    Avatar,
    IconButton,
    Button,
} from "@mui/material";
import { Language } from "@mui/icons-material";
import LogoVert from "../assets/dauphineo_logo_vert.png";
import { SearchBarCustom } from "./mui_custom";
import ConnexionDialog from "./ConnexionDialog";  // Assurez-vous que ConnexionDialog est importé correctement
import { fetchSPR } from "../api/endpoints/spr.tsx";
import { logoutUser } from "../api/endpoints/users.tsx";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // État de connexion
    const [sprList, setSprList] = useState<any[]>([]); // Liste des SPR

    // Charger l'état de connexion et les informations utilisateur au montage
    useEffect(() => {
        const loadUserData = () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        loadUserData();
    }, []);

    // Charger les données SPR depuis l'API
    useEffect(() => {
        const loadSPRData = async () => {
            try {
                const allSPR = await fetchSPR();
                setSprList(allSPR);
            } catch (err) {
                console.error("Erreur lors de la récupération des données SPR :", err);
            }
        };

        loadSPRData();
    }, []);

    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                // Effectuer la déconnexion via l'API avec le token Bearer
                await logoutUser(token); // Passer le token à l'API

                // Supprimer le token et les informations de l'utilisateur dans localStorage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");

                // Mettre à jour l'état de connexion
                setIsLoggedIn(false);
                console.log("Déconnexion réussie");
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        } else {
            console.log("Aucun token trouvé, déconnexion impossible");
        }
    };

    return (
        <Stack
            direction="row"
            sx={{
                padding: "1em 6em",
                borderBottom: "1px solid",
                borderBottomColor: "rgba(0,0,0,0.2)",
                justifyContent: "space-around",
                alignItems: "center",
                height: "100px",
            }}
        >
            {/* Logo */}
            <Box>
                <Link href="/#">
                    <Box
                        component="img"
                        src={LogoVert}
                        alt="logo"
                        sx={{
                            width: "auto",
                            height: "60px",
                        }}
                    />
                </Link>
            </Box>

            {/* Barre de recherche */}
            <SearchBarCustom
                placeholder="Recherche rapide"
                sprList={sprList}
                isHeader={true}
            />

            {/* Menu et actions */}
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={4}>
                <Link
                    href="/explorer"
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        color: "common.black",
                        textDecoration: "none",
                    }}
                >
                    Explorer
                </Link>
                <IconButton
                    aria-label="language-selector"
                    sx={(theme) => ({
                        color: theme.palette.common.black,
                    })}
                >
                    <Language />
                </IconButton>

                {/* Affichage conditionnel : avatar ou bouton de connexion / déconnexion */}
                {isLoggedIn ? (
                    <>
                        <Avatar
                            sx={{
                                bgcolor: "info.main",
                                width: 35,
                                height: 35,
                                fontSize: "1rem",
                            }}
                            alt="Avatar utilisateur"
                        >
                        </Avatar>
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{
                                fontWeight: 500,
                                color: "common.black",
                                textDecoration: "none",
                            }}
                        >
                            Se déconnecter
                        </Button>
                    </>
                ) : (
                    // Passer setIsLoggedIn au composant ConnexionDialog
                    <ConnexionDialog setIsLoggedIn={setIsLoggedIn} />
                )}
            </Stack>
        </Stack>
    );
}

export default Header;
