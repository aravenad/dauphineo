import React, { useState } from "react";
import { Avatar, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import ChoixVisite from "./ChoixVisite";

interface Guide {
    name: string;
    role: string;
    photo: string;
}

interface CardGuideProps {
    guide: Guide;
    date: string; // Date validée
    sprId: string; // Id du SPR
}

const CardGuide: React.FC<CardGuideProps> = ({ guide, date, sprId }) => {
    const [showChoixVisite, setShowChoixVisite] = useState(false);

    const handleReserveClick = () => {
        setShowChoixVisite(true);
    };

    return (
        <>
            {!showChoixVisite ? (
                <Card
                    sx={{
                        width: 200,
                        maxWidth: 400,
                        padding: 2,
                        borderRadius: 4,
                        boxShadow: 3,
                        textAlign: "center",
                    }}
                >
                    <Stack alignItems="center">
                        <Avatar
                            alt={guide.name}
                            src={guide.photo}
                            sx={{
                                width: 80,
                                height: 80,
                                marginBottom: 2,
                            }}
                        />
                    </Stack>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                            {guide.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {guide.role}
                        </Typography>
                    </CardContent>
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
                        onClick={handleReserveClick}
                    >
                        Réserver
                    </Button>
                </Card>
            ) : (
                <ChoixVisite
                    guide={guide}
                    date={date} // Passe la date validée
                    sprId={sprId} // Passe l'id du SPR
                    onClose={() => setShowChoixVisite(false)}
                />
            )}
        </>
    );
};

export default CardGuide;
