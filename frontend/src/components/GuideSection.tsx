import {useEffect, useState} from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CardGuide from "./CardGuide";
import {getAllGuides} from "../api/endpoints/guides.tsx";

interface Guide {
    name: string;
    role: string;
    photo: string;
}

const GuideSection = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [validatedDate, setValidatedDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [isSearchTriggered, setIsSearchTriggered] = useState(false);
    const [guides, setGuides] = useState<Guide[]>([]); // Initialisation correcte
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await getAllGuides(); // Appel de l'API
                console.log("Réponse de l'API :", data);

                setGuides(data); // Mise à jour des guides
            } catch (error) {
                setError("Erreur lors de la récupération des guides.");
            }
        };

        fetchGuides();
    }, []);

    const sprId = "1"; // Exemple d'id du SPR (statique pour cet exemple)

    const validateDate = (date: string): string => {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) {
            return "La date doit être au format JJ/MM/AAAA.";
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
            <h1>Liste des guides</h1>
            {error && <p>{error}</p>}
            <ul>
                {guides.map((guide, index) => (
                    <li key={index}>{guide.name}</li>
                ))}
            </ul>
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
                    <SearchIcon/>
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
