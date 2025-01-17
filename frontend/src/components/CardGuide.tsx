import  { useState } from "react";
import { Avatar, Card, CardContent, Typography, Divider, Box, Button } from "@mui/material";
import {SliderReservation} from "./index.ts"; // Le nouveau composant Drawer

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
    id_spr: number // ID du SPR courant
}

const CardGuide = ({ guide, date, id_spr }: CardGuideProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{
        id: number;
        heureDebut: string;
        heureFin: string;
    } | null>(null); // Inclure id, heure de début et heure de fin

    const disponibilitesPourDate = guide.disponibilites.filter(
        (dispo) => dispo.date_jour === date
    );

    const handleSlotClick = (slot: { id: number; heureDebut: string; heureFin: string }) => {
        setSelectedSlot(slot); // Enregistrer l'ID et les heures du créneau sélectionné
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
                            {guide.nom[0]}
                            {guide.prenom[0]}
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
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: "1rem" }}
                        >
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
                                onClick={() =>
                                    handleSlotClick({
                                        id: dispo.id,
                                        heureDebut: dispo.creneaux.heure_debut,
                                        heureFin: dispo.creneaux.heure_fin,
                                    })
                                }
                                sx={{
                                    width: "120px",
                                    margin: "5px 0",
                                    fontSize: "0.85rem",
                                    textTransform: "none",
                                }}
                            >
                                {dispo.creneaux.heure_debut.slice(0, 5)} -{" "}
                                {dispo.creneaux.heure_fin.slice(0, 5)}
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
                <SliderReservation
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    idVisite={selectedSlot.id}
                    date={date}
                    id_spr={id_spr}
                    heureDebut={selectedSlot.heureDebut}
                    heureFin={selectedSlot.heureFin}
                />
            )}
        </>
    );
};

export default CardGuide;
