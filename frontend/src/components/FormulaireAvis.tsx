import React, { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Rating,
    Stack
} from "@mui/material";
import { createReview } from "../api/endpoints/avis.tsx";


const FormulaireAvis = () => {
    const [rating, setRating] = useState<number | null>(null); // Étoiles de l'avis
    const [comment, setComment] = useState<string>(""); // Commentaire de l'utilisateur
    const [errorMessage, setErrorMessage] = useState<string>(""); // Gestion des erreurs
    const [successMessage, setSuccessMessage] = useState<string>(""); // Gestion des succès

    const handleSubmit = async () => {
        if (!rating || comment.trim() === "" ) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        if(comment.length > 10) {
            setErrorMessage("Le commentaire doit contenir au maximum 10 caractères.");
            return;
        }

        // Appel à l'API pour poster l'avis
        const response = await createReview({ rating, comment });
        if (response.success === true) {
            setSuccessMessage("Avis envoyé avec succès !");
            setRating(null);
            setComment("");
            setErrorMessage("");
        } else {
            setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <Box>
            <Typography variant="h6">Laisser un avis</Typography>
            <Typography variant="h6">Note :</Typography>
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
