import { useEffect, useState } from "react";
import { Box, Link, Skeleton, Typography } from "@mui/material";
import { useTextes } from "../i18n";

interface SPRMapProps {
    commune: string;
    departement: string;
}

interface Position {
    lat: number;
    lon: number;
}

/** Les communes déjà géolocalisées pendant la visite du site. */
const positions = new Map<string, Position | null>();

async function geolocaliser(lieu: string): Promise<Position | null> {
    if (positions.has(lieu)) {
        return positions.get(lieu) ?? null;
    }
    const parametres = new URLSearchParams({ q: `${lieu}, France`, format: "json", limit: "1" });
    const reponse = await fetch(`https://nominatim.openstreetmap.org/search?${parametres}`, {
        headers: { Accept: "application/json" },
    });
    if (!reponse.ok) {
        throw new Error(`Nominatim a répondu ${reponse.status}`);
    }
    const [resultat] = (await reponse.json()) as { lat: string; lon: string }[];
    const position = resultat ? { lat: Number(resultat.lat), lon: Number(resultat.lon) } : null;
    positions.set(lieu, position);
    return position;
}

/** Carte OpenStreetMap de la commune, sans clé d'API. */
function SPRMap({ commune, departement }: SPRMapProps) {
    // Le département distingue les homonymes, comme Saint-Vallier en Drôme et en Saône-et-Loire
    const lieu = `${commune}, ${departement}`;
    const [etat, setEtat] = useState<{ commune: string; position: Position | null } | null>(null);
    const t = useTextes({
        fr: {
            echec: "La carte n'a pas pu être chargée.",
            voir: (c: string) => `Voir ${c} sur OpenStreetMap`,
            carte: (c: string) => `Carte de ${c}`,
            agrandir: "Agrandir la carte",
        },
        en: {
            echec: "The map could not be loaded.",
            voir: (c: string) => `See ${c} on OpenStreetMap`,
            carte: (c: string) => `Map of ${c}`,
            agrandir: "Enlarge the map",
        },
    });

    useEffect(() => {
        let actif = true;
        geolocaliser(lieu)
            .catch(() => null)
            .then((position) => actif && setEtat({ commune, position }));
        return () => {
            actif = false;
        };
    }, [commune, lieu]);

    const recherche = `https://www.openstreetmap.org/search?query=${encodeURIComponent(lieu)}`;

    if (etat?.commune !== commune) {
        return <Skeleton variant="rounded" sx={{ width: "100%", height: 300, borderRadius: "1em" }} />;
    }

    if (!etat.position) {
        return (
            <Box sx={{ width: "100%", height: 300, borderRadius: "1em", backgroundColor: "primary.light", display: "grid", placeItems: "center", p: 2 }}>
                <Typography sx={{ textAlign: "center" }}>
                    {t.echec}{" "}
                    <Link href={recherche} target="_blank" rel="noopener">
                        {t.voir(commune)}
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
                title={t.carte(commune)}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${cadre}&layer=mapnik&marker=${lat},${lon}`}
                loading="lazy"
                sx={{ width: "100%", height: 300, border: 0, borderRadius: "1em" }}
            />
            <Typography variant="body2" sx={{ textAlign: "right" }}>
                <Link href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`} target="_blank" rel="noopener">
                    {t.agrandir}
                </Link>
            </Typography>
        </Box>
    );
}

export default SPRMap;
