import { Fab, Tooltip, Zoom, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/** Bouton flottant qui apparaît après un peu de défilement et ramène en haut de la page. */
function RetourEnHaut() {
    const visible = useScrollTrigger({ disableHysteresis: true, threshold: 400 });

    const remonter = () => {
        const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
    };

    return (
        <Zoom in={visible}>
            <Tooltip title="Revenir en haut" placement="left">
                <Fab
                    color="primary"
                    size="medium"
                    onClick={remonter}
                    aria-label="Revenir en haut de la page"
                    sx={{ position: "fixed", right: { xs: 16, md: 32 }, bottom: { xs: 16, md: 32 }, zIndex: "speedDial" }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Tooltip>
        </Zoom>
    );
}

export default RetourEnHaut;
