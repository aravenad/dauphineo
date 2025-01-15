import { useState, useEffect } from "react";
import { fetchSPR } from "../api/endpoints/spr";
import { Box, Typography, Card, CardContent } from "@mui/material";
import SearchSection from "../components/SearchSection";

function Home() {
  const [sprList, setSprList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const loadSPR = async () => {
      try {
        const data = await fetchSPR(); // Appel à l’endpoint
        console.log("SPR récupérés :", data);
        setSprList(data);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors de la récupération des SPR :", err);
      } finally {
        setLoading(false);
      }
    };

    loadSPR(); // Appel de la fonction au chargement du composant
  }, []);

  return (
      <>
        {/* Section Recherche */}
        <SearchSection sprList={sprList} />

        <Box component="div">
          <Typography variant="h6" fontWeight={700}>
            Différentes façons de visiter l'Isère
          </Typography>
          <Typography variant="body1" component="span">
            Nos sites les plus visités
          </Typography>
        </Box>

        {/* Affichage du chargement ou des erreurs */}
        {loading && <Typography>Chargement des SPR...</Typography>}
        {error && (
            <Typography color="error">
              Erreur : {error.message || "Une erreur est survenue."}
            </Typography>
        )}

        {/* Affichage des SPR */}
        {!loading && !error && (
            <Box component="div" mt={2}>
              {sprList.length === 0 ? (
                  <Typography>Aucun site patrimonial trouvé.</Typography>
              ) : (
                  sprList.map((spr) => (
                      <Card key={spr.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6">{spr.nom}</Typography>
                          <Typography variant="body2">{spr.description}</Typography>
                        </CardContent>
                      </Card>
                  ))
              )}
            </Box>
        )}
      </>
  );
}

export default Home;