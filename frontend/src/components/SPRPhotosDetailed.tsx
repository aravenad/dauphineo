import { useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Image } from "../api";

interface SPRPhotosDetailedProps {
    images: Image[];
    /** Index de la photo affichée à l'ouverture, ou null quand la galerie est fermée. */
    selection: number | null;
    commune: string;
    onClose: () => void;
    /** Signale une photo qui ne se charge pas, pour la retirer de la galerie. */
    onErreur: (id: number) => void;
}

function SPRPhotosDetailed({ images, selection, commune, onClose, onErreur }: SPRPhotosDetailedProps) {
    const [choisie, setCourante] = useState(selection ?? 0);
    // Une photo retirée en cours de route peut laisser l'index hors de la liste
    const courante = Math.min(choisie, Math.max(images.length - 1, 0));

    useEffect(() => {
        if (selection !== null) setCourante(selection);
    }, [selection]);

    const suivante = (pas: number) => setCourante((index) => (index + pas + images.length) % images.length);

    return (
        <Dialog
            open={selection !== null}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") suivante(1);
                if (e.key === "ArrowLeft") suivante(-1);
            }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Photos de {commune}
                <IconButton onClick={onClose} aria-label="Fermer la galerie">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ position: "relative", display: "grid", placeItems: "center", height: { xs: "45vh", md: "60vh" } }}>
                    {images[courante] && (
                        <Box
                            component="img"
                            src={images[courante].image_url}
                            alt={`Photo ${courante + 1} sur ${images.length}`}
                            onError={() => onErreur(images[courante].id)}
                            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "0.5em" }}
                        />
                    )}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={() => suivante(-1)}
                                aria-label="Photo précédente"
                                sx={{ position: "absolute", left: 0, backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.50" } }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => suivante(1)}
                                aria-label="Photo suivante"
                                sx={{ position: "absolute", right: 0, backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.50" } }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary" textAlign="center" aria-live="polite">
                    {courante + 1} / {images.length}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", justifyContent: { md: "center" } }}>
                    {images.map((image, index) => (
                        <Box
                            key={image.id}
                            component="button"
                            type="button"
                            onClick={() => setCourante(index)}
                            aria-label={`Afficher la photo ${index + 1}`}
                            aria-current={index === courante}
                            sx={{
                                flex: "0 0 auto",
                                p: 0,
                                border: 2,
                                borderColor: index === courante ? "primary.main" : "transparent",
                                borderRadius: "0.5em",
                                overflow: "hidden",
                                cursor: "pointer",
                                background: "none",
                            }}
                        >
                            <Box component="img" src={image.image_url} alt="" onError={() => onErreur(image.id)} sx={{ display: "block", width: 96, height: 64, objectFit: "cover" }} />
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default SPRPhotosDetailed;
