import React from "react";
import { useLocation } from "react-router";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import {AvisSection, GuideSection} from "../components";

const SPR: React.FC = () => {
    const location = useLocation();
    const sprData = location.state?.spr; // Récupère directement l'objet SPR passé dans le state

    if (!sprData) {
        return <Typography>Aucune donnée disponible pour ce SPR.</Typography>;
    }

    return (
        <Box sx={{ padding: "2em" }}>
            <Typography variant="h4" gutterBottom>
                {sprData.nom_commune}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Département : {sprData.nom_du_departement} ({sprData.code_departement})
            </Typography>
            <Typography variant="body1" gutterBottom>
                Capacité de visite maximale : {sprData.capacite_de_visite}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Mots-clés : {sprData.mot_cle}
            </Typography>

            {/* Affichage des images */}
            {sprData.images && sprData.images.length > 0 ? (
                <Box sx={{ display: "flex", gap: "1em", flexWrap: "wrap", marginTop: "1em" }}>
                    {sprData.images.map((image: any) => (
                        <Card key={image.id} sx={{ maxWidth: 300 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={image.image_url}
                                alt={`Image de ${sprData.nom_commune}`}
                            />
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography>Aucune image disponible pour ce SPR.</Typography>
            )}
        <GuideSection guides={sprData.guides} sprId={sprData.id} />
        <AvisSection sprId = {sprData.id} id_utilisateur={1} />
        </Box>
    );
};


export default SPR;