import { lazy, Suspense, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router";
import { Box, IconButton, Link, Tooltip, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { Spr } from "../api";
import { attributsImage } from "../utils/images";
import { mouvementReduit } from "../animations";
import { nomCommune } from "../utils/format";
import SearchBarCustom from "./mui_custom/SearchBarCustom";

// Le questionnaire n'est téléchargé qu'au survol ou au focus du bouton qui l'ouvre
const chargerQuestionnaire = () => import("./Questionnaire");
const Questionnaire = lazy(chargerQuestionnaire);

const DUREE_DIAPO = 6000;

function SearchSection({ sprList }: { sprList: Spr[] }) {
    const [questionnaire, setQuestionnaire] = useState(false);
    // Reste monté après la fermeture pour garder l'animation de sortie et les réponses
    const [questionnaireOuvert, setQuestionnaireOuvert] = useState(false);
    const [courante, setCourante] = useState(0);
    // Sans animation souhaitée, le défilé démarre en pause ; le bouton permet toujours de l'arrêter
    const [enPause, setEnPause] = useState(mouvementReduit);
    // Seules les photos déjà affichées et la suivante sont téléchargées
    const [chargees, setChargees] = useState(() => new Set([0, 1]));

    const diapos = sprList.filter((spr) => spr.images.length > 0).map((spr) => ({ spr, image: spr.images[0] }));
    const total = diapos.length;
    const active = diapos[courante];

    useEffect(() => {
        if (enPause || total < 2) return;
        const minuteur = window.setInterval(() => setCourante((index) => (index + 1) % total), DUREE_DIAPO);
        return () => window.clearInterval(minuteur);
    }, [enPause, total]);

    useEffect(() => {
        if (total === 0) return;
        const suivante = (courante + 1) % total;
        setChargees((avant) => (avant.has(suivante) ? avant : new Set([...avant, suivante])));
    }, [courante, total]);

    return (
        <Box
            component="section"
            aria-label="Rechercher un site"
            sx={{
                position: "relative",
                width: "100%",
                minHeight: { xs: "60vh", md: "65vh" },
                borderRadius: "1em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 2, md: 3 },
                px: { xs: 2, md: 4 },
                py: 10,
                backgroundColor: "primary.dark",
            }}
        >
            {/* Le défilé a son propre calque : la liste de suggestions peut ainsi déborder du bandeau */}
            <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit" }}>
                {diapos.map(({ image }, index) =>
                    chargees.has(index) ? (
                        <Box
                            key={image.id}
                            component="img"
                            {...attributsImage(image.image_url, "100vw", [500, 960, 1280])}
                            alt=""
                            sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: index === courante ? 1 : 0,
                                transform: index === courante && !enPause ? "scale(1.06)" : "scale(1)",
                                transition: "opacity 1.2s ease, transform 7s ease-out",
                                "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none" },
                            }}
                        />
                    ) : null,
                )}
                {/* Voile sombre aux couleurs du thème : le titre et la recherche restent lisibles sur toutes les photos */}
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(22, 37, 33, 0.6) 0%, rgba(22, 37, 33, 0.5) 50%, rgba(22, 37, 33, 0.75) 100%)" }} />
            </Box>

            <Box sx={{ position: "relative", textAlign: "center", color: "common.white", textShadow: "0 2px 12px rgba(0, 0, 0, 0.35)" }}>
                <Typography variant="h2" component="h1" fontWeight={800} sx={{ fontSize: { xs: "2rem", sm: "2.6rem", md: "3.75rem" }, hyphens: "manual" }}>
                    Que souhaitez-vous visiter ?
                </Typography>
                <Typography fontSize={{ xs: "1.05em", md: "1.3em" }}>Accédez aux sites patrimoniaux remarquables de l'Isère et réservez votre guide</Typography>
            </Box>

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1.5, width: "100%", maxWidth: 720 }}>
                <SearchBarCustom placeholder="Des endroits à visiter en Isère" sprList={sprList} />
                <Tooltip title="Trouver un site avec le questionnaire">
                    <IconButton
                        onClick={() => {
                            setQuestionnaireOuvert(true);
                            setQuestionnaire(true);
                        }}
                        onPointerEnter={() => void chargerQuestionnaire()}
                        onFocus={() => void chargerQuestionnaire()}
                        aria-label="Ouvrir le questionnaire de recommandation"
                        sx={{
                            flex: "0 0 auto",
                            width: 64,
                            height: 64,
                            color: "primary.main",
                            backgroundColor: "common.white",
                            boxShadow: "0 8px 24px rgba(22, 37, 33, 0.25)",
                            "&:hover": { backgroundColor: "primary.light" },
                        }}
                    >
                        <AutoAwesomeIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {active && (
                <Box
                    sx={{
                        position: "absolute",
                        left: { xs: 12, md: 20 },
                        right: { xs: 12, md: 20 },
                        bottom: { xs: 12, md: 16 },
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: 2,
                        color: "common.white",
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Link component={RouterLink} to={`/spr/${active.spr.id}`} color="inherit" underline="hover" fontWeight={700} fontSize="1.05rem">
                            {nomCommune(active.spr.nom_commune)}
                        </Link>
                        {active.image.auteur && (
                            <Typography variant="caption" component="p" sx={{ opacity: 0.9 }}>
                                Photo : {active.image.auteur}
                                {active.image.licence && `, ${active.image.licence}`}
                            </Typography>
                        )}
                    </Box>
                    {total > 1 && (
                        <IconButton
                            onClick={() => setEnPause((pause) => !pause)}
                            aria-label={enPause ? "Reprendre le défilement des photos" : "Mettre en pause le défilement des photos"}
                            size="small"
                            sx={{ color: "common.white", backgroundColor: "rgba(22, 37, 33, 0.5)", "&:hover": { backgroundColor: "rgba(22, 37, 33, 0.75)" } }}
                        >
                            {enPause ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
                        </IconButton>
                    )}
                </Box>
            )}

            {questionnaireOuvert && (
                <Suspense>
                    <Questionnaire open={questionnaire} onClose={() => setQuestionnaire(false)} />
                </Suspense>
            )}
        </Box>
    );
}

export default SearchSection;
