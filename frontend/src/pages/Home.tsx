import { Link as RouterLink } from "react-router";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import api, { type Spr } from "../api";
import { useApi, useTitre } from "../hooks";
import SearchSection from "../components/SearchSection";
import ExploreSection from "../components/ExploreSection";
import CardSPR from "../components/CardSPR";
import { ButtonCustom } from "../components/mui_custom";

const PAR_SECTION = 4;

function Squelettes() {
    return Array.from({ length: PAR_SECTION }, (_, i) => <Skeleton key={i} variant="rounded" sx={{ aspectRatio: "1", height: "auto", borderRadius: "1em" }} />);
}

function Home() {
    useTitre();
    const liste = useApi(() => api.listSpr(), []);
    const top = useApi(() => api.topSpr(), []);
    const parId = new Map<number, Spr>((liste.donnees ?? []).map((spr) => [spr.id, spr]));
    const pret = liste.donnees && top.donnees;

    const mieuxNotes = (top.donnees?.mieux_notes ?? []).filter(({ id }) => parId.has(id)).slice(0, PAR_SECTION);
    const plusReserves = (top.donnees?.plus_reserves ?? []).filter(({ id }) => parId.has(id)).slice(0, PAR_SECTION);
    const decouvrir = [...(liste.donnees ?? [])].sort((a, b) => a.nom_commune.localeCompare(b.nom_commune, "fr")).slice(0, PAR_SECTION);

    return (
        <>
            <Box sx={{ textAlign: "center", mb: "2em" }}>
                <Typography variant="h2" component="h1" fontWeight={800} sx={{ fontSize: { xs: "2.2rem", md: "3.75rem" } }}>
                    Que souhaitez-vous visiter ?
                </Typography>
                <Typography color="text.secondary" fontSize="1.3em">
                    Accédez aux sites patrimoniaux remarquables de l'Isère et réservez votre guide
                </Typography>
            </Box>

            <SearchSection sprList={liste.donnees ?? []} />

            {(liste.erreur || top.erreur) && (
                <Alert severity="error" sx={{ mt: 4 }}>
                    {liste.erreur ?? top.erreur}
                </Alert>
            )}

            {(pret ? mieuxNotes.length > 0 : !top.erreur) && (
                <ExploreSection titre="Les mieux notés" sousTitre="Les sites préférés des visiteurs">
                    {pret ? mieuxNotes.map(({ id, note_moyenne }) => <CardSPR key={id} spr={parId.get(id)!} variante="rated" noteMoyenne={note_moyenne} />) : <Squelettes />}
                </ExploreSection>
            )}

            {(pret ? plusReserves.length > 0 : !top.erreur) && (
                <ExploreSection titre="Différentes façons de visiter l'Isère" sousTitre="Les sites les plus réservés">
                    {pret ? plusReserves.map(({ id, reservations }) => <CardSPR key={id} spr={parId.get(id)!} variante="booked" reservations={reservations} />) : <Squelettes />}
                </ExploreSection>
            )}

            {!liste.erreur && (
                <ExploreSection
                    titre="Explorez"
                    sousTitre="Découvrez tous les sites patrimoniaux"
                    action={
                        <ButtonCustom variant="outlined" size="large" component={RouterLink} to="/explorer">
                            Voir les {liste.donnees?.length ?? ""} sites
                        </ButtonCustom>
                    }
                >
                    {liste.donnees ? decouvrir.map((spr) => <CardSPR key={spr.id} spr={spr} />) : <Squelettes />}
                </ExploreSection>
            )}
        </>
    );
}

export default Home;
