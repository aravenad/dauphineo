import { Box, Typography, LinearProgress } from "@mui/material";
import {fetchSPRById} from "./../api/endpoints/spr.tsx";
import { useEffect, useState } from "react";



interface SPRResponse {
  sprId: {
    id: number;
  };
  moyenne_notes: {
    "5_etoiles": number;
    "4_etoiles": number;
    "3_etoiles": number;
    "2_etoiles": number;
    "1_etoile": number;
  };
}

interface RatingProps {
  sprId: number; // Ajout de sprId
}


  // Calcul du total d'avis
  const Rating: React.FC<RatingProps> = ({ sprId }) => {
    const [moyenneNotes, setMoyenneNotes] = useState<SPRResponse['moyenne_notes'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    

    useEffect(() => {
      const fetchMoyenneNotes = async () => {
        try {
          const response: SPRResponse = await fetchSPRById(sprId);
          if (response?.moyenne_notes) {
            setMoyenneNotes(response.moyenne_notes);
          }
        } catch (error) {
          console.error("Erreur:", error);
          setError("Impossible de charger les moyennes");
        } finally {
          setLoading(false);
        }
      };
  
      fetchMoyenneNotes();
    }, [sprId]);

    if (loading) return <Typography>Chargement des évaluations...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!moyenneNotes) return null;

    const reviews = [
      { stars: 5, count: moyenneNotes["5_etoiles"] },
      { stars: 4, count: moyenneNotes["4_etoiles"] },
      { stars: 3, count: moyenneNotes["3_etoiles"] },
      { stars: 2, count: moyenneNotes["2_etoiles"] },
      { stars: 1, count: moyenneNotes["1_etoile"] },
    ];
  
    // Le reste de votre code reste identique...
    const totalReviews = reviews.reduce((acc, review) => acc + review.count, 0);
    const averageRating = reviews.reduce((acc, review) => acc + (review.stars * review.count), 0) / totalReviews || 0;

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