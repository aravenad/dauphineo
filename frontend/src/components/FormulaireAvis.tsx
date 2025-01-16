import React, { useState } from "react";
import { Box, TextField, Typography, Button, Rating, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createReview } from "../api/endpoints/avis.tsx";

interface FormulaireAvisProps {
  onClose?: () => void;
  sprId: number; // Fonction pour fermer le popup
  id_utilisateur: number;
}

const FormulaireAvis: React.FC<FormulaireAvisProps> = ({ onClose, sprId }) => {
  const [titre, setTitre] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async () => {
    // Vérification de tous les champs requis
    if (!rating || !titre.trim() || !comment.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    if (titre.length > 26) {
      setErrorMessage("Le titre doit contenir au maximum 26 caractères.");
      return;
    }
    if (comment.length > 150) {
      setErrorMessage("Le commentaire doit contenir au maximum 150 caractères.");
      return;
    }

    try {
      const response = await createReview({
        titre: titre.trim(),
        commentaire: comment.trim(),
        note: rating,
        id_utilisateur: 2,
        id_spr: sprId,
      });

      setSuccessMessage("Avis envoyé avec succès !");
      setTitre("");
      setRating(null);
      setComment("");
      setErrorMessage("");
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setErrorMessage("Une erreur est survenue lors de l'envoi de l'avis.");
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Laisser un avis
      </Typography>
      <Stack spacing={2}>
        {/* Message informatif */}
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
          * Vous ne pouvez poster qu'un seul avis par SPR.
        </Typography>

        {/* Bouton de fermeture */}
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Champ pour le titre */}
        <TextField
          label="Titre de l'avis"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          fullWidth
          required
          helperText={
            <Typography
              variant="caption"
              sx={{
                color: titre.length > 26 ? "red" : "textSecondary",
              }}
            >
              {titre.length}/26 caractères
            </Typography>
          }
        />

        {/* Note avec étoiles */}
        <Box>
          <Typography component="legend" sx={{ mb: 1 }}>
            Note
          </Typography>
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
          helperText={
            <Typography
              variant="caption"
              sx={{
                color: comment.length > 150 ? "red" : "textSecondary",
              }}
            >
              {comment.length}/150 caractères
            </Typography>
          }
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