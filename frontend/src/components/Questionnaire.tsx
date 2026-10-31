import { useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Slider,
    Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import api, { messageErreur, type Duree, type Experience, type Interet, type Preferences, type Recommandations } from "../api";
import CardSPR from "./CardSPR";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom";

const INTERETS: [Interet, string][] = [
    ["archeologie", "🏺 Archéologie"],
    ["architecture", "🏛️ Architecture"],
    ["medieval", "🛡️ Médiéval"],
    ["nature", "🌳 Nature"],
    ["religion", "⛪ Religion"],
    ["villages", "🏘️ Villages"],
    ["jardins", "🌱 Jardins"],
];

const DUREES: [Duree, string][] = [
    ["court", "Moins de 2 h"],
    ["moyen", "2 à 3 h"],
    ["long", "Plus de 3 h"],
];

const EXPERIENCES: [Experience, string][] = [
    ["balade", "🚶 Balade"],
    ["decouverte", "🎨 Découverte"],
    ["visite_guidee", "📚 Visite guidée"],
    ["exploration", "🧭 Exploration"],
    ["immersion", "🏘️ Immersion"],
];

const QUESTIONS = [
    "Combien serez-vous ?",
    "Quels thèmes vous attirent le plus ?",
    "Combien de temps souhaitez-vous consacrer à la visite ?",
    "Avez-vous besoin d'un site accessible aux personnes à mobilité réduite ?",
    "Quel type d'expérience recherchez-vous ?",
];

const PREFERENCES_INITIALES: Preferences = { taille_groupe: 2, interets: [], duree: "moyen", pmr: false, experiences: [] };

function basculer<T>(liste: T[], valeur: T): T[] {
    return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];
}

function Options<T extends string | boolean>({ options, choisis, onChoix }: { options: [T, string][]; choisis: T[]; onChoix: (valeur: T) => void }) {
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
            {options.map(([valeur, libelle]) => (
                <ToggleButtonCustom
                    key={String(valeur)}
                    className={choisis.includes(valeur) ? "selected" : ""}
                    aria-pressed={choisis.includes(valeur)}
                    onClick={() => onChoix(valeur)}
                >
                    {libelle}
                </ToggleButtonCustom>
            ))}
        </Box>
    );
}

interface QuestionnaireProps {
    open: boolean;
    onClose: () => void;
}

/** Cinq questions, puis trois sites recommandés par Claude Haiku ou par le moteur local. */
function Questionnaire({ open, onClose }: QuestionnaireProps) {
    const [etape, setEtape] = useState(0);
    const [preferences, setPreferences] = useState<Preferences>(PREFERENCES_INITIALES);
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [resultat, setResultat] = useState<Recommandations | null>(null);

    const modifier = (modification: Partial<Preferences>) => setPreferences((p) => ({ ...p, ...modification }));
    const derniere = etape === QUESTIONS.length - 1;
    const repondue = etape === 1 ? preferences.interets.length > 0 : etape === 4 ? preferences.experiences.length > 0 : true;

    const fermer = () => {
        onClose();
        // Le questionnaire repart de zéro à la prochaine ouverture, une fois l'animation de fermeture finie
        setTimeout(() => {
            setEtape(0);
            setPreferences(PREFERENCES_INITIALES);
            setResultat(null);
            setErreur("");
        }, 300);
    };

    const envoyer = async () => {
        setEnvoi(true);
        setErreur("");
        try {
            setResultat(await api.recommander(preferences));
        } catch (e) {
            setErreur(messageErreur(e, "Les recommandations n'ont pas pu être calculées."));
        } finally {
            setEnvoi(false);
        }
    };

    const contenu = () => {
        switch (etape) {
            case 0:
                return (
                    <Box sx={{ px: 3, pt: 4 }}>
                        <Slider
                            value={preferences.taille_groupe}
                            onChange={(_, valeur) => modifier({ taille_groupe: valeur as number })}
                            min={1}
                            max={20}
                            marks={[{ value: 1, label: "1" }, { value: 10, label: "10" }, { value: 20, label: "20" }]}
                            valueLabelDisplay="on"
                            aria-label="Taille du groupe"
                        />
                    </Box>
                );
            case 1:
                return <Options options={INTERETS} choisis={preferences.interets} onChoix={(v) => modifier({ interets: basculer(preferences.interets, v) })} />;
            case 2:
                return <Options options={DUREES} choisis={[preferences.duree]} onChoix={(v) => modifier({ duree: v })} />;
            case 3:
                return (
                    <Options
                        options={[[true, "Oui"], [false, "Non"]]}
                        choisis={[preferences.pmr]}
                        onChoix={(v) => modifier({ pmr: v })}
                    />
                );
            default:
                return <Options options={EXPERIENCES} choisis={preferences.experiences} onChoix={(v) => modifier({ experiences: basculer(preferences.experiences, v) })} />;
        }
    };

    return (
        <Dialog open={open} onClose={fermer} fullWidth maxWidth={resultat ? "md" : "sm"} aria-labelledby="titre-questionnaire">
            <DialogTitle id="titre-questionnaire" sx={{ textAlign: "center", fontWeight: "bold" }}>
                {resultat ? "Nos recommandations" : "Trouver le site qui vous correspond"}
            </DialogTitle>

            {resultat ? (
                <DialogContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Chip
                            icon={resultat.source === "claude" ? <AutoAwesomeIcon /> : undefined}
                            label={resultat.source === "claude" ? "Proposé par Claude Haiku" : "Proposé par le moteur local"}
                            color={resultat.source === "claude" ? "primary" : "default"}
                            variant="outlined"
                        />
                    </Box>
                    {resultat.recommandations.length === 0 ? (
                        <Typography textAlign="center">Aucun site ne correspond à ces critères. Essayez d'en assouplir quelques-uns.</Typography>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
                            {resultat.recommandations.map(({ spr, raison }) => (
                                <Box key={spr.id} onClick={fermer}>
                                    <CardSPR spr={spr} />
                                    <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
                                        {raison}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
            ) : (
                <DialogContent>
                    <LinearProgress
                        variant="determinate"
                        value={((etape + 1) / QUESTIONS.length) * 100}
                        aria-label={`Question ${etape + 1} sur ${QUESTIONS.length}`}
                        sx={{ borderRadius: 1, mb: 3 }}
                    />
                    <Typography variant="h6" component="p" textAlign="center" sx={{ mb: 3 }} aria-live="polite">
                        {QUESTIONS[etape]}
                    </Typography>
                    {contenu()}
                    {erreur && <Alert severity="error" sx={{ mt: 3 }}>{erreur}</Alert>}
                </DialogContent>
            )}

            <DialogActions sx={{ justifyContent: "space-between", p: 3, pt: 1 }}>
                {resultat ? (
                    <>
                        <ButtonCustom variant="outlined" onClick={() => { setResultat(null); setEtape(0); }}>
                            Recommencer
                        </ButtonCustom>
                        <ButtonCustom variant="contained" onClick={fermer}>
                            Fermer
                        </ButtonCustom>
                    </>
                ) : (
                    <>
                        <ButtonCustom variant="outlined" onClick={() => (etape === 0 ? fermer() : setEtape(etape - 1))}>
                            {etape === 0 ? "Fermer" : "← Précédent"}
                        </ButtonCustom>
                        <ButtonCustom
                            variant="contained"
                            disabled={!repondue || envoi}
                            onClick={() => (derniere ? void envoyer() : setEtape(etape + 1))}
                            startIcon={envoi ? <CircularProgress size={16} color="inherit" /> : undefined}
                        >
                            {derniere ? (envoi ? "Recherche…" : "Voir mes recommandations") : "Suivant →"}
                        </ButtonCustom>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default Questionnaire;
