import { Box, Button, Modal, Typography } from "@mui/material";
import { CardAvis } from "./index.ts";
import FormulaireAvis from "./FormulaireAvis";
import { useEffect, useState } from "react";
import {fetchSPRById} from "./../api/endpoints/spr.tsx";

interface SPRResponse {
  spr: {
    id: number;
    avis: Avis[];
  };
  moyenne_notes: { //Pas vraiment utile ici
    "5_etoiles": number;
    "4_etoiles": number;
    "3_etoiles": number;
    "2_etoiles": number;
    "1_etoile": number;
  };
  avis: {
    id_utilisateur : number;
  }
}

interface AvisBoxProps {
  sprId: number;
  id_utilisateur: number;
}

interface Avis{
  id: number;
  titre : string;
  commentaire: string;
  note: number;
  id_utilisateur: number;
  id_spr: number;
  created_at: string;
}



const AvisBox: React.FC<AvisBoxProps> = ({ sprId , id_utilisateur }) => {
  
   const [isFormOpen, setIsFormOpen] = useState(false); // État pour contrôler l'ouverture du formulaire
   const handleOpenForm = () => setIsFormOpen(true);
   const handleCloseForm = () => setIsFormOpen(false);

  const [avis, setAvis] = useState<Avis[]>([]);
  const [moyenneNotes, setMoyenneNotes] = useState<SPRResponse['moyenne_notes'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3); // Nouvel état pour la pagination


  //Récuperation des avis avec l'ID du spr
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response: SPRResponse = await fetchSPRById(sprId);
        if (response?.spr) {
          setAvis(response.spr.avis);
          setMoyenneNotes(response.moyenne_notes);
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


  return (
    <>
      {/* Bouton pour ouvrir le popup */}
      <Button
        variant="contained"
        onClick={handleOpenForm}
        sx={{
          width: "20%",
          height: "50px",
          borderRadius: "50px",
          backgroundColor: "#FCFAF9",
          color: "#407E76",
          border: "2px solid green",
          padding: "10px 20px",
          alignSelf: "flex-end",
          fontSize: "small",
          fontWeight: 500,
          marginBottom: "16px", // Added margin bottom
          "&:hover": {
        backgroundColor: "#407E76",
        color: "#FCFAF9",
          },
        }}
      >
        Écrire un avis
      </Button>

      {/* Modal pour afficher le formulaire */}
      <Modal
        open={isFormOpen}
        onClose={handleCloseForm}
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
          <Typography id="modal-form-title" variant="h6">
          </Typography>
          <FormulaireAvis onClose={handleCloseForm} sprId = {sprId} id_utilisateur = {id_utilisateur}  />
        </Box>
      </Modal>

      {/* Box pour les avis */}
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
            {/* Affichage des avis avec pagination */}
            {avis.slice(0, visibleCount).map((avis) => (
              <CardAvis
                key={avis.id}
                titre={avis.titre}
                commentaire={avis.commentaire}
                note={avis.note}
                date={avis.created_at}
              />
            ))}

            {/* Bouton "Voir plus" */}
            {avis.length > visibleCount && (
              <Button
                variant="outlined"
                onClick={() => setVisibleCount(prev => prev + 3)}
                sx={{
                  alignSelf: "center",
                  mt: 2,
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
          </>
        )}

      </Box>
    </>
  );
}

export default AvisBox;
