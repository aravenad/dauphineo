import { Link as RouterLink } from "react-router";
import { Alert, Skeleton } from "@mui/material";
import api from "../api";
import { useApi, useTitre } from "../hooks";
import SearchSection from "../components/SearchSection";
import ExploreSection from "../components/ExploreSection";
import CardSPR from "../components/CardSPR";
import { trier, type Tri } from "../components/filtres";
import { ButtonCustom } from "../components/mui_custom";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: {
        mieuxNotes: "Les mieux notés",
        mieuxNotesSous: "Les sites préférés des visiteurs",
        plusReserves: "Différentes façons de visiter le Dauphiné",
        plusReservesSous: "Les sites les plus réservés",
        explorez: "Explorez",
        explorezSous: "Découvrez tous les sites patrimoniaux",
        voir: (n: number | string) => `Voir les ${n} sites`,
        voirPlus: "Voir plus",
        voirPlusNotes: "Voir plus de sites, classés par note",
        voirPlusReserves: "Voir plus de sites, classés par réservations",
    },
    en: {
        mieuxNotes: "Top rated",
        mieuxNotesSous: "Visitors' favourite sites",
        plusReserves: "Different ways to visit the Dauphiné",
        plusReservesSous: "The most booked sites",
        explorez: "Explore",
        explorezSous: "Discover every heritage site",
        voir: (n: number | string) => `See all ${n} sites`,
        voirPlus: "See more",
        voirPlusNotes: "See more sites, sorted by rating",
        voirPlusReserves: "See more sites, sorted by bookings",
    },
};

const PAR_SECTION = 4;

function Squelettes() {
    return Array.from({ length: PAR_SECTION }, (_, i) => <Skeleton key={i} variant="rounded" sx={{ aspectRatio: "1", height: "auto", borderRadius: "1em" }} />);
}

/** Renvoie vers l'explorateur déjà trié ; le libellé accessible dit sur quoi. */
function VoirPlus({ tri, libelle }: { tri: Tri; libelle: string }) {
    const t = useTextes(TEXTES);
    return (
        <ButtonCustom variant="outlined" size="large" component={RouterLink} to={`/explorer?tri=${tri}`} aria-label={libelle}>
            {t.voirPlus}
        </ButtonCustom>
    );
}

function Home() {
    useTitre();
    const t = useTextes(TEXTES);
    const liste = useApi(() => api.listSpr(), []);
    const sprs = liste.donnees ?? [];

    // Le même tri que l'explorateur : « Voir plus » y reprend la liste là où l'accueil s'arrête
    const mieuxNotes = trier(sprs, "note").filter((spr) => spr.note_moyenne !== null).slice(0, PAR_SECTION);
    const plusReserves = trier(sprs, "reservations").filter((spr) => spr.reservations > 0).slice(0, PAR_SECTION);
    const decouvrir = trier(sprs, "nom").slice(0, PAR_SECTION);

    return (
        <>
            <SearchSection sprList={liste.donnees ?? []} />

            {liste.erreur && (
                <Alert severity="error" sx={{ mt: 4 }}>
                    {liste.erreur}
                </Alert>
            )}

            {(liste.donnees ? mieuxNotes.length > 0 : !liste.erreur) && (
                <ExploreSection titre={t.mieuxNotes} sousTitre={t.mieuxNotesSous} action={<VoirPlus tri="note" libelle={t.voirPlusNotes} />}>
                    {liste.donnees ? mieuxNotes.map((spr) => <CardSPR key={spr.id} spr={spr} variante="rated" noteMoyenne={spr.note_moyenne ?? undefined} />) : <Squelettes />}
                </ExploreSection>
            )}

            {(liste.donnees ? plusReserves.length > 0 : !liste.erreur) && (
                <ExploreSection titre={t.plusReserves} sousTitre={t.plusReservesSous} action={<VoirPlus tri="reservations" libelle={t.voirPlusReserves} />}>
                    {liste.donnees ? plusReserves.map((spr) => <CardSPR key={spr.id} spr={spr} variante="booked" reservations={spr.reservations} />) : <Squelettes />}
                </ExploreSection>
            )}

            {!liste.erreur && (
                <ExploreSection
                    titre={t.explorez}
                    sousTitre={t.explorezSous}
                    action={
                        <ButtonCustom variant="outlined" size="large" component={RouterLink} to="/explorer">
                            {t.voir(liste.donnees?.length ?? "")}
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
