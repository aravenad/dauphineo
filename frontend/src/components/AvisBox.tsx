import { Box } from "@mui/material";
import { CardAvis } from "./index.ts";

function Avisbox() {
  return (
    <>
        {/* Box pour les avis (complètement à droite) */}
        <Box
          sx={{
            flex: 2, // Prend plus d'espace
            display: "flex",
            flexDirection: "column",
            marginLeft: 'auto', // Pousse cette Box complètement à droite
          }}
        >
          <CardAvis />
          <CardAvis />
          <CardAvis />
        </Box>

    </>
  );
}

export default Avisbox;