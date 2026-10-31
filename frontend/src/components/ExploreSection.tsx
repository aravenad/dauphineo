import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface ExploreSectionProps {
    titre: string;
    sousTitre: string;
    children: ReactNode;
    action?: ReactNode;
}

/** Une rangée de cartes SPR sur l'accueil. */
function ExploreSection({ titre, sousTitre, children, action }: ExploreSectionProps) {
    return (
        <Box component="section" sx={{ pt: "4em" }}>
            <Typography variant="h4" component="h2" fontWeight={700}>
                {titre}
            </Typography>
            <Typography color="text.secondary" fontSize="1.2em">
                {sousTitre}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 2, md: 4 }, mt: 2 }}>
                {children}
            </Box>
            {action && <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>{action}</Box>}
        </Box>
    );
}

export default ExploreSection;
