import React, { useState } from "react";
import { Alert, Box, TextField, Typography, Button, Rating, Stack } from "@mui/material";
import api, { messageErreur, type Avis } from "../api";
import { useTextes } from "../i18n";

const TEXTES = {
  fr: {
    incomplet: "Donnez une note, un titre et un commentaire.",
    echec: "L'avis n'a pas pu être publié.",
    unSeul: "Vous pouvez laisser un seul avis par site.",
    note: "Note",
    etoiles: (n: number) => `${n} étoile${n > 1 ? "s" : ""}`,
    aucune: "Aucune note",
    titre: "Titre de l'avis",
    commentaire: "Commentaire",
    caracteres: (n: number, max: number) => `${n}/${max} caractères`,
    annuler: "Annuler",
    publier: "Publier",
  },
  en: {
    incomplet: "Give a rating, a title and a comment.",
    echec: "The review could not be posted.",
    unSeul: "You can leave only one review per site.",
    note: "Rating",
    etoiles: (n: number) => `${n} star${n > 1 ? "s" : ""}`,
    aucune: "No rating",
    titre: "Review title",
    commentaire: "Comment",
    caracteres: (n: number, max: number) => `${n}/${max} characters`,
    annuler: "Cancel",
    publier: "Post",
  },
};

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
  const t = useTextes(TEXTES);

  const envoyer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!note || !titre.trim() || !commentaire.trim()) {
      setErreur(t.incomplet);
      return;
    }

    setEnvoi(true);
    setErreur("");
    try {
      onPublie(await api.publierAvis({ titre: titre.trim(), commentaire: commentaire.trim(), note, id_spr: sprId }));
    } catch (e) {
      setErreur(messageErreur(e, t.echec));
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <Box component="form" onSubmit={envoyer} noValidate>
      <Stack spacing={2}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t.unSeul}
        </Typography>

        <Box component="fieldset" sx={{ border: 0, m: 0, p: 0 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            {t.note}
          </Typography>
          <Rating
            name="note"
            value={note}
            onChange={(_, valeur) => setNote(valeur)}
            getLabelText={t.etoiles}
            emptyLabelText={t.aucune}
            size="large"
          />
        </Box>

        <TextField
          label={t.titre}
          value={titre}
          onChange={(e) => setTitre(e.target.value.slice(0, MAX_TITRE))}
          required
          fullWidth
          helperText={t.caracteres(titre.length, MAX_TITRE)}
        />

        <TextField
          label={t.commentaire}
          multiline
          minRows={4}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value.slice(0, MAX_COMMENTAIRE))}
          required
          fullWidth
          helperText={t.caracteres(commentaire.length, MAX_COMMENTAIRE)}
        />

        {erreur && <Alert severity="error">{erreur}</Alert>}

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button onClick={onAnnuler} sx={{ textTransform: "none" }}>
            {t.annuler}
          </Button>
          <Button type="submit" variant="contained" disabled={envoi} sx={{ textTransform: "none", borderRadius: "2em" }}>
            {t.publier}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FormulaireAvis;
