import React from "react";
import { Drawer, Box, Typography, Button } from "@mui/material";

interface DrawerDetailsProps {
    open: boolean;
    onClose: () => void;
    idVisite: number; // Seule la clé est passée
    id_spr: number; // ID du SPR courant
    date: string; // Date validée au format AAAA-MM-JJ
    heureDebut: string; // Heure de début du créneau
    heureFin: string; // Heure de fin du créneau
}

const SliderReservation: React.FC<DrawerDetailsProps> = ({
         open,
         onClose,
         idVisite,
         date,
         id_spr,
         heureDebut,
         heureFin,
     }) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "50%", // Occupe la moitié de l'écran
                    padding: "2em",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2, // Ajoute un espacement uniforme entre les éléments
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Détails de la réservation pour le SPR {id_spr}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Identifiant de la visite sélectionnée : {idVisite}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Date : {date}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Heure de début : {heureDebut}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Heure de fin : {heureFin}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{ marginTop: 2 }}
                >
                    Fermer
                </Button>
            </Box>

        </Drawer>
    );
};

export default SliderReservation;

