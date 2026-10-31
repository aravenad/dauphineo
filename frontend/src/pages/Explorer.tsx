import { useState } from "react";
import { Alert, Badge, Box, Chip, Skeleton, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import api, { type Spr } from "../api";
import { useApi, useTitre } from "../hooks";
import { heures, libelleMotCle, normaliser } from "../utils/format";
import CardSPR from "../components/CardSPR";
import FilterPanel from "../components/FilterPanel";
import { DUREE_MAX, FILTRES_VIDES, type Filtres } from "../components/filtres";
import { ButtonCustom } from "../components/mui_custom";
import { entreeEnCascade } from "../animations";
import { locale, useTextes } from "../i18n";

const TEXTES = {
    fr: {
        titre: "Explorer les sites",
        entete: "Explorez le patrimoine",
        sousTitre: "Choisissez un lieu pour en savoir plus et réserver votre guide",
        compte: (n: number, total: number) => `${n} site${n > 1 ? "s" : ""} sur ${total}`,
        maximum: (h: string) => `${h} h maximum`,
        pmr: "♿ Accessible PMR",
        filtrer: "Filtrer",
        aucun: "Aucun site patrimonial remarquable ne correspond à ces critères.",
        reinitialiser: "Réinitialiser les filtres",
    },
    en: {
        titre: "Explore the sites",
        entete: "Explore the heritage",
        sousTitre: "Choose a place to learn more and book your guide",
        compte: (n: number, total: number) => `${n} of ${total} site${total > 1 ? "s" : ""}`,
        maximum: (h: string) => `${h} h maximum`,
        pmr: "♿ Step-free access",
        filtrer: "Filter",
        aucun: "No remarkable heritage site matches these criteria.",
        reinitialiser: "Reset the filters",
    },
};

function filtrer(sprs: Spr[], filtres: Filtres): Spr[] {
    const recherche = normaliser(filtres.recherche.trim());
    return sprs.filter((spr) => {
        const motsCles = spr.mot_cle.split(/\s+/);
        return (
            normaliser(spr.nom_commune).includes(recherche) &&
            filtres.motsCles.every((mot) => motsCles.includes(mot)) &&
            (filtres.dureeMax >= DUREE_MAX || heures(spr.temps_de_visite) <= filtres.dureeMax) &&
            (!filtres.pmr || spr.is_pmr)
        );
    });
}

function Explorer() {
    const t = useTextes(TEXTES);
    useTitre(t.titre);
    const { donnees, erreur, chargement } = useApi(() => api.listSpr(), []);
    const [filtres, setFiltres] = useState<Filtres>(FILTRES_VIDES);
    const [panneau, setPanneau] = useState(false);

    const sprs = [...(donnees ?? [])].sort((a, b) => a.nom_commune.localeCompare(b.nom_commune, "fr"));
    const resultats = filtrer(sprs, filtres);
    const actifs = filtres.motsCles.length + (filtres.dureeMax < DUREE_MAX ? 1 : 0) + (filtres.pmr ? 1 : 0) + (filtres.recherche.trim() ? 1 : 0);

    return (
        <Box>
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.75rem" } }}>
                    {t.entete}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "1.3em" }}>
                    {t.sousTitre}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }} aria-live="polite">
                    <Typography sx={{ color: "text.secondary" }}>
                        {donnees ? t.compte(resultats.length, sprs.length) : " "}
                    </Typography>
                    {filtres.recherche.trim() && <Chip label={`« ${filtres.recherche.trim()} »`} onDelete={() => setFiltres({ ...filtres, recherche: "" })} />}
                    {filtres.motsCles.map((mot) => (
                        <Chip key={mot} label={libelleMotCle(mot)} onDelete={() => setFiltres({ ...filtres, motsCles: filtres.motsCles.filter((m) => m !== mot) })} />
                    ))}
                    {filtres.dureeMax < DUREE_MAX && (
                        <Chip label={t.maximum(filtres.dureeMax.toLocaleString(locale()))} onDelete={() => setFiltres({ ...filtres, dureeMax: DUREE_MAX })} />
                    )}
                    {filtres.pmr && <Chip label={t.pmr} onDelete={() => setFiltres({ ...filtres, pmr: false })} />}
                </Box>
                <Badge badgeContent={actifs} color="primary">
                    <ButtonCustom variant="outlined" startIcon={<TuneIcon />} onClick={() => setPanneau(true)}>
                        {t.filtrer}
                    </ButtonCustom>
                </Badge>
            </Box>

            {erreur && <Alert severity="error">{erreur}</Alert>}

            {chargement && !donnees ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 2, md: 4 } }}>
                    {Array.from({ length: 8 }, (_, i) => (
                        <Skeleton key={i} variant="rounded" sx={{ aspectRatio: "1", height: "auto", borderRadius: "1em" }} />
                    ))}
                </Box>
            ) : resultats.length > 0 ? (
                // Les cartes qui réapparaissent après un changement de filtre arrivent aussi en cascade
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: { xs: 2, md: 4 }, ...entreeEnCascade() }}>
                    {resultats.map((spr) => (
                        <CardSPR key={spr.id} spr={spr} />
                    ))}
                </Box>
            ) : (
                donnees && (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
                            {t.aucun}
                        </Typography>
                        <ButtonCustom variant="outlined" onClick={() => setFiltres(FILTRES_VIDES)}>
                            {t.reinitialiser}
                        </ButtonCustom>
                    </Box>
                )
            )}

            <FilterPanel open={panneau} filtres={filtres} resultats={resultats.length} onChange={setFiltres} onClose={() => setPanneau(false)} />
        </Box>
    );
}

export default Explorer;
