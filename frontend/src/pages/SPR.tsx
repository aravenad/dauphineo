import React from "react";
import { useLocation } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import SPRPhotos from "../components/SPRPhotos.tsx";
import SPRMap from "../components/SPRMap.tsx";

const SPR: React.FC = () => {
    const location = useLocation();
    const sprData = location.state?.spr;

    if (!sprData) {
        return <Typography>Aucune donnée disponible pour ce SPR.</Typography>;
    }

    const capitalizeWords = (str: string) => {
        return str
            .toLowerCase()
            .split(/(\s|-|')/)
            .map((word) => (word === "-" || word === "'" ? word : word.charAt(0).toUpperCase() + word.slice(1)))
            .join("");
    };

    return (
        <Box>
            {/* Bouton Retour à l'accueil */}
            <Box sx={{ textAlign: "left", mb: "1em", mt: "0" }}>
                <Button
                    variant="text"
                    sx={{
                        color: "gray",
                        textTransform: "none",
                        fontSize: "1rem",
                    }}
                    href={"/explorer"}
                >
                    ← Retour à la liste des SPR
                </Button>
            </Box>

            {/* Titre du SPR */}
            <Typography
                variant="h3"
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "left", mb: "0" }}
            >
                {capitalizeWords(sprData.nom_commune)}
            </Typography>

            {/* Flexbox pour description et bouton */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: "2em",
                }}
            >
                {/* Placeholder pour la description */}
                <Typography variant="body1" sx={{ maxWidth: "60%" }}>
                    {sprData.courte_description}
                </Typography>

                {/* Lien "Se proposer en tant que guide" */}
                <Button
                    variant="text"
                    sx={{
                        color: "gray",
                        textTransform: "none",
                        fontSize: "1rem",
                        textDecoration: "underline",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    Se proposer en tant que guide
                </Button>
            </Box>

            {/* Composant SPRPhotos */}
            <SPRPhotos images={sprData.images} />

            {/* Nouvelle section : Description et Map */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    mt: "4em",
                    gap: "1em",
                }}
            >
                {/* Colonne de gauche : Description */}
                <Box sx={{ flex: "3", display: "flex", flexDirection: "column", gap: "1em" }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                        }}
                    >
                        Description
                    </Typography>
                    <Typography variant="body1" fontSize="1.15rem" paddingRight="1em" textAlign="justify">
                        {sprData.longue_description}
                    </Typography>
                </Box>

                {/* Colonne de droite : SPRMap */}
                <Box sx={{ flex: "2" }}>
                    <SPRMap commune={sprData.nom_commune} />
                </Box>
            </Box>
        </Box>
    );
};

export default SPR;