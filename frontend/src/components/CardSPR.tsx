import React, { useEffect, useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActionArea,
    Skeleton,
    Box,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router";
import { fetchSPRById } from "../api/endpoints/spr";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";

type CardSPRProps = {
    id: number;
    variante?: "regular" | "booked" | "rated"; // Variante de la carte, par défaut "regular"
    reservationsCount?: number; // Nombre de réservations (pour "booked")
    averageRating?: number; // Note moyenne (pour "rated")
};

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

const CardSPR: React.FC<CardSPRProps> = ({
                                             id,
                                             variante = "regular",
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
                const data = await fetchSPRById(id);
                setSprData(data.spr);
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
            <Card
                sx={{
                    maxWidth: "100%",
                    boxShadow: "none",
                    padding: "0em",
                    borderRadius: "0.7em",
                }}
            >
                <CardActionArea>
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                            height: "0",
                            paddingTop: "100%", // Ratio carré
                            borderRadius: "1em",
                        }}
                    />
                    <CardContent>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width="60%"
                            height={24}
                            sx={{ marginBottom: 1 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            width="80%"
                            height={18}
                            sx={{ marginBottom: 1 }}
                        />
                    </CardContent>
                </CardActionArea>
            </Card>
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

    const handleClick = () => {
        navigate("/spr", { state: { spr: sprData } });
    };

    const renderPills = (keywords: string) => {
        const keywordArray = keywords.split(" "); // Sépare les mots-clés
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    marginTop: 1,
                }}
            >
                {keywordArray.map((keyword) => (
                    <Chip
                        key={keyword}
                        label={`${emojiMap[keyword] || ""} ${keyword.charAt(0).toUpperCase()}${keyword.slice(1)}`}
                        sx={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: "16px",
                            padding: "0.3em",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    />
                ))}
            </Box>
        );
    };

    const getSubtitle = () => {
        switch (variante) {
            case "booked":
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: "black" }} />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            marginLeft={-0.5}
                        >
                            {reservationsCount
                                ? `${reservationsCount} visites au total`
                                : "Aucune visite disponible"}
                        </Typography>
                    </Box>
                );
            case "rated":
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon sx={{ color: "gold" }} />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            marginLeft={-0.5}
                        >
                            {averageRating
                                ? `Note moyenne : ${averageRating.toFixed(1)}`
                                : "Pas encore de notes"}
                        </Typography>
                    </Box>
                );
            case "regular":
            default:
                return renderPills(sprData.mot_cle);
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
                        paddingTop: "100%",
                        borderRadius: "1em",
                        backgroundSize: "cover",
                    }}
                    image={sprData.images[0]?.image_url || "https://via.placeholder.com/200"}
                    title={sprData.nom_commune}
                />
                <CardContent sx={{ padding: "1em 0 0 0.1em" }}>
                    <Typography variant="body1" fontWeight={700} textAlign="left" paddingLeft={0.5}>
                        {sprData.nom_commune}
                    </Typography>
                    {getSubtitle()}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CardSPR;