import { useState } from "react";
import { Box, ButtonBase } from "@mui/material";
import type { Image } from "../api";
import { attributsImage } from "../utils/images";
import { ButtonCustom } from "./mui_custom";
import SPRPhotosDetailed from "./SPRPhotosDetailed";

interface SPRPhotosProps {
    images: Image[];
    commune: string;
}

/** Une grande photo et jusqu'à deux petites ; toutes s'ouvrent dans la galerie. */
function SPRPhotos({ images: toutes, commune }: SPRPhotosProps) {
    const [selection, setSelection] = useState<number | null>(null);
    // Les photos sont hébergées par des sites tiers : celles qui ne répondent plus sont retirées
    const [cassees, setCassees] = useState<ReadonlySet<number>>(new Set());
    const images = toutes.filter((image) => !cassees.has(image.id));
    const retirer = (id: number) => setCassees((ids) => new Set(ids).add(id));

    if (images.length === 0) {
        return null;
    }

    const apercu = images.slice(0, 3);

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gap: "1em",
                    height: { xs: "auto", md: 520 },
                    gridTemplateColumns: { xs: "1fr", md: apercu.length > 1 ? "1fr 1fr" : "1fr" },
                    gridTemplateRows: { md: apercu.length > 2 ? "1fr 1fr" : "1fr" },
                    position: "relative",
                }}
            >
                {apercu.map((image, index) => (
                    <ButtonBase
                        key={image.id}
                        onClick={() => setSelection(index)}
                        aria-label={`Agrandir la photo ${index + 1} de ${commune}`}
                        sx={{
                            borderRadius: "1em",
                            overflow: "hidden",
                            gridRow: { md: index === 0 && apercu.length > 2 ? "span 2" : "auto" },
                            display: index > 0 ? { xs: "none", md: "block" } : "block",
                            aspectRatio: { xs: "4 / 3", md: "auto" },
                            "&:hover img": { transform: "scale(1.02)" },
                        }}
                    >
                        <Box
                            component="img"
                            {...attributsImage(image.image_url, "(max-width: 899px) 100vw, 50vw", [500, 960, 1280])}
                            alt=""
                            onError={() => retirer(image.id)}
                            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                        />
                    </ButtonBase>
                ))}

                {images.length > 1 && (
                    <ButtonCustom
                        variant="contained"
                        onClick={() => setSelection(0)}
                        sx={{ position: "absolute", bottom: "1em", right: "1em" }}
                    >
                        Afficher les {images.length} photos
                    </ButtonCustom>
                )}
            </Box>

            <SPRPhotosDetailed images={images} selection={selection} commune={commune} onClose={() => setSelection(null)} onErreur={retirer} />
        </>
    );
}

export default SPRPhotos;
