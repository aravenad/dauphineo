import React, { useState } from "react";
import { Avatar, Card, CardContent, Typography, Divider, Box, Button } from "@mui/material";
import DrawerDetails from "./SliderReservation.tsx"; // Le nouveau composant Drawer

interface Disponibilite {
    id: number;
    date_jour: string;
    creneaux: {
        heure_debut: string;
        heure_fin: string;
    };
}

interface Guide {
    nom: string;
    prenom: string;
    disponibilites: Disponibilite[];
}

interface CardGuideProps {
    guide: Guide; // Objet complet du guide
    date: string; // Date validée au format AAAA-MM-JJ
}

const CardGuide: React.FC<CardGuideProps> = ({ guide, date }) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Disponibilite | null>(null);

    const disponibilitesPourDate = guide.disponibilites.filter(
        (dispo) => dispo.date_jour === date
    );

    const handleSlotClick = (slot: Disponibilite) => {
        setSelectedSlot(slot);
        setOpenDrawer(true);
    };

    return (
        <>
            <Card
                sx={{
                    width: 240,
                    padding: 2,
                    borderRadius: 4,
                    boxShadow: 3,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {/* Avatar et informations du guide */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            alt={`${guide.nom} ${guide.prenom}`}
                            sx={{
                                width: 60,
                                height: 60,
                                backgroundColor: "#f0f0f0",
                            }}
                        >
                            {guide.nom[0]}{guide.prenom[0]}
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 0.5,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
                            {guide.prenom}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1rem" }}>
                            {guide.nom}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ marginY: 1 }} />

                {/* Créneaux disponibles */}
                <CardContent
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="body2" fontWeight="bold">
                        Créneaux disponibles
                    </Typography>
                    {disponibilitesPourDate.length > 0 ? (
                        disponibilitesPourDate.map((dispo) => (
                            <Button
                                key={dispo.id}
                                variant="outlined"
                                onClick={() => handleSlotClick(dispo)}
                                sx={{
                                    width: "120px",
                                    margin: "5px 0",
                                    fontSize: "0.85rem",
                                    textTransform: "none",
                                }}
                            >
                                {dispo.creneaux.heure_debut.slice(0, 5)} - {dispo.creneaux.heure_fin.slice(0, 5)}
                            </Button>
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                marginTop: 1,
                                fontSize: "0.85rem",
                                textAlign: "center",
                            }}
                        >
                            Aucun créneau disponible pour cette date.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Drawer */}
            {openDrawer && selectedSlot && (
                <DrawerDetails
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    slot={selectedSlot}
                    guide={guide}
                />
            )}
        </>
    );
};

export default CardGuide;
