import { useState } from "react";
import { Avatar, Box, IconButton, Link, ListItemIcon, Menu, MenuItem, Stack, Tooltip } from "@mui/material";
import { AccountCircleOutlined, Logout } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router";
import LogoVert from "../assets/dauphineo_logo.svg";
import { ButtonCustom, SearchBarCustom } from "./mui_custom";
import api from "../api";
import { useApi } from "../hooks";
import { useSession } from "../session";

function Header() {
    const { utilisateur, verification, ouvrirConnexion, deconnecter } = useSession();
    const { donnees: sprList } = useApi(() => api.listSpr(), []);
    const [menu, setMenu] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    return (
        <Box
            component="header"
            sx={{
                // Fixée en haut sur grand écran ; sur mobile, l'en-tête sur deux lignes masquerait trop de contenu
                position: { xs: "static", md: "sticky" },
                top: 0,
                zIndex: "appBar",
                backgroundColor: "background.paper",
                padding: { xs: "0.75em 1em 1em", md: "1em 3em", lg: "1em 6em" },
                borderBottom: "1px solid",
                borderBottomColor: "rgba(0,0,0,0.2)",
                display: "flex",
                // Sur mobile : logo et navigation sur une ligne, recherche en dessous
                flexWrap: { xs: "wrap", md: "nowrap" },
                columnGap: 2,
                rowGap: 1.5,
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: { md: "100px" },
            }}
        >
            <Link component={RouterLink} to="/" aria-label="Dauphinéo, accueil">
                <Box component="img" src={LogoVert} alt="" sx={{ display: "block", height: { xs: "48px", md: "60px" } }} />
            </Link>

            <Box sx={{ order: { xs: 3, md: 0 }, width: { xs: "100%", md: "auto" }, display: "flex", justifyContent: "center" }}>
                <SearchBarCustom placeholder="Recherche rapide" sprList={sprList ?? []} isHeader />
            </Box>

            <Stack component="nav" direction="row" spacing={3} sx={{ alignItems: "center" }}>
                <Link component={RouterLink} to="/explorer" variant="body1" sx={{ fontWeight: 500, color: "common.black", textDecoration: "none" }}>
                    Explorer
                </Link>
                {utilisateur ? (
                    <>
                        <Tooltip title="Mon compte">
                            <IconButton onClick={(e) => setMenu(e.currentTarget)} aria-label="Ouvrir le menu du compte" aria-haspopup="menu">
                                <Avatar sx={{ bgcolor: "info.main", width: 35, height: 35, fontSize: "1rem" }}>
                                    {utilisateur.prenom.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
                            <MenuItem onClick={() => { setMenu(null); navigate("/mon-compte"); }}>
                                <ListItemIcon><AccountCircleOutlined fontSize="small" /></ListItemIcon>
                                Mon compte
                            </MenuItem>
                            <MenuItem onClick={() => { setMenu(null); void deconnecter().then(() => navigate("/")); }}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                Se déconnecter
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <ButtonCustom variant="contained" onClick={ouvrirConnexion} disabled={verification}>
                        Se connecter
                    </ButtonCustom>
                )}
            </Stack>
        </Box>
    );
}

export default Header;
