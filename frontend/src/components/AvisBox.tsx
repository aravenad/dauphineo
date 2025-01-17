import { Box, Button, Modal, Typography, Fade } from "@mui/material";
import { CardAvis } from "./index.ts";
import FormulaireAvis from "./FormulaireAvis";
import { useEffect, useState } from "react";
import { fetchSPRById } from "./../api/endpoints/spr.tsx";

interface SPRResponse {
  spr: {
    id: number;
    avis: Avis[];
  };
  moyenne_notes: {
    "5_etoiles": number;
    "4_etoiles": number;
    "3_etoiles": number;
    "2_etoiles": number;
    "1_etoile": number;
  };
}

interface AvisBoxProps {
  sprId: number;
  id_utilisateur: number;
}

interface Avis {
  id: number;
  titre: string;
  commentaire: string;
  note: number;
  id_utilisateur: number;
  id_spr: number;
  created_at: string;
}

const AvisBox: React.FC<AvisBoxProps> = ({ sprId, id_utilisateur }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3); // Nombre d'avis visibles
  const [isFadingOut, setIsFadingOut] = useState(false); // Gestion du fade-out

  // Récupération des avis depuis l'API
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response: SPRResponse = await fetchSPRById(sprId);
        if (response?.spr) {
          setAvis(response.spr.avis);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les avis");
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, [sprId]);

  if (loading) return <p>Chargement des avis...</p>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Trier les avis du plus récent au plus ancien
  const avisTries = [...avis].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleVoirMoins = () => {
    setIsFadingOut(true); // Déclenche le fade-out
    setTimeout(() => {
      setVisibleCount(3); // Réduit le nombre d'avis visibles après le délai
      setIsFadingOut(false); // Réinitialise l'état après l'animation
    }, 500); // Durée de l'animation en ms (doit correspondre au timeout du Fade)
  };

  const handleVoirPlus = () => setVisibleCount((prev) => prev + 3); // Affiche plus d'avis

  return (
    <>
      {/* Bouton pour écrire un avis */}
      <Button
        variant="contained"
        onClick={() => setIsFormOpen(true)}
        sx={{
          width: "fit-content",
          height: "50px",
          borderRadius: "25px",
          backgroundColor: "#FCFAF9",
          color: "#407E76",
          border: "2px solid green",
          padding: "10px 20px",
          alignSelf: "flex-end",
          fontSize: "small",
          fontWeight: 500,
          marginBottom: "16px",
          "&:hover": {
            backgroundColor: "#407E76",
            color: "#FCFAF9",
          },
          marginTop: "-75px", // Relève le bouton vers le haut
        }}
      >
        Écrire un avis
      </Button>

      {/* Modal pour le formulaire */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        aria-labelledby="modal-form-title"
        aria-describedby="modal-form-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-form-title" variant="h6"></Typography>
          <FormulaireAvis
            onClose={() => setIsFormOpen(false)}
            sprId={sprId}
            id_utilisateur={id_utilisateur}
          />
        </Box>
      </Modal>

      {/* Liste des avis */}
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
        }}
      >
        {avis.length === 0 ? (
          <Typography>Aucun avis disponible</Typography>
        ) : (
          <>
            {/* Affichage des avis triés avec animation */}
            {avisTries.slice(0, visibleCount).map((avis, index) => (
              <Fade
                in={!isFadingOut} // Applique fade-in/out en fonction de l'état
                timeout={500}
                key={avis.id}
              >
                <Box
                sx={{
                  width: "430px", // Largeur fixe pour uniformiser tous les avis
                  maxWidth: "100%", // Empêche de dépasser la taille de l'écran
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
                
                >
                  <CardAvis
                    titre={avis.titre}
                    commentaire={avis.commentaire}
                    note={avis.note}
                    date={avis.created_at}
                  />
                </Box>
              </Fade>
            ))}

            {/* Boutons "Voir Plus" et "Voir Moins" */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {avis.length > visibleCount && (
                <Button
                  variant="outlined"
                  onClick={handleVoirPlus}
                  sx={{
                    color: "#407E76",
                    borderColor: "#407E76",
                    "&:hover": {
                      backgroundColor: "#407E76",
                      color: "#FCFAF9",
                      borderColor: "#407E76",
                    },
                  }}
                >
                  Voir plus d'avis
                </Button>
              )}

              {visibleCount > 3 && (
                <Button
                  variant="outlined"
                  onClick={handleVoirMoins}
                  sx={{
                    color: "#407E76",
                    borderColor: "#407E76",
                    "&:hover": {
                      backgroundColor: "#407E76",
                      color: "#FCFAF9",
                      borderColor: "#407E76",
                    },
                  }}
                >
                  Voir moins d'avis
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default AvisBox;