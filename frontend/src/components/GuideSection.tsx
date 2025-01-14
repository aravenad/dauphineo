import {Box} from "@mui/material";

import {CardGuide, ChoixVisite} from "./index.ts";

// Composant principal
function GuideSection() {
    return (
        <>
            <h1>Guides disponibles</h1>
            <Box
                sx={{
                    display: "flex", // Active Flexbox
                    flexWrap: "wrap", // Permet le passage à la ligne si nécessaire
                    justifyContent: "center", // Centre les éléments horizontalement
                    gap: 3, // Espace entre les cartes
                    padding: 3, // Espacement interne pour le conteneur
                }}
            >
                <CardGuide />
                <CardGuide />
                <CardGuide />
                <CardGuide />
                <ChoixVisite/>
            </Box>
        </>

    );
}

export default GuideSection;