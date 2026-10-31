import React, { useState } from "react";
import { Alert, Box, TextField, Typography, Button, Rating, Stack } from "@mui/material";
import api, { messageErreur, type Avis } from "../api";

interface FormulaireAvisProps {
  sprId: number;
  onPublie: (avis: Avis) => void;
  onAnnuler: () => void;
}

const MAX_TITRE = 80;
const MAX_COMMENTAIRE = 1000;

const FormulaireAvis: React.FC<FormulaireAvisProps> = ({ sprId, onPublie, onAnnuler }) => {
  const [titre, setTitre] = useState("");
  const [note, setNote] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const envoyer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!note || !titre.trim() || !commentaire.trim()) {
      setErreur("Donnez une note, un titre et un commentaire.");
      return;
    }

    setEnvoi(true);
    setErreur("");
    try {
      onPublie(await api.publierAvis({ titre: titre.trim(), commentaire: commentaire.trim(), note, id_spr: sprId }));
    } catch (e) {
      setErreur(messageErreur(e, "L'avis n'a pas pu être publié."));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <Box component="form" onSubmit={envoyer} noValidate>
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Vous pouvez laisser un seul avis par site.
        </Typography>

        <Box>
          <Typography component="legend" sx={{ mb: 1 }}>
            Note
          </Typography>
          <Rating name="note" value={note} onChange={(_, valeur) => setNote(valeur)} size="large" />
        </Box>

        <TextField
          label="Titre de l'avis"
          value={titre}
          onChange={(e) => setTitre(e.target.value.slice(0, MAX_TITRE))}
          required
          fullWidth
          helperText={`${titre.length}/${MAX_TITRE} caractères`}
        />

        <TextField
          label="Commentaire"
          multiline
          minRows={4}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value.slice(0, MAX_COMMENTAIRE))}
          required
          fullWidth
          helperText={`${commentaire.length}/${MAX_COMMENTAIRE} caractères`}
        />

        {erreur && <Alert severity="error">{erreur}</Alert>}

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button onClick={onAnnuler} sx={{ textTransform: "none" }}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={envoi} sx={{ textTransform: "none", borderRadius: "2em" }}>
            Publier
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FormulaireAvis;
