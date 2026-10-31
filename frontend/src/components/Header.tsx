import { useState } from "react";
import { Avatar, Box, ButtonBase, IconButton, Link, ListItemIcon, Menu, MenuItem, Stack, Tooltip, useScrollTrigger } from "@mui/material";
import { AccountCircleOutlined, Logout } from "@mui/icons-material";
import { Link as RouterLink, NavLink, useNavigate } from "react-router";
import LogoVert from "../assets/dauphineo_logo.svg";
import { ButtonCustom, SearchBarCustom } from "./mui_custom";
import api from "../api";
import { useApi } from "../hooks";
import { useSession } from "../session";
import { useLangue, useTextes } from "../i18n";

const TEXTES = {
    fr: {
        accueil: "Dauphinéo, accueil",
        recherche: "Recherche rapide",
        explorer: "Explorer",
        compte: "Mon compte",
        ouvrirMenu: "Ouvrir le menu du compte",
        deconnexion: "Se déconnecter",
        connexion: "Se connecter",
        autreLangue: "EN",
        changerLangue: "Switch to English",
    },
    en: {
        accueil: "Dauphinéo, home",
        recherche: "Quick search",
        explorer: "Explore",
        compte: "My account",
        ouvrirMenu: "Open the account menu",
        deconnexion: "Log out",
        connexion: "Log in",
        autreLangue: "FR",
        changerLangue: "Passer en français",
    },
};

function Header() {
    const { utilisateur, verification, ouvrirConnexion, deconnecter } = useSession();
    const { donnees: sprList } = useApi(() => api.listSpr(), []);
    const [menu, setMenu] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();
    const { langue, changerLangue } = useLangue();
    const t = useTextes(TEXTES);
    // Une ombre détache l'en-tête fixé du contenu qui défile dessous
    const defile = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

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
                boxShadow: { md: defile ? "0 6px 20px rgba(22, 37, 33, 0.12)" : "none" },
                transition: "box-shadow 0.2s ease",
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
            <Link component={RouterLink} to="/" aria-label={t.accueil}>
                <Box component="img" src={LogoVert} alt="" sx={{ display: "block", height: { xs: "51px", md: "64px" } }} />
            </Link>

            <Box sx={{ order: { xs: 3, md: 0 }, width: { xs: "100%", md: "auto" }, display: "flex", justifyContent: "center" }}>
                <SearchBarCustom placeholder={t.recherche} sprList={sprList ?? []} isHeader />
            </Box>

            <Stack component="nav" direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Link
                    component={NavLink}
                    to="/explorer"
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        color: "common.black",
                        textDecoration: "none",
                        px: 2,
                        py: 1,
                        borderRadius: "2em",
                        transition: "background-color 0.2s ease, color 0.2s ease",
                        "&:hover, &[aria-current='page']": { backgroundColor: "primary.light", color: "primary.dark" },
                    }}
                >
                    {t.explorer}
                </Link>
                <ButtonBase
                    onClick={() => changerLangue(langue === "fr" ? "en" : "fr")}
                    aria-label={t.changerLangue}
                    lang={langue === "fr" ? "en" : "fr"}
                    sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        color: "primary.dark",
                        minWidth: 44,
                        height: 36,
                        px: 1.5,
                        borderRadius: "2em",
                        border: "1px solid",
                        borderColor: "primary.main",
                        transition: "background-color 0.2s ease",
                        "&:hover, &.Mui-focusVisible": { backgroundColor: "primary.light" },
                    }}
                >
                    {t.autreLangue}
                </ButtonBase>
                {utilisateur ? (
                    <>
                        <Tooltip title={t.compte}>
                            <IconButton onClick={(e) => setMenu(e.currentTarget)} aria-label={t.ouvrirMenu} aria-haspopup="menu">
                                <Avatar sx={{ bgcolor: "info.main", width: 35, height: 35, fontSize: "1rem" }}>
                                    {utilisateur.prenom.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
                            <MenuItem onClick={() => { setMenu(null); navigate("/mon-compte"); }}>
                                <ListItemIcon><AccountCircleOutlined fontSize="small" /></ListItemIcon>
                                {t.compte}
                            </MenuItem>
                            <MenuItem onClick={() => { setMenu(null); void deconnecter().then(() => navigate("/")); }}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                {t.deconnexion}
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <ButtonCustom variant="contained" onClick={ouvrirConnexion} disabled={verification} sx={{ whiteSpace: "nowrap" }}>
                        {t.connexion}
                    </ButtonCustom>
                )}
            </Stack>
        </Box>
    );
}

export default Header;
