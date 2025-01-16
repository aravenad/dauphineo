import {
  Box,
  Typography,
  Avatar,
  Rating,
  Link,
  Collapse,
} from "@mui/material";
import { useState } from "react";

interface CardAvisProps {
  titre: string;
  commentaire: string;
  note: number;
  date: string;
}

const CardAvis: React.FC<CardAvisProps> = ({ titre, commentaire, note, date }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isCommentLong = commentaire.length > 150;
  const commentPreview = commentaire.substring(0, 150) + "...";
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        maxWidth: "400px",
        backgroundColor: "#fff",
      }}
    >
      {/* Header avec Avatar et Nom */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar alt="Utilisateur" src="/path/to/avatar.jpg" />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Utilisateur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posté le {formatDate(date)}
          </Typography>
        </Box>
      </Box>

      {/* Note avec Titre */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating value={note} readOnly size="small" />
        <Typography variant="subtitle1" fontWeight="bold">
          {titre}
        </Typography>
      </Box>

      {/* Contenu du commentaire */}
      <Box>
        {isCommentLong ? (
          <>
            <Typography variant="body2" color="text.primary">
              {!isExpanded && commentPreview}
            </Typography>
            <Collapse in={isExpanded} timeout={300}>
              <Typography 
                variant="body2" 
                color="text.primary"
                sx={{
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {commentaire}
              </Typography>
            </Collapse>
            <Link 
              href="#" 
              underline="hover" 
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              sx={{
                mt: 1,
                display: 'inline-block',
                color: '#407E76',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  color: '#2F5E58',
                }
              }}
            >
              {isExpanded ? "Voir moins" : "Lire plus"}
            </Link>
          </>
        ) : (
          <Typography variant="body2" color="text.primary">
            {commentaire}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CardAvis;
