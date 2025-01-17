import React from "react";
import { useLocation } from "react-router";
import { Box, Typography, Button, Chip } from "@mui/material";
import SPRPhotos from "../components/SPRPhotos.tsx";
import SPRMap from "../components/SPRMap.tsx";
import AvisSection from "../components/AvisSection.tsx";

const emojiMap: Record<string, string> = {
    archeologie: "🏺",
    architecture: "🏛️",
    nature: "🌳",
    abbaye: "⛪",
    chateau: "🏰",
    medieval: "🛡️",
    musee: "🖼️",
    promenade: "🚶",
    urbain: "🏙️",
};

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

    const renderPills = (keywords: string) => {
        const keywordArray = keywords.split(" "); // Sépare les mots-clés
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    marginTop: 2,
                }}
            >
                {keywordArray.map((keyword) => (
                    <Chip
                        key={keyword}
                        label={`${emojiMap[keyword] || ""} ${keyword.charAt(0).toUpperCase()}${keyword.slice(1)}`}
                        sx={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "16px",
                            padding: "1.05em 0.5em",
                            fontSize: "1rem",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            marginRight: "0.5em",
                            border : "1px solid #e0e0e0"
                        }}
                    />
                ))}
            </Box>
        );
    };

    const renderPMRPill = (isPMR: boolean) => {
        return (
            <Chip
                label={isPMR ? "♿️ • Site adapté aux PMR" : "♿️ • Non adaptés aux PMR"}
                sx={{
                    backgroundColor: isPMR ? "#1976ff" : "#e0e0e0",
                    color: isPMR ? "white" : "#9e9e9e",
                    textDecoration: isPMR ? "none" : "line-through",
                    borderRadius: "16px",
                    padding: "1.05em 0.5em",
                    fontSize: "1rem",
                    fontWeight: 500,
                }}
            />
        );
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
                <Typography variant="body1" sx={{ maxWidth: "60%" }} fontSize="1.2em">
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

                    {/* Pills pour les mots-clés */}
                    {renderPills(sprData.mot_cle)}

                    {/* Pill PMR */}
                    <Box sx={{ marginTop: 0 }}>{renderPMRPill(sprData.is_pmr)}</Box>
                </Box>

                {/* Colonne de droite : SPRMap */}
                <Box sx={{display : "flex", flex: "2", alignItems : "center"}}>
                    <SPRMap commune={sprData.nom_commune} />
                </Box>
            </Box>

            <Box sx={{ marginTop: "150px" }}>
                <AvisSection sprId={sprData.id} id_utilisateur={1} />
            </Box>
        </Box>
    );
};


export default SPR;
