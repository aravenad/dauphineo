import { Card, Avatar, Typography, Button, Divider, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import  { Dayjs } from "dayjs";
import React, { useState } from "react";

const ChoixVisite: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        console.log("Date sélectionnée :", date ? date.format("DD/MM/YYYY") : "Aucune date");
    };

    return (
        <Card
            sx={{
                maxWidth: 400,
                padding: 2,
                borderRadius: 4,
                boxShadow: 3,
                margin: "auto",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                    alt="Nicolas Rousseau"
                    src="https://via.placeholder.com/150"
                    sx={{
                        width: 80,
                        height: 80,
                    }}
                />
                <Stack>
                    <Typography variant="h6" fontWeight="bold">
                        Nicolas Rousseau
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Bénévole
                    </Typography>
                </Stack>
            </Stack>

            <Divider sx={{ width: "100%", margin: "16px 0" }} />

            {/* Sélecteur de date */}
            <Typography variant="body1" fontWeight="bold" textAlign="center" sx={{ marginBottom: 2 }}>
                Choisissez une date
            </Typography>
            <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
            />

            <Divider sx={{ width: "100%", margin: "16px 0" }} />

            <Button
                variant="outlined"
                sx={{
                    color: "#2D6A4F",
                    borderColor: "#2D6A4F",
                    textTransform: "none",
                    "&:hover": {
                        backgroundColor: "#E9FBEF",
                        borderColor: "#2D6A4F",
                    },
                }}
                fullWidth
                onClick={() => console.log("Retour cliqué !")}
            >
                Retour
            </Button>
        </Card>
    );
};

export default ChoixVisite;
