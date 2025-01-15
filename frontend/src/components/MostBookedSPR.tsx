import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CardSPR from "./CardSPR"; // Assurez-vous que CardSPR est correctement importé
import { fetchTopSPR } from "../api/endpoints/spr"; // Appel à l'endpoint

const MostBookedSPR: React.FC = () => {
    const [mostVisited, setMostVisited] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | Error>(null);

    useEffect(() => {
        const loadMostVisited = async () => {
            try {
                const data = await fetchTopSPR(); // Appel à l'endpoint pour récupérer le JSON
                setMostVisited(data.most_visited.slice(0, 3)); // Limite à 3 éléments
            } catch (err) {
                setError(err as Error);
                console.error("Erreur lors de la récupération des SPR les plus visités :", err);
            } finally {
                setLoading(false);
            }
        };

        loadMostVisited();
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
                Erreur : {error.message || "Impossible de charger les SPR les plus visités."}
            </Typography>
        );
    }

    if (mostVisited.length === 0) {
        return <Typography align="center">Aucun SPR visité disponible.</Typography>;
    }

    return (
        <Box sx={{ padding: "5em 0em 0em" }}>
            {/* Titre et sous-titre */}
            <Typography variant="h4" fontWeight={700} gutterBottom align="left" marginBottom={0}>
                Différentes façons de visiter l’Isère
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom align="left" fontSize="1.2em">
                Nos sites les plus visités
            </Typography>

            {/* Flex des SPR */}
            <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                width="100%"
                gap={10}
                marginTop={2}
            >
                {mostVisited.map((spr) => (
                    <Box key={spr.id} height="100%" width="100%">
                        <CardSPR
                            id={spr.id}
                            variante="booked"
                            reservationsCount={spr.reservations_count}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MostBookedSPR;