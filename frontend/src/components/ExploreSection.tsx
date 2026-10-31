import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { entreeEnCascade, useVisible } from "../animations";

interface ExploreSectionProps {
    titre: string;
    sousTitre: string;
    children: ReactNode;
    action?: ReactNode;
}

/** Une rangée de cartes SPR sur l'accueil. */
function ExploreSection({ titre, sousTitre, children, action }: ExploreSectionProps) {
    // Les cartes arrivent quand la rangée entre à l'écran, pas toutes au chargement de la page
    const { ref, visible } = useVisible<HTMLElement>();

    return (
        <Box component="section" ref={ref} sx={{ pt: "4em" }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                {titre}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "1.2em" }}>
                {sousTitre}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 2, md: 4 }, mt: 2, ...entreeEnCascade(visible) }}>
                {children}
            </Box>
            {action && <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>{action}</Box>}
        </Box>
    );
}

export default ExploreSection;
