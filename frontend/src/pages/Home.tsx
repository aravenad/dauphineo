import { useState, useEffect } from "react";
import { fetchSPR, fetchTopSPR } from "../api/endpoints/spr";
import { Box, Typography} from "@mui/material";
import SearchSection from "../components/SearchSection";
import MostBookedSPR from "../components/MostBookedSPR";
import MostRatedSPR from "../components/MostRatedSPR.tsx";
import ExploreSection from "../components/ExploreSection.tsx";

function Home() {
  const [sprList, setSprList] = useState<any[]>([]);
  const [topSPR, setTopSPR] = useState<any>(null); // Stocke le résultat de fetchTopSPR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const loadSPRData = async () => {
      try {
        // Récupération de tous les SPR
        const allSPR = await fetchSPR();
        setSprList(allSPR);

        // Récupération des données les plus visitées et mieux notées
        const topSPRData = await fetchTopSPR();
        setTopSPR(topSPRData);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors de la récupération des données SPR :", err);
      } finally {
        setLoading(false);
      }
    };

    loadSPRData();
  }, []);

  return (
      <>
        <Box
            sx={{
              textAlign: "center",
              marginBottom: "2em",
              animation: "fadeIn 0.4s ease-in-out",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(-20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
        >
          <Typography variant="h2" component="h1" fontWeight={800} margin="0.1em 0 0">
            Que souhaitez-vous visiter ?
          </Typography>
          <Typography
              variant="subtitle1"
              fontWeight={400}
              color="text.secondary"
              marginBottom="2em"
              fontSize="1.4em"
          >
            Accédez à tous les sites patrimoniaux de l'Isère et réservez votre guide
          </Typography>
        </Box>

        {/* Section Recherche */}
        <SearchSection sprList={sprList} />

        {/* Section des mieux notés */}
        {topSPR && <MostRatedSPR />}

          {/* Section des plus visités */}
          {topSPR && <MostBookedSPR />}

        {/* Affichage du chargement ou des erreurs */}
        {loading && <Typography>Chargement des SPR...</Typography>}
        {error && (
            <Typography color="error">
              Erreur : {error.message || "Une erreur est survenue."}
            </Typography>
        )}

        {/* Affichage des SPR */}
        <ExploreSection sprList={sprList} />

      </>
  );
}

export default Home;