import { Box, Button, Modal, Typography } from "@mui/material";
import { CardAvis } from "./index.ts";
import FormulaireAvis from "./FormulaireAvis";
import { useState } from "react";

function AvisBox() {
  const [isFormOpen, setIsFormOpen] = useState(false); // État pour contrôler l'ouverture du formulaire

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  return (
    <>
      {/* Bouton pour ouvrir le popup */}
      <Button
        variant="contained"
        onClick={handleOpenForm}
        sx={{
          width: "20%",
          height: "5%",
          borderRadius: "50px",
          backgroundColor: "#FCFAF9",
          color: "#407E76",
          border: "2px solid green",
          padding: "10px 20px",
          alignSelf: "flex-end",
          fontSize: "small",
          fontWeight: 500,
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
          <FormulaireAvis onClose={handleCloseForm} />
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
        <CardAvis />
        <CardAvis />
        <CardAvis />
      </Box>
    </>
  );
}

export default AvisBox;
