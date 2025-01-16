import { Box } from "@mui/material";
import Rating from "./Rating.tsx";
import AvisBox from "./AvisBox.tsx";

interface AvisSectionProps {
  sprId: number;  // Notez que c'est 'sprId' et non 'sprID'
  id_utilisateur: number;
}


const AvisSection: React.FC<AvisSectionProps> = ({ sprId , id_utilisateur }) => {
  return (
      <>
        
        <h1>Avis</h1>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start", // Aligne les éléments à gauche
            width: "100%",
            padding: 3,
            gap: 4, // Espace entre les deux sections
          }}
        >
          {/* Box pour l'évaluation globale */}
            <Box
            sx={{
              flex: "0 0 30%", // Largeur fixe de 30%
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            >
            <Rating sprId = {sprId} />
            </Box>
  
          {/* Box pour les avis */}
          <Box
            sx={{
              flex: "0 0 65%", // Largeur fixe de 65%
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <AvisBox sprId = {sprId} id_utilisateur = {id_utilisateur}/>
          </Box>
        </Box>
      </>
    );
  }

export default AvisSection;


