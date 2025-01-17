import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CardSPR from "./CardSPR"; // Assurez-vous que CardSPR est correctement importé
import { fetchTopSPR } from "../api/endpoints/spr"; // Appel à l'endpoint

const MostRatedSPR: React.FC = () => {
    const [bestRated, setBestRated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | Error>(null);

    useEffect(() => {
        const loadBestRated = async () => {
            try {
                const data = await fetchTopSPR(); // Appel à l'endpoint pour récupérer le JSON
                setBestRated(data.best_rated); // Filtre pour garder uniquement "best_rated"
            } catch (err) {
                setError(err as Error);
                console.error("Erreur lors de la récupération des SPR les mieux notés :", err);
            } finally {
                setLoading(false);
            }
        };

        loadBestRated();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                Erreur : {error.message || "Impossible de charger les SPR les mieux notés."}
            </Typography>
        );
    }

    if (bestRated.length === 0) {
        return <Typography align="center">Aucun SPR noté disponible.</Typography>;
    }

    return (
        <Box sx={{ padding: "5em 0em 0em"}}>
            {/* Titre et sous-titre */}
            <Typography variant="h4" fontWeight={700} gutterBottom align="left" marginBottom={0}>
                Découvrez les sites les mieux notés de l’Isère
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom align="left" fontSize="1.2em">
                Nos sites les mieux notés
            </Typography>

            {/* Grille des SPR */}
            <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                width="100%"
                gap={10}
                marginTop={2}
            >
                {bestRated.map((spr) => (
                    <Box key={spr.id} height="100%" width="100%">
                        <CardSPR
                            id={spr.id}
                            variante="rated"
                            averageRating={parseFloat(spr.average_note)}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MostRatedSPR;