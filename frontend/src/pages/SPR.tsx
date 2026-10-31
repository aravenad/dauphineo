import { useParams } from "react-router";
import { Alert, Box, Chip, Skeleton, Typography } from "@mui/material";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GroupsIcon from "@mui/icons-material/Groups";
import api from "../api";
import { useApi, useTitre } from "../hooks";
import { formaterDuree, heures, nomCommune } from "../utils/format";
import SPRPhotos from "../components/SPRPhotos";
import SPRMap from "../components/SPRMap";
import AvisSection from "../components/AvisSection";
import MotsCles from "../components/MotsCles";
import ReservationSection from "../components/ReservationSection";
import { useLangue, useTextes } from "../i18n";

const TEXTES = {
    fr: {
        introuvable: "Ce site patrimonial est introuvable.",
        titreIntrouvable: "Site introuvable",
        description: "Description",
        visite: (d: string) => `Visite de ${d}`,
        capacite: (n: number) => `Jusqu'à ${n} visiteurs par créneau`,
        pmr: "Adapté aux personnes à mobilité réduite",
        nonPmr: "Non adapté aux personnes à mobilité réduite",
    },
    en: {
        titreIntrouvable: "Site not found",
        introuvable: "This heritage site cannot be found.",
        description: "Description",
        visite: (d: string) => `${d} tour`,
        capacite: (n: number) => `Up to ${n} visitors per time slot`,
        pmr: "Suitable for people with reduced mobility",
        nonPmr: "Not suitable for people with reduced mobility",
    },
};

function SPR() {
    const id = Number(useParams().id);
    const { donnees: spr, erreur, chargement } = useApi(
        () => (Number.isInteger(id) && id > 0 ? api.getSpr(id) : Promise.reject(new Error())),
        [id],
    );
    const nom = spr ? nomCommune(spr.nom_commune) : "";
    const { langue } = useLangue();
    const t = useTextes(TEXTES);
    // Les descriptions restent en français quand la traduction manque : l'attribut lang suit le texte affiché
    const anglais = langue === "en" && Boolean(spr?.longue_description_en);

    // Sans titre, le fil d'Ariane attendrait indéfiniment le nom d'un site qui n'existe pas
    useTitre(spr ? nom : erreur || !chargement ? t.titreIntrouvable : undefined);

    if (chargement && !spr) {
        return (
            <Box>
                <Skeleton variant="text" width="40%" height={64} />
                <Skeleton variant="rounded" height={520} sx={{ mt: 2, borderRadius: "1em" }} />
            </Box>
        );
    }

    if (erreur || !spr) {
        return (
            <Box>
                <Alert severity="error">{erreur ?? t.introuvable}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
                {nom}
            </Typography>
            <Typography lang={anglais ? "en" : "fr"} sx={{ fontSize: "1.2em", color: "text.secondary", mb: 3 }}>
                {anglais ? spr.courte_description_en : spr.courte_description}
            </Typography>

            <SPRPhotos images={spr.images} commune={nom} />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: 6 }}>
                <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                        {t.description}
                    </Typography>
                    <Typography lang={anglais ? "en" : "fr"} sx={{ fontSize: "1.1rem", hyphens: "auto" }}>
                        {anglais ? spr.longue_description_en : spr.longue_description}
                    </Typography>
                    <MotsCles motCle={spr.mot_cle} taille="medium" />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip icon={<ScheduleIcon />} label={t.visite(formaterDuree(heures(spr.temps_de_visite)))} />
                        <Chip icon={<GroupsIcon />} label={t.capacite(spr.capacite_de_visite)} />
                        <Chip
                            icon={<AccessibleIcon />}
                            label={spr.is_pmr ? t.pmr : t.nonPmr}
                            color={spr.is_pmr ? "primary" : "default"}
                            variant={spr.is_pmr ? "filled" : "outlined"}
                        />
                    </Box>
                </Box>
                <Box sx={{ flex: 2 }}>
                    <SPRMap commune={nom} departement={spr.nom_du_departement} />
                </Box>
            </Box>

            <Box sx={{ mt: 6 }}>
                <ReservationSection sprId={spr.id} />
            </Box>

            <Box sx={{ mt: 8 }}>
                <AvisSection sprId={spr.id} />
            </Box>
        </Box>
    );
}

export default SPR;
