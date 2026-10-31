import { useState } from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { Spr } from "../api";
import { nomCommune } from "../utils/format";
import MotsCles from "./MotsCles";

interface CardSPRProps {
    spr: Spr;
    /** « booked » affiche le nombre de réservations, « rated » la note moyenne. */
    variante?: "regular" | "booked" | "rated";
    reservations?: number;
    noteMoyenne?: number;
}

function SousTitre({ variante, reservations, noteMoyenne }: Omit<CardSPRProps, "spr">) {
    if (variante === "booked") {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonIcon fontSize="small" aria-hidden />
                <Typography variant="body2" color="text.secondary">
                    {reservations ? `${reservations} réservation${reservations > 1 ? "s" : ""}` : "Pas encore réservé"}
                </Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon fontSize="small" sx={{ color: "info.main" }} aria-hidden />
            <Typography variant="body2" color="text.secondary">
                {noteMoyenne ? `Note moyenne : ${noteMoyenne.toFixed(1).replace(".", ",")} / 5` : "Pas encore noté"}
            </Typography>
        </Box>
    );
}

function CardSPR({ spr, variante = "regular", reservations, noteMoyenne }: CardSPRProps) {
    // Les photos sont hébergées par des sites tiers : on passe à la suivante si l'une ne répond plus
    const [essai, setEssai] = useState(0);
    const image = spr.images[essai]?.image_url;

    return (
        <Card sx={{ boxShadow: "none", borderRadius: "1em", height: "100%", backgroundColor: "transparent", overflow: "visible" }}>
            <CardActionArea
                component={RouterLink}
                to={`/spr/${spr.id}`}
                sx={{
                    height: "100%",
                    borderRadius: "1em",
                    isolation: "isolate",
                    // Comme sur YouTube, le survol dessine un fond qui déborde autour de la photo et du texte
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: "-8px -8px -4px",
                        zIndex: -1,
                        borderRadius: "1.25em",
                        backgroundColor: "primary.light",
                        opacity: 0,
                        transform: "scale(0.97)",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                    },
                    "&:hover::before, &.Mui-focusVisible::before": { opacity: 1, transform: "none" },
                    "&.Mui-focusVisible::before": { outline: "2px solid", outlineColor: "primary.main" },
                    "& .MuiCardActionArea-focusHighlight": { display: "none" },
                    "&:hover img": { transform: "scale(1.04)" },
                    "@media (prefers-reduced-motion: reduce)": { "&::before, & img": { transition: "none" }, "&:hover img": { transform: "none" } },
                }}
            >
                <Box sx={{ aspectRatio: "1", borderRadius: "1em", overflow: "hidden", backgroundColor: "primary.light" }}>
                    {image ? (
                        <CardMedia
                            component="img"
                            image={image}
                            alt=""
                            loading="lazy"
                            onError={() => setEssai((i) => i + 1)}
                            sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                        />
                    ) : (
                        <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "primary.main" }}>
                            <AccountBalanceIcon sx={{ fontSize: 64 }} aria-hidden />
                        </Box>
                    )}
                </Box>
                <CardContent sx={{ px: 0.5, pb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body1" component="h3" fontWeight={700}>
                        {nomCommune(spr.nom_commune)}
                    </Typography>
                    {variante === "regular" ? (
                        <MotsCles motCle={spr.mot_cle} />
                    ) : (
                        <SousTitre variante={variante} reservations={reservations} noteMoyenne={noteMoyenne} />
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CardSPR;
