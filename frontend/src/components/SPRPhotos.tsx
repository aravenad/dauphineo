import React, { useState } from "react";
import { Box, Card, CardMedia, Skeleton } from "@mui/material";
import { ButtonCustom } from "./mui_custom";

interface SPRPhotosProps {
    images: { id: number; image_url: string }[];
}

const SPRPhotos: React.FC<SPRPhotosProps> = ({ images }) => {
    if (!images || images.length < 3) {
        return null;
    }

    // Gestion du chargement des images
    const [loaded, setLoaded] = useState(images.map(() => false));

    const handleImageLoad = (index: number) => {
        setLoaded((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

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
                    {!loaded[0] && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                        />
                    )}
                    <CardMedia
                        component="img"
                        image={images[0].image_url}
                        alt={`Image portrait`}
                        onLoad={() => handleImageLoad(0)}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: loaded[0] ? "block" : "none",
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
                {[1, 2].map((index) => (
                    <Card
                        key={index}
                        sx={{
                            width: "100%",
                            height: "50%",
                            borderRadius: "1em",
                            overflow: "hidden",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.01)",
                            },
                            cursor: "pointer",
                        }}
                    >
                        {!loaded[index] && (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height="100%"
                                animation="wave"
                            />
                        )}
                        <CardMedia
                            component="img"
                            image={images[index].image_url}
                            alt={`Image horizontale ${index}`}
                            onLoad={() => handleImageLoad(index)}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: loaded[index] ? "block" : "none",
                            }}
                        />
                    </Card>
                ))}

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
            </Box>
        </Box>
    );
};

export default SPRPhotos;