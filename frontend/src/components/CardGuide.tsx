import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import Button from "@mui/material/Button";

function CardGuide() {
  return (
    <>
        <Card
            sx={{
                maxWidth: 200,
                padding: 2,
                borderRadius: 4,
                boxShadow: 3,
                textAlign: "center",
            }}
        >
            {/* Avatar */}
            <Stack alignItems="center">
                <Avatar
                    alt="Maxime Roux"
                    src="https://raplume.eu/wp-content/uploads/2021/04/Capture-decran-2021-04-06-a-16.52.05.png" // Remplace avec l'URL de l'image
                    sx={{
                        width: 80,
                        height: 80,
                        marginBottom: 2,
                    }}
                />
            </Stack>

            {/* Contenu */}
            <CardContent>
                <Typography variant="h6" fontWeight="bold">
                    Naps le vrai
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    Guide touristique
                </Typography>
            </CardContent>
            {/* Bouton */}
            <Button
                variant="contained"
                size="small"
                sx={{
                    backgroundColor: "#2D6A4F",
                    "&:hover": {
                        backgroundColor: "#1B4332",
                    },
                    textTransform: "none",
                }}
            >
                Réserver
            </Button>
        </Card>
    </>
  );
}

export default CardGuide;