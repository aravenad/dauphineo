import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { Alert, Box, Chip, Paper, Skeleton, Slider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import api, { messageErreur, type Visite } from "../api";
import { PRIX_PAR_PERSONNE } from "../demo/constantes";
import { useApi } from "../hooks";
import { useSession } from "../session";
import { formaterDate, formaterHeure, formaterPrix } from "../utils/format";
import { ButtonCustom } from "./mui_custom";
import { useTextes } from "../i18n";

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;

const TEXTES = {
    fr: {
        confirmee: (taille: number, date: string, heure: string) => `Réservation confirmée pour ${pluriel(taille, "personne")}, ${date} à ${heure}.`,
        echec: "La réservation n'a pas pu être enregistrée.",
        titre: "Réserver une visite guidée",
        prix: (prix: string) => `${prix} par personne, avec un guide du site.`,
        retrouvez: "Retrouvez-la dans",
        votreCompte: "votre compte",
        aucune: "Aucune visite n'est ouverte à la réservation pour le moment.",
        date: "Date",
        choisirDate: "Choisir une date",
        creneau: (jour: string | null) => (jour ? `Créneau du ${jour}` : "Créneau"),
        choisirCreneau: "Choisir un créneau",
        horaire: (debut: string, fin: string) => `${debut} à ${fin}`,
        places: (n: number) => pluriel(n, "place"),
        nombre: "Nombre de personnes",
        personnes: (n: number) => pluriel(n, "personne"),
        restantes: (n: number) => `${pluriel(n, "place")} restante${n > 1 ? "s" : ""} sur ce créneau`,
        total: (prix: string) => `Total : ${prix}`,
        envoi: "Réservation…",
        reserver: "Réserver",
        connexion: "Se connecter pour réserver",
    },
    en: {
        confirmee: (taille: number, date: string, heure: string) => `Booking confirmed for ${taille} ${taille > 1 ? "people" : "person"}, ${date} at ${heure}.`,
        echec: "The booking could not be saved.",
        titre: "Book a guided tour",
        prix: (prix: string) => `${prix} per person, with a site guide.`,
        retrouvez: "Find it in",
        votreCompte: "your account",
        aucune: "No tours are open for booking at the moment.",
        date: "Date",
        choisirDate: "Choose a date",
        creneau: (jour: string | null) => (jour ? `Time slots on ${jour}` : "Time slot"),
        choisirCreneau: "Choose a time slot",
        horaire: (debut: string, fin: string) => `${debut} to ${fin}`,
        places: (n: number) => pluriel(n, "place"),
        nombre: "Number of people",
        personnes: (n: number) => `${n} ${n > 1 ? "people" : "person"}`,
        restantes: (n: number) => `${pluriel(n, "place")} left in this time slot`,
        total: (prix: string) => `Total: ${prix}`,
        envoi: "Booking…",
        reserver: "Book",
        connexion: "Log in to book",
    },
};

interface ReservationSectionProps {
    sprId: number;
}

const TAILLE_MAX = 50;

function parJour(visites: Visite[]): Map<string, Visite[]> {
    const jours = new Map<string, Visite[]>();
    for (const visite of [...visites].sort((a, b) => (a.date_visite + a.heure_debut).localeCompare(b.date_visite + b.heure_debut))) {
        const jour = visite.date_visite.slice(0, 10);
        jours.set(jour, [...(jours.get(jour) ?? []), visite]);
    }
    return jours;
}

function ReservationSection({ sprId }: ReservationSectionProps) {
    const { utilisateur, ouvrirConnexion } = useSession();
    const { donnees, erreur, chargement, recharger } = useApi(() => api.visitesSpr(sprId), [sprId]);
    const [jourChoisi, setJourChoisi] = useState<string | null>(null);
    const [idVisite, setIdVisite] = useState<number | null>(null);
    const [taille, setTaille] = useState(2);
    const [envoi, setEnvoi] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; texte: string } | null>(null);
    const t = useTextes(TEXTES);

    const jours = parJour((donnees ?? []).filter((v) => v.capacite_actuelle > 0));
    const jour = jourChoisi && jours.has(jourChoisi) ? jourChoisi : (jours.keys().next().value ?? null);
    const creneaux = jour ? (jours.get(jour) ?? []) : [];
    const visite = creneaux.find((v) => v.id === idVisite) ?? null;
    const tailleMax = Math.min(TAILLE_MAX, visite?.capacite_actuelle ?? TAILLE_MAX);
    // Le curseur reste dans les places disponibles quand on change de créneau
    const personnes = Math.min(taille, tailleMax);

    const reserver = async () => {
        if (!utilisateur) {
            ouvrirConnexion();
            return;
        }
        if (!visite) return;
        setEnvoi(true);
        setMessage(null);
        try {
            const reservation = await api.reserver(visite.id, personnes);
            setMessage({
                type: "success",
                texte: t.confirmee(reservation.taille, formaterDate(reservation.date_visite), formaterHeure(reservation.heure_debut)),
            });
            setIdVisite(null);
        } catch (e) {
            setMessage({ type: "error", texte: messageErreur(e, t.echec) });
        } finally {
            setEnvoi(false);
            // Les places restantes ont changé, qu'il y ait eu réservation ou conflit
            recharger();
        }
    };

    return (
        <Paper component="section" aria-labelledby="titre-reservation" variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: "1em" }}>
            <Typography id="titre-reservation" variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                {t.titre}
            </Typography>
            <Typography gutterBottom sx={{ color: "text.secondary" }}>
                {t.prix(formaterPrix(PRIX_PAR_PERSONNE))}
            </Typography>

            {erreur && <Alert severity="error">{erreur}</Alert>}
            {message && (
                <Alert severity={message.type} sx={{ my: 2 }} role="status">
                    {message.texte}
                    {message.type === "success" && (
                        <>
                            {" "}
                            {t.retrouvez} <RouterLink to="/mon-compte">{t.votreCompte}</RouterLink>.
                        </>
                    )}
                </Alert>
            )}

            {chargement && !donnees ? (
                <Skeleton variant="rounded" height={160} />
            ) : jours.size === 0 ? (
                !erreur && <Typography>{t.aucune}</Typography>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <Box>
                        <Typography component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                            {t.date}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }} role="group" aria-label={t.choisirDate}>
                            {[...jours.keys()].map((j) => (
                                <Chip
                                    key={j}
                                    label={formaterDate(j, { weekday: "short", day: "numeric", month: "short" })}
                                    color={j === jour ? "primary" : "default"}
                                    variant={j === jour ? "filled" : "outlined"}
                                    aria-pressed={j === jour}
                                    onClick={() => {
                                        setJourChoisi(j);
                                        setIdVisite(null);
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <Typography component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                            {t.creneau(jour && formaterDate(jour))}
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={visite?.id ?? null}
                            onChange={(_, valeur: number | null) => setIdVisite(valeur)}
                            aria-label={t.choisirCreneau}
                            sx={{ flexWrap: "wrap", gap: 1, "& .MuiToggleButtonGroup-grouped": { border: 1, borderColor: "divider", borderRadius: "1em !important" } }}
                        >
                            {creneaux.map((v) => (
                                <ToggleButton key={v.id} value={v.id} sx={{ textTransform: "none", flexDirection: "column", alignItems: "flex-start", px: 2 }}>
                                    <span>
                                        {t.horaire(formaterHeure(v.heure_debut), formaterHeure(v.heure_fin))}
                                    </span>
                                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                        {t.places(v.capacite_actuelle)} · {v.guide_prenom} {v.guide_nom}
                                    </Typography>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <Box>
                        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                            <Typography id="titre-personnes" component="h3" sx={{ fontWeight: 500 }}>
                                {t.nombre}
                            </Typography>
                            <Typography color="primary" sx={{ fontWeight: 700 }}>
                                {t.personnes(personnes)}
                            </Typography>
                        </Box>
                        <Box sx={{ px: 1.5, maxWidth: 520 }}>
                            <Slider
                                value={personnes}
                                onChange={(_, valeur) => setTaille(valeur as number)}
                                min={1}
                                max={tailleMax}
                                marks={[
                                    { value: 1, label: "1" },
                                    { value: tailleMax, label: String(tailleMax) },
                                ]}
                                valueLabelDisplay="auto"
                                getAriaValueText={t.personnes}
                                aria-labelledby="titre-personnes"
                            />
                        </Box>
                        {visite && (
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {t.restantes(visite.capacite_actuelle)}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            pt: 2,
                            borderTop: 1,
                            borderColor: "grey.300",
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: "1.2em" }}>
                            {t.total(formaterPrix(personnes * PRIX_PAR_PERSONNE))}
                        </Typography>
                        <ButtonCustom
                            variant="contained"
                            size="large"
                            onClick={() => void reserver()}
                            disabled={envoi || (utilisateur !== null && !visite)}
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            {utilisateur ? (envoi ? t.envoi : t.reserver) : t.connexion}
                        </ButtonCustom>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

export default ReservationSection;
