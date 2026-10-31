import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { Alert, Box, Card, CardContent, Link, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import api, { messageErreur, type Reservation } from "../api";
import { useApi, useTitre } from "../hooks";
import { useSession } from "../session";
import { formaterDate, formaterHeure, formaterPrix, nomCommune } from "../utils/format";
import Profil from "../components/Profil";
import Confidentialite from "../components/Confidentialite";
import Confirmation from "../components/Confirmation";
import { ButtonCustom } from "../components/mui_custom";
import { apparition } from "../animations";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: {
        titre: "Mon compte",
        echecAnnulation: "La réservation n'a pas pu être annulée.",
        rien: "Vous n'avez encore rien réservé.",
        explorez: "Explorez les sites",
        prochaine: "pour choisir votre prochaine visite.",
        horaire: (date: string, debut: string, fin: string) => `${date}, de ${debut} à ${fin}`,
        detail: (n: number, prix: string, guide: string) => `${n} personne${n > 1 ? "s" : ""} · ${prix} · avec ${guide}`,
        annuler: "Annuler",
        passee: "Visite passée",
        titreAnnulation: "Annuler cette visite ?",
        confirmer: "Annuler la visite",
        garder: "Garder ma réservation",
        votreVisite: "Votre visite de",
        annulee: (date: string, debut: string, fin: string) => ` du ${date}, de ${debut} à ${fin}, sera annulée et le créneau libéré pour d'autres visiteurs.`,
        connectez: "Connectez-vous pour retrouver vos réservations et gérer votre compte.",
        connexion: "Se connecter",
        onglets: { reservations: "Réservations", profil: "Profil", confidentialite: "Confidentialité" },
    },
    en: {
        titre: "My account",
        echecAnnulation: "The booking could not be cancelled.",
        rien: "You have not booked anything yet.",
        explorez: "Explore the sites",
        prochaine: "to choose your next visit.",
        horaire: (date: string, debut: string, fin: string) => `${date}, from ${debut} to ${fin}`,
        detail: (n: number, prix: string, guide: string) => `${n} ${n > 1 ? "people" : "person"} · ${prix} · with ${guide}`,
        annuler: "Cancel",
        passee: "Past visit",
        titreAnnulation: "Cancel this visit?",
        confirmer: "Cancel the visit",
        garder: "Keep my booking",
        votreVisite: "Your visit to",
        annulee: (date: string, debut: string, fin: string) => ` on ${date}, from ${debut} to ${fin}, will be cancelled and the slot released for other visitors.`,
        connectez: "Log in to see your bookings and manage your account.",
        connexion: "Log in",
        onglets: { reservations: "Bookings", profil: "Profile", confidentialite: "Privacy" },
    },
};

function aVenir(reservation: Reservation): boolean {
    return reservation.date_visite.slice(0, 10) >= new Date().toLocaleDateString("sv-SE");
}

function MesReservations() {
    const { donnees, erreur, chargement, recharger } = useApi(() => api.mesReservations(), []);
    const [aAnnuler, setAAnnuler] = useState<Reservation | null>(null);
    const [enCours, setEnCours] = useState(false);
    const [erreurAnnulation, setErreurAnnulation] = useState("");
    const t = useTextes(TEXTES);

    const demander = (reservation: Reservation) => {
        setErreurAnnulation("");
        setAAnnuler(reservation);
    };

    const annuler = async () => {
        if (!aAnnuler) return;
        setEnCours(true);
        setErreurAnnulation("");
        try {
            await api.annulerReservation(aAnnuler.id);
            setAAnnuler(null);
            recharger();
        } catch (e) {
            setErreurAnnulation(messageErreur(e, t.echecAnnulation));
        } finally {
            setEnCours(false);
        }
    };

    if (chargement && !donnees) {
        return <Skeleton variant="rounded" height={160} />;
    }
    if (erreur) {
        return <Alert severity="error">{erreur}</Alert>;
    }

    const reservations = [...(donnees ?? [])].sort((a, b) => (a.date_visite + a.heure_debut).localeCompare(b.date_visite + b.heure_debut));

    if (reservations.length === 0) {
        return (
            <Typography>
                {t.rien} <Link component={RouterLink} to="/explorer">{t.explorez}</Link> {t.prochaine}
            </Typography>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reservations.map((reservation) => (
                <Card key={reservation.id} variant="outlined" sx={{ borderRadius: "1em", opacity: aVenir(reservation) ? 1 : 0.6 }}>
                    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Link component={RouterLink} to={`/spr/${reservation.spr.id}`} variant="h6" underline="hover" sx={{ fontWeight: 700 }}>
                                {nomCommune(reservation.spr.nom_commune)}
                            </Link>
                            <Typography>
                                {t.horaire(formaterDate(reservation.date_visite), formaterHeure(reservation.heure_debut), formaterHeure(reservation.heure_fin))}
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                                {t.detail(reservation.taille, formaterPrix(reservation.prix), `${reservation.guide.prenom} ${reservation.guide.nom}`)}
                            </Typography>
                        </Box>
                        {aVenir(reservation) ? (
                            <ButtonCustom variant="outlined" color="error" onClick={() => demander(reservation)}>
                                {t.annuler}
                            </ButtonCustom>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>{t.passee}</Typography>
                        )}
                    </CardContent>
                </Card>
            ))}

            <Confirmation
                open={aAnnuler !== null}
                titre={t.titreAnnulation}
                confirmer={t.confirmer}
                retour={t.garder}
                enCours={enCours}
                erreur={erreurAnnulation}
                onConfirmer={() => void annuler()}
                onFermer={() => setAAnnuler(null)}
            >
                {aAnnuler && (
                    <>
                        {t.votreVisite} <strong>{nomCommune(aAnnuler.spr.nom_commune)}</strong>
                        {t.annulee(formaterDate(aAnnuler.date_visite), formaterHeure(aAnnuler.heure_debut), formaterHeure(aAnnuler.heure_fin))}
                    </>
                )}
            </Confirmation>
        </Box>
    );
}

const ONGLETS = [
    { valeur: "reservations", icone: <EventIcon /> },
    { valeur: "profil", icone: <AccountCircleIcon /> },
    { valeur: "confidentialite", icone: <ShieldIcon /> },
] as const;

type Onglet = (typeof ONGLETS)[number]["valeur"];

function MonCompte() {
    const t = useTextes(TEXTES);
    useTitre(t.titre);
    const { utilisateur, verification, ouvrirConnexion } = useSession();
    const [onglet, setOnglet] = useState<Onglet>("reservations");

    if (verification) {
        return <Skeleton variant="rounded" height={400} sx={{ maxWidth: 900, mx: "auto" }} />;
    }

    if (!utilisateur) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    {t.titre}
                </Typography>
                <Typography gutterBottom>{t.connectez}</Typography>
                <ButtonCustom variant="contained" onClick={ouvrirConnexion} sx={{ mt: 2 }}>
                    {t.connexion}
                </ButtonCustom>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                {t.titre}
            </Typography>
            <Paper variant="outlined" sx={{ borderRadius: "1em", overflow: "hidden" }}>
                <Tabs value={onglet} onChange={(_, valeur: Onglet) => setOnglet(valeur)} variant="scrollable" allowScrollButtonsMobile sx={{ borderBottom: 1, borderColor: "divider" }}>
                    {ONGLETS.map(({ valeur, icone }) => (
                        <Tab key={valeur} value={valeur} label={t.onglets[valeur]} icon={icone} iconPosition="start" id={`onglet-${valeur}`} aria-controls={`panneau-${valeur}`} sx={{ textTransform: "none", minHeight: 56 }} />
                    ))}
                </Tabs>
                <Box key={onglet} role="tabpanel" id={`panneau-${onglet}`} aria-labelledby={`onglet-${onglet}`} sx={{ p: { xs: 2, md: 4 }, ...apparition }}>
                    {onglet === "reservations" && <MesReservations />}
                    {onglet === "profil" && <Profil key={utilisateur.id} utilisateur={utilisateur} />}
                    {onglet === "confidentialite" && <Confidentialite />}
                </Box>
            </Paper>
        </Box>
    );
}

export default MonCompte;
