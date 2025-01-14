import {
    Card,
    Avatar,
    Typography,
    Button,
    Divider,
    Stack,
    Box
} from "@mui/material";

interface ChoixVisiteProps {
    guide: {
        name: string;
        role: string;
        photo: string;
    };
    date: string; // Date validée
    sprId: string; // Id du SPR
    onClose: () => void;
}

const ChoixVisite: React.FC<ChoixVisiteProps> = ({ guide, date, sprId, onClose }) => {
    if (!guide) {
        return <Typography>Erreur : Guide introuvable.</Typography>;
    }

    const handleRetour = () => {
        onClose();
    };

    const slots = [
        { start: "14:00", end: "15:00" },
        { start: "16:00", end: "17:00" },
        { start: "13:00", end: "17:00" }
    ];

    return (
        <Card
            sx={{
                maxWidth: 250,
                padding: 2,
                borderRadius: 4,
                boxShadow: 3,
                margin: "auto",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={guide.name} src={guide.photo} sx={{ width: 60, height: 60 }} />
                <Stack>
                    <Typography variant="h6" fontWeight="bold">
                        {guide.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {guide.role}
                    </Typography>
                </Stack>
            </Stack>

            <Divider sx={{ width: "100%", margin: "16px 0" }} />

            <Typography>
                Réservation pour le SPR ID: {sprId} à la date {date}
            </Typography>

            <Stack spacing={2} sx={{ marginTop: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Créneaux réservables
                </Typography>
                {slots.map((slot, index) => (
                    <Box
                        key={index}
                        sx={{
                            backgroundColor: "",
                            padding: 1,
                            borderRadius: 2,
                            textAlign: "center",
                            fontWeight: "bold",
                            border: "2px solid",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(0, 200, 150, 0.3)",
                            },
                        }}
                    >
                        De {slot.start} à {slot.end}
                    </Box>
                ))}
            </Stack>

            <Button
                variant="outlined"
                color="primary"
                onClick={handleRetour}
                sx={{
                    width: "100%",
                    fontWeight: "bold",
                    marginTop: 3
                }}
            >
                Retour
            </Button>
        </Card>
    );
};

export default ChoixVisite;
