import { useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Image } from "../api";
import { attributsImage } from "../utils/images";
import { useImageChargee } from "../animations";
import { useTextes } from "../i18n";

interface SPRPhotosDetailedProps {
    images: Image[];
    /** Index de la photo affichée à l'ouverture, ou null quand la galerie est fermée. */
    selection: number | null;
    commune: string;
    onClose: () => void;
    /** Signale une photo qui ne se charge pas, pour la retirer de la galerie. */
    onErreur: (id: number) => void;
}

/** Photo principale : remontée à chaque changement (clé) pour repartir en fondu */
function PhotoAgrandie({ image, alt, onErreur }: { image: Image; alt: string; onErreur: () => void }) {
    const { imageProps, style } = useImageChargee();
    return (
        <Box
            component="img"
            {...attributsImage(image.image_url, "(max-width: 899px) 100vw, 900px", [500, 960, 1280])}
            {...imageProps}
            alt={alt}
            onError={onErreur}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", ...style }}
        />
    );
}

function SPRPhotosDetailed({ images, selection, commune, onClose, onErreur }: SPRPhotosDetailedProps) {
    const [choisie, setCourante] = useState(selection ?? 0);
    const t = useTextes({
        fr: {
            titre: (c: string) => `Photos de ${c}`,
            fermer: "Fermer la galerie",
            photo: (n: number, total: number) => `Photo ${n} sur ${total}`,
            precedente: "Photo précédente",
            suivante: "Photo suivante",
            credit: " · Photo : ",
            afficher: (n: number) => `Afficher la photo ${n}`,
        },
        en: {
            titre: (c: string) => `Photos of ${c}`,
            fermer: "Close the gallery",
            photo: (n: number, total: number) => `Photo ${n} of ${total}`,
            precedente: "Previous photo",
            suivante: "Next photo",
            credit: " · Photo: ",
            afficher: (n: number) => `Show photo ${n}`,
        },
    });
    // Une photo retirée en cours de route peut laisser l'index hors de la liste
    const courante = Math.min(choisie, Math.max(images.length - 1, 0));

    // Chaque ouverture repart de la photo cliquée
    const [selectionVue, setSelectionVue] = useState(selection);
    if (selection !== selectionVue) {
        setSelectionVue(selection);
        if (selection !== null) setCourante(selection);
    }

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
                {t.titre(commune)}
                <IconButton onClick={onClose} aria-label={t.fermer}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Cadre de hauteur fixe : quel que soit le format de la photo, la légende et les vignettes restent visibles */}
                <Box sx={{ position: "relative", flex: "0 0 auto", height: "min(62vh, calc(100dvh - 320px))", minHeight: 220, borderRadius: "0.75em", overflow: "hidden", backgroundColor: "primary.dark" }}>
                    {images[courante] && (
                        <PhotoAgrandie
                            key={images[courante].id}
                            image={images[courante]}
                            alt={t.photo(courante + 1, images.length)}
                            onErreur={() => onErreur(images[courante].id)}
                        />
                    )}
                    {images.length > 1 && (
                        <>
                            <IconButton
                                onClick={() => suivante(-1)}
                                aria-label={t.precedente}
                                sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.100" } }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => suivante(1)}
                                aria-label={t.suivante}
                                sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", backgroundColor: "common.white", "&:hover": { backgroundColor: "grey.100" } }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
                <Typography variant="body2" aria-live="polite" sx={{ color: "text.secondary", textAlign: "center" }}>
                    {courante + 1} / {images.length}
                    {images[courante]?.auteur && (
                        <>
                            {t.credit}
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
                            aria-label={t.afficher(index + 1)}
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
