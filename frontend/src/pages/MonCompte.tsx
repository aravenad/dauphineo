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

function aVenir(reservation: Reservation): boolean {
    return reservation.date_visite.slice(0, 10) >= new Date().toLocaleDateString("sv-SE");
}

function MesReservations() {
    const { donnees, erreur, chargement, recharger } = useApi(() => api.mesReservations(), []);
    const [aAnnuler, setAAnnuler] = useState<Reservation | null>(null);
    const [enCours, setEnCours] = useState(false);
    const [erreurAnnulation, setErreurAnnulation] = useState("");

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
            setErreurAnnulation(messageErreur(e, "La réservation n'a pas pu être annulée."));
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
                Vous n'avez encore rien réservé. <Link component={RouterLink} to="/explorer">Explorez les sites</Link> pour choisir votre prochaine visite.
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
                                {formaterDate(reservation.date_visite)}, de {formaterHeure(reservation.heure_debut)} à {formaterHeure(reservation.heure_fin)}
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                                {reservation.taille} personne{reservation.taille > 1 ? "s" : ""} · {formaterPrix(reservation.prix)} · avec {reservation.guide.prenom} {reservation.guide.nom}
                            </Typography>
                        </Box>
                        {aVenir(reservation) ? (
                            <ButtonCustom variant="outlined" color="error" onClick={() => demander(reservation)}>
                                Annuler
                            </ButtonCustom>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>Visite passée</Typography>
                        )}
                    </CardContent>
                </Card>
            ))}

            <Confirmation
                open={aAnnuler !== null}
                titre="Annuler cette visite ?"
                confirmer="Annuler la visite"
                retour="Garder ma réservation"
                enCours={enCours}
                erreur={erreurAnnulation}
                onConfirmer={() => void annuler()}
                onFermer={() => setAAnnuler(null)}
            >
                {aAnnuler && (
                    <>
                        Votre visite de <strong>{nomCommune(aAnnuler.spr.nom_commune)}</strong> du {formaterDate(aAnnuler.date_visite)}, de{" "}
                        {formaterHeure(aAnnuler.heure_debut)} à {formaterHeure(aAnnuler.heure_fin)}, sera annulée et le créneau libéré pour
                        d'autres visiteurs.
                    </>
                )}
            </Confirmation>
        </Box>
    );
}

const ONGLETS = [
    { valeur: "reservations", libelle: "Réservations", icone: <EventIcon /> },
    { valeur: "profil", libelle: "Profil", icone: <AccountCircleIcon /> },
    { valeur: "confidentialite", libelle: "Confidentialité", icone: <ShieldIcon /> },
] as const;

type Onglet = (typeof ONGLETS)[number]["valeur"];

function MonCompte() {
    useTitre("Mon compte");
    const { utilisateur, verification, ouvrirConnexion } = useSession();
    const [onglet, setOnglet] = useState<Onglet>("reservations");

    if (verification) {
        return <Skeleton variant="rounded" height={400} sx={{ maxWidth: 900, mx: "auto" }} />;
    }

    if (!utilisateur) {
        return (
            <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Mon compte
                </Typography>
                <Typography gutterBottom>Connectez-vous pour retrouver vos réservations et gérer votre compte.</Typography>
                <ButtonCustom variant="contained" onClick={ouvrirConnexion} sx={{ mt: 2 }}>
                    Se connecter
                </ButtonCustom>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                Mon compte
            </Typography>
            <Paper variant="outlined" sx={{ borderRadius: "1em", overflow: "hidden" }}>
                <Tabs value={onglet} onChange={(_, valeur: Onglet) => setOnglet(valeur)} variant="scrollable" allowScrollButtonsMobile sx={{ borderBottom: 1, borderColor: "divider" }}>
                    {ONGLETS.map(({ valeur, libelle, icone }) => (
                        <Tab key={valeur} value={valeur} label={libelle} icon={icone} iconPosition="start" id={`onglet-${valeur}`} aria-controls={`panneau-${valeur}`} sx={{ textTransform: "none", minHeight: 56 }} />
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
