import { Box, Typography, Avatar, Rating, Link, IconButton, Tooltip } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import { formaterDate } from "../utils/format";
import { useTextes } from "../i18n";

interface CardAvisProps {
  titre: string;
  commentaire: string;
  note: number;
  date: string;
  pseudo: string;
  /** Présent seulement sur les avis de l'utilisateur connecté. */
  onSupprimer?: () => void;
}

const LONGUEUR_APERCU = 150;

const CardAvis: React.FC<CardAvisProps> = ({ titre, commentaire, note, date, pseudo, onSupprimer }) => {
  const [deplie, setDeplie] = useState(false);
  const t = useTextes({
    fr: { poste: "Posté le", supprimer: "Supprimer mon avis", surCinq: (n: number) => `${n} sur 5`, moins: "Voir moins", plus: "Lire plus" },
    en: { poste: "Posted on", supprimer: "Delete my review", surCinq: (n: number) => `${n} out of 5`, moins: "Show less", plus: "Read more" },
  });
  const long = commentaire.length > LONGUEUR_APERCU;

  return (
    <Box component="article" sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3, borderRadius: "1em", backgroundColor: "grey.50" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>{pseudo.charAt(0).toUpperCase()}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {pseudo}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t.poste} {formaterDate(date, { day: "numeric", month: "long", year: "numeric" })}
          </Typography>
        </Box>
        {onSupprimer && (
          <Tooltip title={t.supprimer}>
            <IconButton onClick={onSupprimer} aria-label={t.supprimer}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating value={note} readOnly size="small" aria-label={t.surCinq(note)} />
        <Typography variant="subtitle1" component="h4" sx={{ fontWeight: "bold" }}>
          {titre}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-line" }}>
          {long && !deplie ? `${commentaire.slice(0, LONGUEUR_APERCU).trimEnd()}…` : commentaire}
        </Typography>
        {long && (
          <Link
            component="button"
            underline="hover"
            onClick={() => setDeplie(!deplie)}
            aria-expanded={deplie}
            sx={{ mt: 1, color: "primary.main" }}
          >
            {deplie ? t.moins : t.plus}
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default CardAvis;
