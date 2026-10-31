import { useEffect, useState } from "react";
import { Box, Link, Skeleton, Typography } from "@mui/material";

interface SPRMapProps {
    commune: string;
}

interface Position {
    lat: number;
    lon: number;
}

/** Les communes déjà géolocalisées pendant la visite du site. */
const positions = new Map<string, Position | null>();

async function geolocaliser(commune: string): Promise<Position | null> {
    if (positions.has(commune)) {
        return positions.get(commune) ?? null;
    }
    const parametres = new URLSearchParams({ q: `${commune}, Isère, France`, format: "json", limit: "1" });
    const reponse = await fetch(`https://nominatim.openstreetmap.org/search?${parametres}`, {
        headers: { Accept: "application/json" },
    });
    if (!reponse.ok) {
        throw new Error(`Nominatim a répondu ${reponse.status}`);
    }
    const [resultat] = (await reponse.json()) as { lat: string; lon: string }[];
    const position = resultat ? { lat: Number(resultat.lat), lon: Number(resultat.lon) } : null;
    positions.set(commune, position);
    return position;
}

/** Carte OpenStreetMap de la commune, sans clé d'API. */
function SPRMap({ commune }: SPRMapProps) {
    const [etat, setEtat] = useState<{ commune: string; position: Position | null } | null>(null);

    useEffect(() => {
        let actif = true;
        geolocaliser(commune)
            .catch(() => null)
            .then((position) => actif && setEtat({ commune, position }));
        return () => {
            actif = false;
        };
    }, [commune]);

    const recherche = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${commune}, Isère`)}`;

    if (etat?.commune !== commune) {
        return <Skeleton variant="rounded" sx={{ width: "100%", height: 300, borderRadius: "1em" }} />;
    }

    if (!etat.position) {
        return (
            <Box sx={{ width: "100%", height: 300, borderRadius: "1em", backgroundColor: "primary.light", display: "grid", placeItems: "center", p: 2 }}>
                <Typography sx={{ textAlign: "center" }}>
                    La carte n'a pas pu être chargée.{" "}
                    <Link href={recherche} target="_blank" rel="noopener">
                        Voir {commune} sur OpenStreetMap
                    </Link>
                </Typography>
            </Box>
        );
    }

    const { lat, lon } = etat.position;
    const marge = 0.03;
    const cadre = [lon - marge, lat - marge / 2, lon + marge, lat + marge / 2].join(",");

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                component="iframe"
                title={`Carte de ${commune}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${cadre}&layer=mapnik&marker=${lat},${lon}`}
                loading="lazy"
                sx={{ width: "100%", height: 300, border: 0, borderRadius: "1em" }}
            />
            <Typography variant="body2" sx={{ textAlign: "right" }}>
                <Link href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`} target="_blank" rel="noopener">
                    Agrandir la carte
                </Link>
            </Typography>
        </Box>
    );
}

export default SPRMap;
