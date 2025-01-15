import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CardGuide from "./CardGuide";

interface GuideSectionProps {
    guides: any[]; // Liste de tous les guides
    sprId: number; // ID du SPR courant
}

const GuideSection: React.FC<GuideSectionProps> = ({ guides, sprId }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [filteredGuides, setFilteredGuides] = useState<any[]>([]);

    // Filtrer les guides liés au SPR courant
    const guidesForSPR = guides.filter((guide) => guide.id_spr === sprId);

    // Validation et filtrage dynamique à chaque changement de la date
    useEffect(() => {
        if (selectedDate === "") {
            setDateError("");
            setFilteredGuides([]); // Ne pas afficher de guides si la date est vide
            return;
        }

        const validateDate = (date: string): string => {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(date)) {
                return "La date doit être au format JJ/MM/YYYY.";
            }

            const [day, month, year] = date.split("/").map(Number);
            const validDate = new Date(year, month - 1, day);

            if (
                validDate.getDate() !== day ||
                validDate.getMonth() + 1 !== month ||
                validDate.getFullYear() !== year
            ) {
                return "La date saisie est invalide.";
            }

            return ""; // Pas d'erreur
        };

        const error = validateDate(selectedDate);
        setDateError(error);

        if (!error) {
            const formattedDate = selectedDate.split("/").reverse().join("-"); // Format attendu : AAAA-MM-JJ

            // Filtrer les guides avec des disponibilités pour la date sélectionnée
            const filtered = guidesForSPR.filter((guide) =>
                guide.disponibilites.some(
                    (dispo: any) => dispo.date_jour === formattedDate
                )
            );

            setFilteredGuides(filtered);
        } else {
            setFilteredGuides([]); // Réinitialiser si erreur
        }
    }, [selectedDate, guidesForSPR]);

    const formattedDate = selectedDate.split("/").reverse().join("-"); // Format attendu : AAAA-MM-JJ

    return (
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Sélectionnez une date pour afficher les guides disponibles
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 4,
                }}
            >
                <TextField
                    variant="outlined"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="JJ/MM/YYYY"
                    error={!!dateError}
                    helperText={dateError}
                    sx={{ flex: 1, maxWidth: 300 }}
                    InputProps={{
                        endAdornment: selectedDate && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setSelectedDate("")} // Vider le champ
                                    edge="end"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Affichage des guides filtrés */}
            {filteredGuides.length > 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        padding: 3,
                    }}
                >
                    {filteredGuides.map((guide) => (
                        <CardGuide key={guide.id} guide={guide} date={formattedDate} />
                    ))}
                </Box>
            ) : selectedDate && !dateError ? (
                <Typography align="center" color="error">
                    Aucun guide disponible pour cette date.
                </Typography>
            ) : null}
        </>
    );
};

export default GuideSection;
