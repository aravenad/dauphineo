import React, { useState } from "react";
import {
    Card,
    Avatar,
    Typography,
    Button,
    Divider,
    Stack,
    Box,
    TextField,
} from "@mui/material";

const ChoixVisite: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [dateError, setDateError] = useState("");

    // Créneaux statiques
    const slots = [
        { start: "14:00", end: "15:00" },
        { start: "16:00", end: "17:00" },
    ];

    // Validation de la date au format JJ/MM/YYYY
    const validateDate = (date: string): string => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Vérifie le format
        if (!dateRegex.test(date)) {
            return "La date doit être au format JJ/MM/YYYY.";
        }

        const [day, month, year] = date.split("/").map(Number);
        const validDate = new Date(year, month - 1, day);

        // Vérifie si la date est cohérente
        if (
            validDate.getDate() !== day ||
            validDate.getMonth() + 1 !== month ||
            validDate.getFullYear() !== year
        ) {
            return "La date saisie est invalide.";
        }

        return ""; // Aucun problème
    };

    // Gère le changement dans le champ de date
    const handleDateChange = (value: string) => {
        setSelectedDate(value);
        const error = validateDate(value);
        setDateError(error);
    };

    const handleSearch = () => {
        if (!dateError && selectedDate) {
            console.log("Recherche pour la date :", selectedDate);
            alert(`Recherche effectuée pour le ${selectedDate}`);
        } else {
            alert("Veuillez corriger la date avant de continuer.");
        }
    };

    const handleRetour = () => {
        alert("Retour à la page précédente !");
    };

    return (
        <Card
            sx={{
                maxWidth: 300, // Réduction de la largeur
                padding: 2,
                borderRadius: 4,
                boxShadow: 3,
                margin: "auto",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                {/* Avatar du guide */}
                <Avatar
                    alt="Nicolas Rousseau"
                    src="https://via.placeholder.com/150"
                    sx={{
                        width: 60,
                        height: 60,
                    }}
                />
                {/* Informations du guide */}
                <Stack>
                    <Typography variant="h6" fontWeight="bold">
                        Nicolas Rousseau
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Guide touristique
                    </Typography>
                </Stack>
            </Stack>

            <Divider sx={{ width: "100%", margin: "16px 0" }} />
            <Typography variant="h6" fontWeight="bold">
                Date de visite souhaitée :
            </Typography>
            {/* Sélection de date et bouton de recherche */}
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ marginTop: 2 }}
            >

                <TextField
                    variant="outlined"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    placeholder="JJ/MM/YYYY"
                    error={!!dateError}
                    helperText={dateError}
                    fullWidth
                    sx={{ flex: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{
                        height: "56px", // Aligné avec la hauteur du champ texte
                        flexShrink: 0,
                    }}
                    disabled={!!dateError || !selectedDate}
                >
                    Rechercher
                </Button>
            </Stack>

            {/* Créneaux statiques (clicables) */}
            <Stack spacing={2} sx={{ marginTop: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Le {selectedDate || "3 mai 2025"}
                </Typography>
                {slots.map((slot, index) => (
                    <Box
                        key={index}
                        //onClick={() => handleSlotClick(slot)} // Rend chaque créneau cliquable
                        sx={{
                            backgroundColor: "",
                            padding: 1,
                            borderRadius: 2,
                            textAlign: "center",
                            fontWeight: "bold",
                            border: "2px solid", // Bordure
                            cursor: "pointer", // Curseur de clic
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(0, 200, 150, 0.3)", // Couleur au survol
                            },
                        }}
                    >
                        De {slot.start} à {slot.end}
                    </Box>
                ))}
            </Stack>

            {/* Nouveau séparateur */}
            <Divider sx={{ width: "100%", margin: "16px 0" }} />

            {/* Bouton retour */}
            <Button
                variant="outlined"
                color="primary"
                //onClick={handleRetour}
                sx={{
                    width: "100%",
                    fontWeight: "bold",
                }}
            >
                Retour
            </Button>
        </Card>
    );
};

export default ChoixVisite;
