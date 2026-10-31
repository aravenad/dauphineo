import { Fab, Tooltip, Zoom, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTextes } from "../i18n";

/** Bouton flottant qui apparaît après un peu de défilement et ramène en haut de la page. */
function RetourEnHaut() {
    const t = useTextes({
        fr: { infobulle: "Revenir en haut", libelle: "Revenir en haut de la page" },
        en: { infobulle: "Back to top", libelle: "Back to the top of the page" },
    });
    const visible = useScrollTrigger({ disableHysteresis: true, threshold: 400 });

    const remonter = () => {
        const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
    };

    return (
        <Zoom in={visible}>
            <Tooltip title={t.infobulle} placement="left">
                <Fab
                    color="primary"
                    size="medium"
                    onClick={remonter}
                    aria-label={t.libelle}
                    sx={{ position: "fixed", right: { xs: 16, md: 32 }, bottom: { xs: 16, md: 32 }, zIndex: "speedDial", "&:hover": { backgroundColor: "info.main", color: "primary.dark" } }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Tooltip>
        </Zoom>
    );
}

export default RetourEnHaut;
