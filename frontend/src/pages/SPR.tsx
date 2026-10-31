import { Link as RouterLink, useParams } from "react-router";
import { Alert, Box, Button, Chip, Skeleton, Typography } from "@mui/material";
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

function SPR() {
    const id = Number(useParams().id);
    const { donnees: spr, erreur, chargement } = useApi(
        () => (Number.isInteger(id) && id > 0 ? api.getSpr(id) : Promise.reject(new Error())),
        [id],
    );
    const nom = spr ? nomCommune(spr.nom_commune) : "";

    useTitre(nom);

    const retour = (
        <Button component={RouterLink} to="/explorer" sx={{ color: "text.secondary", textTransform: "none", fontSize: "1rem", mb: 1 }}>
            ← Retour à la liste des SPR
        </Button>
    );

    if (chargement && !spr) {
        return (
            <Box>
                {retour}
                <Skeleton variant="text" width="40%" height={64} />
                <Skeleton variant="rounded" height={520} sx={{ mt: 2, borderRadius: "1em" }} />
            </Box>
        );
    }

    if (erreur || !spr) {
        return (
            <Box>
                {retour}
                <Alert severity="error">{erreur ?? "Ce site patrimonial est introuvable."}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            {retour}

            <Typography variant="h3" component="h1" fontWeight="bold">
                {nom}
            </Typography>
            <Typography fontSize="1.2em" color="text.secondary" sx={{ mb: 3 }}>
                {spr.courte_description}
            </Typography>

            <SPRPhotos images={spr.images} commune={nom} />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: 6 }}>
                <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Description
                    </Typography>
                    <Typography fontSize="1.1rem" sx={{ hyphens: "auto" }} lang="fr">
                        {spr.longue_description}
                    </Typography>
                    <MotsCles motCle={spr.mot_cle} taille="medium" />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip icon={<ScheduleIcon />} label={`Visite de ${formaterDuree(heures(spr.temps_de_visite))}`} />
                        <Chip icon={<GroupsIcon />} label={`Jusqu'à ${spr.capacite_de_visite} visiteurs par créneau`} />
                        <Chip
                            icon={<AccessibleIcon />}
                            label={spr.is_pmr ? "Adapté aux personnes à mobilité réduite" : "Non adapté aux personnes à mobilité réduite"}
                            color={spr.is_pmr ? "primary" : "default"}
                            variant={spr.is_pmr ? "filled" : "outlined"}
                        />
                    </Box>
                </Box>
                <Box sx={{ flex: 2 }}>
                    <SPRMap commune={nom} />
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
