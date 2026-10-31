import { Link as RouterLink, useLocation } from "react-router";
import { Breadcrumbs, Link, Skeleton, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTitreCourant } from "../hooks";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: { nav: "Fil d'Ariane", accueil: "Accueil", explorer: "Explorer les sites" },
    en: { nav: "Breadcrumb", accueil: "Home", explorer: "Explore the sites" },
};

/** Le chemin de la page affichée depuis l'accueil ; la dernière étape est le titre de la page. */
function FilAriane() {
    const { pathname } = useLocation();
    const titre = useTitreCourant();
    const t = useTextes(TEXTES);

    // Une fiche de site se range sous l'explorateur ; les autres pages partent directement de l'accueil
    const etapes = [{ libelle: t.accueil, lien: "/" }, ...(pathname.startsWith("/spr/") ? [{ libelle: t.explorer, lien: "/explorer" }] : [])];

    return (
        <Breadcrumbs aria-label={t.nav} separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2, color: "text.secondary" }}>
            {etapes.map(({ libelle, lien }) => (
                <Link key={lien} component={RouterLink} to={lien} underline="hover" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    {libelle}
                </Link>
            ))}
            {titre ? (
                <Typography aria-current="page" sx={{ color: "text.primary", fontWeight: 600 }}>
                    {titre}
                </Typography>
            ) : (
                <Skeleton variant="text" width={120} />
            )}
        </Breadcrumbs>
    );
}

export default FilAriane;
