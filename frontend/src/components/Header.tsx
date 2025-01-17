import { useEffect, useState } from "react";
import {
    Stack,
    Box,
    Link,
    Avatar,
    Typography,
    IconButton,
} from "@mui/material";
import { Language } from "@mui/icons-material";
import LogoVert from "../assets/dauphineo_logo_vert.png";
import ConnexionDialog from "./ConnexionDialog";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInitial, setUserInitial] = useState<string | null>(null);

    useEffect(() => {
        // Vérifiez si un token est présent dans le localStorage
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user"); // Exemple : récupère un nom ou email

        if (token && user) {
            setIsLoggedIn(true);
            setUserInitial(user.charAt(0).toUpperCase()); // Initialise l'initiale de l'utilisateur
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <Stack
            direction="row"
            sx={{
                padding: "1em 6em",
                borderBottom: "1px solid",
                borderBottomColor: "rgba(0,0,0,0.2)",
                justifyContent: "space-between",
                alignItems: "center",
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
                            width: "40%",
                            height: "auto",
                        }}
                    />
                </Link>
            </Box>

            {/* Menu principal */}
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={4}>
                <Link
                    href="#"
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

                {/* Affichage conditionnel */}
                {isLoggedIn ? (
                    <Avatar
                        sx={{
                            bgcolor: "info.main",
                            width: 35,
                            height: 35,
                            fontSize: "1rem",
                        }}
                        alt="Avatar utilisateur"
                    >
                        {userInitial || "?"}
                    </Avatar>
                ) : (
                    <ConnexionDialog />
                )}
            </Stack>
        </Stack>
    );
}

export default Header;
