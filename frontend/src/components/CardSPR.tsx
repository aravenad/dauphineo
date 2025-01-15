import React, { useEffect, useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActionArea,
    CircularProgress,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router";
import { fetchSPRById } from "../api/endpoints/spr";
import { formatKeywords } from "./mui_custom/SearchBarCustom.tsx";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";


type CardSPRProps = {
    id: number;
    variante?: "regular" | "booked" | "rated"; // Variante de la carte, par défaut "regular"
    reservationsCount?: number; // Nombre de réservations (pour "booked")
    averageRating?: number; // Note moyenne (pour "rated")
};

const CardSPR: React.FC<CardSPRProps> = ({
                                             id,
                                             variante = "regular", // Par défaut "regular"
                                             reservationsCount,
                                             averageRating,
                                         }) => {
    const [sprData, setSprData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | Error>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSPR = async () => {
            try {
                const data = await fetchSPRById(id); // Appel à l'endpoint
                setSprData(data.spr); // Récupération des données SPR
            } catch (err) {
                setError(err as Error);
                console.error("Erreur lors de la récupération du SPR :", err);
            } finally {
                setLoading(false);
            }
        };

        loadSPR();
    }, [id]);

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
                Erreur : {error.message || "Impossible de charger ce SPR."}
            </Typography>
        );
    }

    if (!sprData) {
        return (
            <Typography align="center">SPR introuvable ou données manquantes.</Typography>
        );
    }

    // Gestion du clic pour naviguer vers /spr
    const handleClick = () => {
        navigate("/spr", { state: { spr: sprData } }); // Passe l'objet SPR directement
    };

    // Sous-titre basé sur la variante
    const getSubtitle = () => {
        switch (variante) {
            case "booked":
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: "black"}} />
                        <Typography variant="body2" color="text.secondary" marginLeft={-0.5}>
                            {reservationsCount
                                ? `${reservationsCount} réservations`
                                : "Aucune réservation disponible"}
                        </Typography>
                    </Box>
                );
            case "rated":
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon sx={{ color: "gold" }} />
                        <Typography variant="body2" color="text.secondary" marginLeft={-0.5}>
                            {averageRating
                                ? `Note moyenne : ${averageRating.toFixed(1)}`
                                : "Pas encore de notes"}
                        </Typography>
                    </Box>
                );
            case "regular":
            default:
                return (
                    <Typography variant="body2" color="text.secondary">
                        {formatKeywords(sprData.mot_cle)}
                    </Typography>
                );
        }
    };

    return (
        <Card
            sx={{
                maxWidth: "100%",
                boxShadow: "none",
                padding: "0em",
                borderRadius: "0.7em",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
        >
            <CardActionArea onClick={handleClick}>
                <CardMedia
                    sx={{
                        height: "0",
                        paddingTop: "100%", // c'est pour avoir un ratio carré
                        borderRadius: "1em",
                        backgroundSize: "cover",
                    }}
                    image={sprData.images[0]?.image_url || "https://via.placeholder.com/200"} // Fallback si aucune image
                    title={sprData.nom_commune}
                />
                <CardContent sx={{ padding: "1em 0 0 0.1em" }}>
                    <Typography variant="body1" fontWeight={700} textAlign="left">
                        {sprData.nom_commune}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="left">
                        {getSubtitle()} {/* Affichage du sous-titre basé sur la variante */}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CardSPR;