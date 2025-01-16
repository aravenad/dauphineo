import React, { useState, useEffect, useRef } from "react";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { ButtonCustom } from "./mui_custom";

interface SPRPhotosDetailedProps {
    images: { id: number; image_url: string }[];
    selectedImage?: number;
    onClose: () => void;
}

const SPRPhotosDetailed: React.FC<SPRPhotosDetailedProps> = ({ images, selectedImage = 0, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(selectedImage);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleThumbnailClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "fixed",
                top: "10%",
                left: "10%",
                width: "80%",
                height: "80%",
                backgroundColor: "white",
                borderRadius: "1em",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                display: "flex",
                overflow: "hidden",
                zIndex: 1300,
            }}
        >
            {/* Colonne des miniatures */}
            <Box
                sx={{
                    width: "20%",
                    height: "100%",
                    overflowY: "auto",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5em",
                    padding: "1em",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                        marginBottom: "0px",
                        fontWeight: "bold",
                    }}
                >
                    Photos
                </Typography>
                {images.map((image, index) => (
                    <Card
                        key={image.id}
                        sx={{
                            cursor: "pointer",
                            border: index === currentImageIndex ? "2px solid #1976d2" : "none",
                            borderRadius: "0.5em",
                            overflow: "hidden",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <CardMedia
                            component="img"
                            image={image.image_url}
                            alt={`Image miniature ${index}`}
                            sx={{
                                width: "100%",
                                objectFit: "contain",
                                display: "block",
                                margin: "0 auto",
                            }}
                        />
                    </Card>
                ))}
            </Box>

            {/* Colonne de visualisation */}
            <Box
                sx={{
                    width: "80%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                }}
            >
                {images[currentImageIndex] && (
                    <CardMedia
                        component="img"
                        image={images[currentImageIndex].image_url}
                        alt={`Image ${currentImageIndex}`}
                        sx={{
                            maxWidth: "90%",
                            width: "auto",
                            minHeight: "75%",
                            maxHeight: "80%",
                            objectFit: "contain",
                            borderRadius: "0.5em",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        }}
                    />
                )}

                {/* Bouton Fermer */}
                <ButtonCustom
                    variant="outlined"
                    color="error"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        bottom: "1em",
                        right: "1em",
                        textTransform: "none",
                        fontWeight: "bold",
                    }}
                >
                    Fermer
                </ButtonCustom>
            </Box>
        </Box>
    );
};

export default SPRPhotosDetailed;