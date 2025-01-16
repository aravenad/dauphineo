import React, { useState } from "react";
import { Box, Card, CardMedia, Skeleton, Backdrop } from "@mui/material";
import { ButtonCustom } from "./mui_custom";
import SPRPhotosDetailed from "./SPRPhotosDetailed";

interface SPRPhotosProps {
    images: { id: number; image_url: string }[];
}

const SPRPhotos: React.FC<SPRPhotosProps> = ({ images }) => {
    if (!images || images.length < 3) {
        return null;
    }

    // Gestion du chargement des images
    const [loaded, setLoaded] = useState(images.map(() => false));

    // Gestion de l'ouverture du composant SPRPhotosDetailed
    const [isDetailedOpen, setDetailedOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleImageLoad = (index: number) => {
        setLoaded((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    const handleImageClick = (index: number) => {
        setSelectedImage(index);
        setDetailedOpen(true);
    };

    const handleCloseDetailed = () => {
        setDetailedOpen(false);
        setSelectedImage(null);
    };

    return (
        <>
            {/* Backdrop pour griser le reste de la page */}
            <Backdrop
                open={isDetailedOpen}
                sx={{
                    zIndex: 1200,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
            />

            {/* Composant SPRPhotosDetailed */}
            {isDetailedOpen && selectedImage !== null && (
                <SPRPhotosDetailed
                    images={images}
                    selectedImage={selectedImage}
                    onClose={handleCloseDetailed}
                />
            )}

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
                        onClick={() => handleImageClick(0)}
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
                            onClick={() => handleImageClick(index)}
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
                            onClick={() => handleImageClick(0)}
                        >
                            Afficher toutes les photos
                        </ButtonCustom>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default SPRPhotos;