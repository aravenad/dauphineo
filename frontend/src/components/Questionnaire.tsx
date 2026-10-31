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
import api, { messageErreur, type Cadre, type Duree, type Preferences, type Recommandations, type Spr, type Theme } from "../api";
import { ecartDuree, formaterDuree, heures, libelleMotCle, nomMotCle } from "../utils/format";
import CardSPR from "./CardSPR";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom";
import { useLangue, useTextes } from "../i18n";

const TEXTES = {
    fr: {
        cadres: { ville: "🏙️ En ville", village: "🏘️ Dans un village", montagne: "⛰️ En montagne", indifferent: "Peu importe" } as Record<Cadre, string>,
        durees: { court: "Moins de 2 h", moyen: "2 à 3 h", long: "Plus de 3 h" } as Record<Duree, string>,
        questions: [
            "Combien serez-vous ?",
            "Quels thèmes vous attirent ?",
            "Dans quel cadre aimeriez-vous visiter ?",
            "Combien de temps souhaitez-vous consacrer à la visite ?",
            "Avez-vous besoin d'un site accessible aux personnes à mobilité réduite ?",
        ],
        visite: (duree: string, ideale: boolean) => `Visite de ${duree}${ideale ? ", comme vous le souhaitez." : "."}`,
        pmr: "Accessible aux personnes à mobilité réduite.",
        satisfaites: "Vos réponses satisfaites",
        claude: "Raisons rédigées par Claude Haiku",
        classes: "Classés selon vos réponses",
        position: (premier: number, dernier: number, total: number) => `${premier}${dernier > premier ? ` à ${dernier}` : ""} sur ${total}`,
        precedents: "Résultats précédents",
        suivants: "Résultats suivants",
        echec: "Les recommandations n'ont pas pu être calculées.",
        taille: "Taille du groupe",
        plusieurs: "Plusieurs choix possibles. Moins vous en cochez, plus les résultats sont ciblés.",
        oui: "Oui",
        non: "Non",
        recommandations: "Nos recommandations",
        trouver: "Trouver le site qui vous correspond",
        aucun: "Aucun site ne correspond à ces critères. Essayez d'en assouplir quelques-uns.",
        question: (n: number, total: number) => `Question ${n} sur ${total}`,
        recommencer: "Recommencer",
        fermer: "Fermer",
        precedent: "← Précédent",
        recherche: "Recherche…",
        voir: "Voir mes recommandations",
        suivant: "Suivant →",
    },
    en: {
        cadres: { ville: "🏙️ In a town", village: "🏘️ In a village", montagne: "⛰️ In the mountains", indifferent: "No preference" } as Record<Cadre, string>,
        durees: { court: "Under 2 h", moyen: "2 to 3 h", long: "Over 3 h" } as Record<Duree, string>,
        questions: [
            "How many of you will there be?",
            "Which themes interest you?",
            "Where would you like to visit?",
            "How much time would you like to spend on the visit?",
            "Do you need a site accessible to people with reduced mobility?",
        ],
        visite: (duree: string, ideale: boolean) => `A ${duree} visit${ideale ? ", as you wished." : "."}`,
        pmr: "Accessible to people with reduced mobility.",
        satisfaites: "Answers this site matches",
        claude: "Reasons written by Claude Haiku",
        classes: "Ranked by your answers",
        position: (premier: number, dernier: number, total: number) => `${premier}${dernier > premier ? ` to ${dernier}` : ""} of ${total}`,
        precedents: "Previous results",
        suivants: "Next results",
        echec: "The recommendations could not be calculated.",
        taille: "Group size",
        plusieurs: "You can pick several. The fewer you tick, the more targeted the results.",
        oui: "Yes",
        non: "No",
        recommandations: "Our recommendations",
        trouver: "Find the site that suits you",
        aucun: "No site matches these criteria. Try relaxing a few of them.",
        question: (n: number, total: number) => `Question ${n} of ${total}`,
        recommencer: "Start over",
        fermer: "Close",
        precedent: "← Back",
        recherche: "Searching…",
        voir: "See my recommendations",
        suivant: "Next →",
    },
};

type TextesQuestionnaire = (typeof TEXTES)["fr"];

const THEMES: Theme[] = ["antiquite", "medieval", "chateau", "religieux", "architecture", "musee", "nature"];
const CADRES: Cadre[] = ["ville", "village", "montagne", "indifferent"];
const DUREES: Duree[] = ["court", "moyen", "long"];
const NB_QUESTIONS = 5;

const PREFERENCES_INITIALES: Preferences = { taille_groupe: 2, interets: [], cadre: "indifferent", duree: "moyen", pmr: false };

function basculer<T>(liste: T[], valeur: T): T[] {
    return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];
}

/** Espace entre deux résultats, en pixels ; la piste a une marge intérieure de moitié pour laisser déborder le survol des cartes. */
const ECART = 24;

/** Raison du moteur local, quand Claude n'en a pas rédigé : la durée de visite et l'accessibilité. */
function raisonLocale(preferences: Preferences, spr: Spr, t: TextesQuestionnaire): string {
    const ideale = ecartDuree(preferences.duree, spr.temps_de_visite) === 0;
    const raisons = [t.visite(formaterDuree(heures(spr.temps_de_visite)), ideale)];
    if (preferences.pmr) {
        raisons.push(t.pmr);
    }
    return raisons.join(" ");
}

type ResultatProps = Recommandations["recommandations"][number] & { preferences: Preferences; onOuvrir: () => void };

function Resultat({ spr, raison, criteres, preferences, onOuvrir }: ResultatProps) {
    const t = useTextes(TEXTES);
    return (
        <Box sx={{ scrollSnapAlign: "start", minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box onClick={onOuvrir}>
                <CardSPR spr={spr} />
            </Box>
            {criteres.length > 0 && (
                <Box component="ul" aria-label={t.satisfaites} sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {criteres.map((critere) => (
                        <Chip
                            key={critere}
                            component="li"
                            size="small"
                            icon={<CheckIcon />}
                            label={nomMotCle(critere)}
                            sx={{ backgroundColor: "primary.light", color: "primary.dark", "& .MuiChip-icon": { color: "primary.main" } }}
                        />
                    ))}
                </Box>
            )}
            <Typography variant="body2" sx={{ px: 0.5, color: "text.primary", opacity: 0.8 }}>
                {raison ?? raisonLocale(preferences, spr, t)}
            </Typography>
        </Box>
    );
}

/** Résultats en piste horizontale : trois par vue sur ordinateur, deux sur tablette, un sur mobile, avec flèches et balayage. */
function CarrouselResultats({ resultat, preferences, onOuvrir }: { resultat: Recommandations; preferences: Preferences; onOuvrir: () => void }) {
    const piste = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ premier: 0, parVue: 1, debut: true, fin: true });
    const t = useTextes(TEXTES);
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
                    label={resultat.source === "claude" ? t.claude : t.classes}
                    color={resultat.source === "claude" ? "primary" : "default"}
                    variant="outlined"
                />
                {defilable && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="body2" aria-live="polite" sx={{ mr: 0.5, whiteSpace: "nowrap" }}>
                            {t.position(position.premier + 1, dernier, total)}
                        </Typography>
                        <IconButton onClick={() => defiler(-1)} disabled={position.debut} aria-label={t.precedents} sx={{ border: 1, borderColor: "grey.300" }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => defiler(1)} disabled={position.fin} aria-label={t.suivants} sx={{ border: 1, borderColor: "grey.300" }}>
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
                    <Resultat key={recommandation.spr.id} {...recommandation} preferences={preferences} onOuvrir={onOuvrir} />
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

/** Cinq questions, puis jusqu'à six sites classés par le moteur local ; Claude Haiku en rédige les raisons s'il est configuré. */
function Questionnaire({ open, onClose }: QuestionnaireProps) {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [etape, setEtape] = useState(0);
    const [preferences, setPreferences] = useState<Preferences>(PREFERENCES_INITIALES);
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [resultat, setResultat] = useState<Recommandations | null>(null);
    const { langue } = useLangue();
    const t = useTextes(TEXTES);

    const modifier = (modification: Partial<Preferences>) => setPreferences((p) => ({ ...p, ...modification }));
    const derniere = etape === NB_QUESTIONS - 1;
    const repondue = etape !== 1 || preferences.interets.length > 0;

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
            setResultat(await api.recommander({ ...preferences, langue }));
        } catch (e) {
            setErreur(messageErreur(e, t.echec));
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
                            aria-label={t.taille}
                        />
                    </Box>
                );
            case 1:
                return (
                    <>
                        <Options options={THEMES.map((theme) => [theme, libelleMotCle(theme)])} choisis={preferences.interets} onChoix={(v) => modifier({ interets: basculer(preferences.interets, v) })} />
                        <Typography variant="body2" sx={{ textAlign: "center", mt: 2, opacity: 0.8 }}>
                            {t.plusieurs}
                        </Typography>
                    </>
                );
            case 2:
                return <Options options={CADRES.map((cadre) => [cadre, t.cadres[cadre]])} choisis={[preferences.cadre]} onChoix={(v) => modifier({ cadre: v })} />;
            case 3:
                return <Options options={DUREES.map((duree) => [duree, t.durees[duree]])} choisis={[preferences.duree]} onChoix={(v) => modifier({ duree: v })} />;
            default:
                return (
                    <Options
                        options={[[true, t.oui], [false, t.non]]}
                        choisis={[preferences.pmr]}
                        onChoix={(v) => modifier({ pmr: v })}
                    />
                );
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
            slotProps={{ paper: { sx: { height: { sm: "min(700px, calc(100dvh - 64px))" }, borderRadius: { sm: "1.5em" } } } }}
        >
            <DialogTitle id="titre-questionnaire" sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
                {resultat ? t.recommandations : t.trouver}
            </DialogTitle>

            {resultat ? (
                <DialogContent sx={{ pt: "8px !important" }}>
                    {resultat.recommandations.length === 0 ? (
                        <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
                            <Typography sx={{ textAlign: "center" }}>{t.aucun}</Typography>
                        </Box>
                    ) : (
                        <CarrouselResultats resultat={resultat} preferences={preferences} onOuvrir={fermer} />
                    )}
                </DialogContent>
            ) : (
                <DialogContent sx={{ display: "flex", flexDirection: "column", pt: "8px !important" }}>
                    <Typography variant="body2" sx={{ textAlign: "center", mb: 1 }}>
                        {t.question(etape + 1, NB_QUESTIONS)}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={((etape + 1) / NB_QUESTIONS) * 100}
                        aria-hidden
                        sx={{ borderRadius: 1, height: 6, maxWidth: 480, width: "100%", mx: "auto" }}
                    />
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 4, maxWidth: 640, width: "100%", mx: "auto" }}>
                        <Typography variant="h6" component="p" aria-live="polite" sx={{ textAlign: "center", mb: 4, fontSize: { xs: "1.15rem", sm: "1.35rem" } }}>
                            {t.questions[etape]}
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
                            {t.recommencer}
                        </ButtonCustom>
                        <ButtonCustom variant="contained" onClick={fermer}>
                            {t.fermer}
                        </ButtonCustom>
                    </>
                ) : (
                    <>
                        <ButtonCustom variant="outlined" onClick={() => (etape === 0 ? fermer() : setEtape(etape - 1))}>
                            {etape === 0 ? t.fermer : t.precedent}
                        </ButtonCustom>
                        <ButtonCustom
                            variant="contained"
                            disabled={!repondue || envoi}
                            onClick={() => (derniere ? void envoyer() : setEtape(etape + 1))}
                            startIcon={envoi ? <CircularProgress size={16} color="inherit" /> : undefined}
                        >
                            {derniere ? (envoi ? t.recherche : t.voir) : t.suivant}
                        </ButtonCustom>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default Questionnaire;
