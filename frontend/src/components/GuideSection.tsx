import  { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CardGuide from "./CardGuide";

const GuideSection = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [validatedDate, setValidatedDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);

    const sprId = "1"; // Exemple d'id du SPR (statique pour cet exemple)

    const guides = [
        {
            name: "Naps le vrai",
            role: "Tarpin serein",
            photo: "https://raplume.eu/wp-content/uploads/2021/04/Capture-decran-2021-04-06-a-16.52.05.png",
        },
        {
            name: "Soso Maness",
            role: "Marseillais du futur",
            photo: "https://example.com/soso.jpg",
        },
        {
            name: "Jul",
            role: "le J",
            photo: "https://example.com/jul.jpg",
        },
    ];

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
        setValidatedDate(date);
        return "";
    };

    const handleSearch = () => {
        const error = validateDate(selectedDate);
        setDateError(error);

        if (!error) {
            setValidatedDate(selectedDate);
            setIsSearchTriggered(true); // Active l'affichage des guides
        } else {
            setIsSearchTriggered(false);
        }
    };

    return (
        <>
            <Typography variant="h4" align="center" gutterBottom>
                Sélectionnez une date pour afficher les guides disponibles
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start", // Fixe les éléments en haut
                    gap: 2,
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
                    sx={{
                        flex: 1,
                        maxWidth: 300,
                        height: "56px", // Fixe la hauteur pour s'aligner avec le bouton
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{
                        height: "56px", // Fixe la hauteur
                        flexShrink: 0,
                    }}
                >
                    <SearchIcon />
                </Button>
            </Box>

            {isSearchTriggered && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        padding: 3,
                    }}
                >
                    {guides.map((guide, index) => (
                        <CardGuide
                            key={index}
                            guide={guide}
                            date={validatedDate} // Passe la date validée
                            sprId={sprId} // Passe l'id du SPR
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default GuideSection;
