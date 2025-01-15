import React from "react";
import { Drawer, Box, Typography, Button } from "@mui/material";

interface DrawerDetailsProps {
    open: boolean;
    onClose: () => void;
    slot: any; // Informations du créneau
    guide: any; // Informations du guide
}

const SliderReservation: React.FC<DrawerDetailsProps> = ({ open, onClose, slot, guide }) => {
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
            <Box>
                <Typography variant="h4" gutterBottom>
                    Détails de la réservation
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Guide : {guide.prenom} {guide.nom}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Créneau : {slot.creneaux.heure_debut.slice(0, 5)} - {slot.creneaux.heure_fin.slice(0, 5)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Date : {slot.date_jour}
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
