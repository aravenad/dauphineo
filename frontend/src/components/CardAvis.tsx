import {
  Box,
  Typography,
  Avatar,
  Rating,
  Link,
} from "@mui/material";

const ReviewCard = () => {
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
        <Avatar alt="Eve Müller" src="/path/to/avatar.jpg" />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Eve Müller
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posté le 27 octobre 2024
          </Typography>
        </Box>
      </Box>

      {/* Note avec Titre */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating value={5} readOnly size="small" />
        <Typography variant="subtitle1" fontWeight="bold">
          Magnifique lieu
        </Typography>
      </Box>

      {/* Contenu du commentaire */}
      <Typography variant="body2" color="text.primary">
        J'ai visité Saint-Antoine l'Abbaye, un village charmant avec une abbaye
        médiévale impressionnante et un cadre paisible entouré de nature...
      </Typography>

      {/* Lien Lire plus */}
      <Link href="#" underline="hover">
        Lire plus
      </Link>
    </Box>
  );
};

export default ReviewCard;