import { Box, Typography, LinearProgress } from "@mui/material";

const Rating = () => {
  // Données statiques (simulées pour le moment)
  const reviews = [
    { stars: 5, count: 50 },
    { stars: 4, count: 6 },
    { stars: 3, count: 4 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];

  // Calcul du total d'avis
  const totalReviews = reviews.reduce((acc, review) => acc + review.count, 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <Typography variant="h5" fontWeight="bold">
        Évaluation globale
      </Typography>
      {reviews.map((review) => {
        const percentage = (review.count / totalReviews) * 100;
        return (
          <Box key={review.stars} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ minWidth: 20 }}>{review.stars}</Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#407E76",
                },
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default Rating;