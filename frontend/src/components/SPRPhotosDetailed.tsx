import { useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Image } from "../api";
import { attributsImage } from "../utils/images";

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
                {/* Cadre de hauteur fixe : quel que soit le format de la photo, la légende et les vignettes restent visibles */}
                <Box sx={{ position: "relative", flex: "0 0 auto", height: "min(62vh, calc(100dvh - 320px))", minHeight: 220, borderRadius: "0.75em", overflow: "hidden", backgroundColor: "primary.dark" }}>
                    {images[courante] && (
                        <Box
                            component="img"
                            {...attributsImage(images[courante].image_url, "(max-width: 899px) 100vw, 900px", [500, 960, 1280])}
                            alt={`Photo ${courante + 1} sur ${images.length}`}
                            onError={() => onErreur(images[courante].id)}
                            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    )}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={() => suivante(-1)}
                                aria-label="Photo précédente"
                                sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.100" } }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => suivante(1)}
                                aria-label="Photo suivante"
                                sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.100" } }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary" textAlign="center" aria-live="polite">
                    {courante + 1} / {images.length}
                    {images[courante]?.auteur && (
                        <>
                            {" · Photo : "}
                            {images[courante].auteur}
                            {images[courante].licence && `, ${images[courante].licence}`}
                            {images[courante].source && (
                                <>
                                    {", "}
                                    <Link href={images[courante].source ?? undefined} target="_blank" rel="noopener">
                                        Wikimedia Commons
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", flex: "0 0 auto", justifyContent: { md: "center" } }}>
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
                            <Box component="img" {...attributsImage(image.image_url, "96px", [120, 330])} alt="" loading="lazy" onError={() => onErreur(image.id)} sx={{ display: "block", width: 96, height: 64, objectFit: "cover" }} />
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default SPRPhotosDetailed;
