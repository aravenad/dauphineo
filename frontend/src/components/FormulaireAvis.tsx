import React, { useState } from "react";
import { Box, TextField, Typography, Button, Rating, Stack } from "@mui/material";
import { createReview } from "../api/endpoints/avis";

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
      const response = await createReview({ rating, comment });
      if (response.success) {
        setSuccessMessage("Avis envoyé avec succès !");
        setRating(null);
        setComment("");
        setErrorMessage("");
        if (onClose) onClose(); // Fermer le popup après succès
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setErrorMessage("Une erreur est survenue lors de l'envoi de l'avis.");
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
