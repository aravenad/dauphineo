import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Slider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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

/** Espace entre deux résultats, en pixels ; la piste a une marge intérieure de moitié pour laisser déborder le survol des cartes. */
const ECART = 24;

function capitaliser(texte: string): string {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
}

function Resultat({ spr, raison, criteres, onOuvrir }: Recommandations["recommandations"][number] & { onOuvrir: () => void }) {
    return (
        <Box sx={{ scrollSnapAlign: "start", minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box onClick={onOuvrir}>
                <CardSPR spr={spr} />
            </Box>
            {criteres.length > 0 && (
                <Box component="ul" aria-label="Vos réponses satisfaites" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {criteres.map((critere) => (
                        <Chip
                            key={critere}
                            component="li"
                            size="small"
                            icon={<CheckIcon />}
                            label={capitaliser(critere)}
                            sx={{ backgroundColor: "primary.light", color: "primary.dark", "& .MuiChip-icon": { color: "primary.main" } }}
                        />
                    ))}
                </Box>
            )}
            <Typography variant="body2" sx={{ px: 0.5, color: "text.primary", opacity: 0.8 }}>
                {raison}
            </Typography>
        </Box>
    );
}

/** Résultats en piste horizontale : trois par vue sur ordinateur, deux sur tablette, un sur mobile, avec flèches et balayage. */
function CarrouselResultats({ resultat, onOuvrir }: { resultat: Recommandations; onOuvrir: () => void }) {
    const piste = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ premier: 0, parVue: 1, debut: true, fin: true });
    const total = resultat.recommandations.length;

    const mesurer = useCallback(() => {
        const element = piste.current;
        const carte = element?.firstElementChild as HTMLElement | null;
        if (!element || !carte) return;
        const pas = carte.offsetWidth + ECART;
        setPosition({
            premier: Math.round(element.scrollLeft / pas),
            parVue: Math.max(1, Math.round(element.clientWidth / pas)),
            debut: element.scrollLeft <= 1,
            fin: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
        });
    }, []);

    useEffect(() => {
        mesurer();
        window.addEventListener("resize", mesurer);
        return () => window.removeEventListener("resize", mesurer);
    }, [mesurer, resultat]);

    const defiler = (sens: 1 | -1) => {
        const element = piste.current;
        if (!element) return;
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        element.scrollBy({ left: sens * element.clientWidth, behavior: reduit ? "auto" : "smooth" });
    };

    const dernier = Math.min(position.premier + position.parVue, total);
    const defilable = !(position.debut && position.fin);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Chip
                    icon={resultat.source === "claude" ? <AutoAwesomeIcon /> : undefined}
                    label={resultat.source === "claude" ? "Proposé par Claude Haiku" : "Proposé par le moteur local"}
                    color={resultat.source === "claude" ? "primary" : "default"}
                    variant="outlined"
                />
                {defilable && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="body2" aria-live="polite" sx={{ mr: 0.5, whiteSpace: "nowrap" }}>
                            {position.premier + 1}
                            {dernier > position.premier + 1 && ` à ${dernier}`} sur {total}
                        </Typography>
                        <IconButton onClick={() => defiler(-1)} disabled={position.debut} aria-label="Résultats précédents" sx={{ border: 1, borderColor: "grey.300" }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => defiler(1)} disabled={position.fin} aria-label="Résultats suivants" sx={{ border: 1, borderColor: "grey.300" }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
            <Box
                ref={piste}
                onScroll={mesurer}
                sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridAutoColumns: {
                        xs: "100%",
                        sm: `calc((100% - ${ECART}px) / 2)`,
                        md: `calc((100% - ${2 * ECART}px) / 3)`,
                    },
                    gap: `${ECART}px`,
                    alignItems: "start",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollPaddingInline: `${ECART / 2}px`,
                    px: `${ECART / 2}px`,
                    pt: 1.5,
                    pb: 1,
                    mx: `-${ECART / 2}px`,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {resultat.recommandations.map((recommandation) => (
                    <Resultat key={recommandation.spr.id} {...recommandation} onOuvrir={onOuvrir} />
                ))}
            </Box>
        </Box>
    );
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

/** Cinq questions, puis trois sites choisis par Claude Haiku ou jusqu'à six classés par le moteur local. */
function Questionnaire({ open, onClose }: QuestionnaireProps) {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        <Dialog
            open={open}
            onClose={fermer}
            fullWidth
            fullScreen={mobile}
            maxWidth="md"
            aria-labelledby="titre-questionnaire"
            // Même fenêtre à chaque étape : celle des résultats
            PaperProps={{ sx: { height: { sm: "min(700px, calc(100dvh - 64px))" }, borderRadius: { sm: "1.5em" } } }}
        >
            <DialogTitle id="titre-questionnaire" sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
                {resultat ? "Nos recommandations" : "Trouver le site qui vous correspond"}
            </DialogTitle>

            {resultat ? (
                <DialogContent sx={{ pt: "8px !important" }}>
                    {resultat.recommandations.length === 0 ? (
                        <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
                            <Typography textAlign="center">Aucun site ne correspond à ces critères. Essayez d'en assouplir quelques-uns.</Typography>
                        </Box>
                    ) : (
                        <CarrouselResultats resultat={resultat} onOuvrir={fermer} />
                    )}
                </DialogContent>
            ) : (
                <DialogContent sx={{ display: "flex", flexDirection: "column", pt: "8px !important" }}>
                    <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
                        Question {etape + 1} sur {QUESTIONS.length}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={((etape + 1) / QUESTIONS.length) * 100}
                        aria-hidden
                        sx={{ borderRadius: 1, height: 6, maxWidth: 480, width: "100%", mx: "auto" }}
                    />
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 4, maxWidth: 640, width: "100%", mx: "auto" }}>
                        <Typography variant="h6" component="p" textAlign="center" sx={{ mb: 4, fontSize: { xs: "1.15rem", sm: "1.35rem" } }} aria-live="polite">
                            {QUESTIONS[etape]}
                        </Typography>
                        {contenu()}
                        {erreur && <Alert severity="error" sx={{ mt: 3 }}>{erreur}</Alert>}
                    </Box>
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
