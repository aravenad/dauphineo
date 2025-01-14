import { Box } from "@mui/material";
import Rating from "./Rating.tsx";
import AvisBox from "./AvisBox.tsx";


function AvisSection() {
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
            <Rating />
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
            <AvisBox />
          </Box>
        </Box>
      </>
    );
  }

export default AvisSection;