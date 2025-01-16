import React from "react";
import { Box, Card, CardMedia } from "@mui/material";
import { ButtonCustom } from "./mui_custom";

interface SPRPhotosProps {
    images: { id: number; image_url: string }[];
}

const SPRPhotos: React.FC<SPRPhotosProps> = ({ images }) => {
    if (!images || images.length < 3) {
        return null;
    }

    return (
        <Box sx={{ display: "flex", gap: "1em", height: "650px" }}>
            {/* Première colonne : photo au format portrait */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <Card
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "1em",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.01)",
                        },
                        cursor: "pointer",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={images[0].image_url}
                        alt={`Image portrait`}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Card>
            </Box>

            {/* Deuxième colonne : deux photos horizontales */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                    height: "100%",
                    position: "relative",
                }}
            >
                <Card
                    sx={{
                        width: "100%",
                        height: "50%",
                        borderRadius: "1em",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.01)",
                        },
                        cursor:"pointer",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={images[1].image_url}
                        alt={`Image horizontale 1`}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Card>
                <Card
                    sx={{
                        width: "100%",
                        height: "50%",
                        borderRadius: "1em",
                        overflow: "hidden",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.01)",
                        },
                        cursor:"pointer",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={images[2].image_url}
                        alt={`Image horizontale 2`}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />

                    {/* Bouton pour afficher toutes les photos */}
                    {images.length > 3 && (
                        <ButtonCustom
                            variant="outlined"
                            sx={{
                                position: "absolute",
                                bottom: "1em",
                                right: "1em",
                                textTransform: "none",
                                background: "#fff",
                                borderRadius: "1em",
                                zIndex: 1,
                                "&:hover": {
                                    background: "rgba(80, 125, 118)",
                                    color: "white",
                                },
                            }}
                        >
                            Afficher toutes les photos
                        </ButtonCustom>
                    )}
                </Card>
            </Box>
        </Box>
    );
};

export default SPRPhotos;