import { useState } from "react";
import { Link as RouterLink } from "react-router";
import { Alert, Box, Chip, Paper, Skeleton, Slider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import api, { messageErreur, type Visite } from "../api";
import { PRIX_PAR_PERSONNE } from "../demo/constantes";
import { useApi } from "../hooks";
import { useSession } from "../session";
import { formaterDate, formaterHeure, formaterPrix } from "../utils/format";
import { ButtonCustom } from "./mui_custom";

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
                texte: `Réservation confirmée pour ${reservation.taille} personne${reservation.taille > 1 ? "s" : ""}, ${formaterDate(reservation.date_visite)} à ${formaterHeure(reservation.heure_debut)}.`,
            });
            setIdVisite(null);
        } catch (e) {
            setMessage({ type: "error", texte: messageErreur(e, "La réservation n'a pas pu être enregistrée.") });
        } finally {
            setEnvoi(false);
            // Les places restantes ont changé, qu'il y ait eu réservation ou conflit
            recharger();
        }
    };

    return (
        <Paper component="section" aria-labelledby="titre-reservation" variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: "1em" }}>
            <Typography id="titre-reservation" variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Réserver une visite guidée
            </Typography>
            <Typography color="text.secondary" gutterBottom>
                {formaterPrix(PRIX_PAR_PERSONNE)} par personne, avec un guide du site.
            </Typography>

            {erreur && <Alert severity="error">{erreur}</Alert>}
            {message && (
                <Alert severity={message.type} sx={{ my: 2 }} role="status">
                    {message.texte}
                    {message.type === "success" && (
                        <>
                            {" "}
                            Retrouvez-la dans <RouterLink to="/mon-compte">votre compte</RouterLink>.
                        </>
                    )}
                </Alert>
            )}

            {chargement && !donnees ? (
                <Skeleton variant="rounded" height={160} />
            ) : jours.size === 0 ? (
                !erreur && <Typography>Aucune visite n'est ouverte à la réservation pour le moment.</Typography>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <Box>
                        <Typography component="h3" fontWeight={500} gutterBottom>
                            Date
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }} role="group" aria-label="Choisir une date">
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
                        <Typography component="h3" fontWeight={500} gutterBottom>
                            Créneau{jour && ` du ${formaterDate(jour)}`}
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={visite?.id ?? null}
                            onChange={(_, valeur: number | null) => setIdVisite(valeur)}
                            aria-label="Choisir un créneau"
                            sx={{ flexWrap: "wrap", gap: 1, "& .MuiToggleButtonGroup-grouped": { border: 1, borderColor: "divider", borderRadius: "1em !important" } }}
                        >
                            {creneaux.map((v) => (
                                <ToggleButton key={v.id} value={v.id} sx={{ textTransform: "none", flexDirection: "column", alignItems: "flex-start", px: 2 }}>
                                    <span>
                                        {formaterHeure(v.heure_debut)} à {formaterHeure(v.heure_fin)}
                                    </span>
                                    <Typography variant="caption" color="text.secondary">
                                        {v.capacite_actuelle} place{v.capacite_actuelle > 1 ? "s" : ""} · {v.guide_prenom} {v.guide_nom}
                                    </Typography>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    <Box>
                        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                            <Typography id="titre-personnes" component="h3" fontWeight={500}>
                                Nombre de personnes
                            </Typography>
                            <Typography fontWeight={700} color="primary">
                                {personnes} personne{personnes > 1 ? "s" : ""}
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
                                getAriaValueText={(valeur) => `${valeur} personne${valeur > 1 ? "s" : ""}`}
                                aria-labelledby="titre-personnes"
                            />
                        </Box>
                        {visite && (
                            <Typography variant="caption" color="text.secondary">
                                {visite.capacite_actuelle} place{visite.capacite_actuelle > 1 ? "s" : ""} restante{visite.capacite_actuelle > 1 ? "s" : ""} sur ce créneau
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
                        <Typography fontWeight={700} fontSize="1.2em">
                            Total : {formaterPrix(personnes * PRIX_PAR_PERSONNE)}
                        </Typography>
                        <ButtonCustom
                            variant="contained"
                            size="large"
                            onClick={() => void reserver()}
                            disabled={envoi || (utilisateur !== null && !visite)}
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                            {utilisateur ? (envoi ? "Réservation…" : "Réserver") : "Se connecter pour réserver"}
                        </ButtonCustom>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

export default ReservationSection;
