import React, { useState } from "react";
import { Box, TextField, Typography, Button, Rating, Stack } from "@mui/material";
import { createReview } from "../api/endpoints/avis.tsx";
import { spread } from "axios";

interface FormulaireAvisProps {
  onClose?: () => void;
  sprId : number; // Fonction pour fermer le popup
  id_utilisateur : number;
}

const FormulaireAvis: React.FC<FormulaireAvisProps> = ({ onClose, sprId }) => {
  const [titre, setTitre] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");;

  const handleSubmit = async () => {
    // Vérification de tous les champs requis
    if (!rating || !titre.trim() || !comment.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    if (comment.length > 500) {
      setErrorMessage("Le commentaire doit contenir au maximum 500 caractères.");
      return;
    }

    //Pour debuguer
    console.log("Données envoyées:", {
      titre: titre.trim(),
      commentaire: comment.trim(),
      note: rating,
      id_utilisateur: 4,
      id_spr: sprId
    });
    //pour débuguer

    try {
      const response = await createReview({ 
        titre: titre.trim(),
        commentaire: comment.trim(),
        note: rating,
        id_utilisateur: 4,
        id_spr: sprId,
      });

      if (response.success) {
        setSuccessMessage("Avis envoyé avec succès !");
        // Réinitialisation des champs
        setTitre("");
        setRating(null);
        setComment("");
        setErrorMessage("");
        if (onClose) onClose();
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setErrorMessage("Une erreur est survenue lors de l'envoi de l'avis.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Laisser un avis</Typography>
      <Stack spacing={2}>
        {/* Champ pour le titre */}
        <TextField
          label="Titre de l'avis"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          fullWidth
          required
        />

        {/* Note avec étoiles */}
        <Box>
          <Typography component="legend" sx={{ mb: 1 }}>Note</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            precision={1}
            size="large"
          />
        </Box>

        {/* Champ pour le commentaire */}
        <TextField
          label="Commentaire"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          helperText={`${comment.length}/500 caractères`}
        />

        {/* Messages d'erreur et de succès */}
        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" variant="body2">
            {successMessage}
          </Typography>
        )}

        {/* Bouton d'envoi */}
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#407E76",
            "&:hover": {
              backgroundColor: "#2F5E58",
            },
          }}
        >
          Envoyer
        </Button>
      </Stack>
    </Box>
  );
};

export default FormulaireAvis;