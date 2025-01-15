import React, { useState } from "react";
import { Box, TextField, Typography, Button, Rating, Stack } from "@mui/material";
import { createAvis } from "../api/endpoints/avis";

interface FormulaireAvisProps {
    onClose?: () => void; // Fonction pour fermer le popup
}

const FormulaireAvis: React.FC<FormulaireAvisProps> = ({ onClose }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleSubmit = async () => {
        if (!rating || comment.trim() === "") {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        if (comment.length > 500) {
            setErrorMessage("Le commentaire doit contenir au maximum 500 caractères.");
            return;
        }

        try {
            setErrorMessage(""); // Réinitialiser les messages d'erreur
            setSuccessMessage("");

            const response = await createAvis({ rating, comment });

            // Vérifier si la réponse existe
            if (response) {
                setSuccessMessage("Avis envoyé avec succès !");
                setRating(null);
                setComment("");
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                    }, 1500); // Attendre 1.5s avant de fermer pour voir le message de succès
                }
            }
        } catch (error: unknown) {
            setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
        }
    };

    return (
        <Box>
            <Typography variant="h6">Laisser un avis</Typography>
            <Stack spacing={2}>
                <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                />
                <TextField
                    label="Commentaire"
                    multiline
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                {successMessage && <Typography color="primary">{successMessage}</Typography>}
                <Button variant="contained" onClick={handleSubmit}>
                    Envoyer
                </Button>
            </Stack>
        </Box>
    );
};

export default FormulaireAvis;
