import type { ReactNode } from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { Alert, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useLangue, useTextes } from "../i18n";

const TEXTES = {
    fr: {
        surtitre: "Informations légales",
        nav: "Pages légales",
        pages: { "/mentions-legales": "Mentions légales", "/reglementation": "Confidentialité", "/cgu": "CGU" },
    },
    en: {
        surtitre: "Legal information",
        nav: "Legal pages",
        pages: { "/mentions-legales": "Legal notice", "/reglementation": "Privacy", "/cgu": "Terms of use" },
    },
};

const PAGES_LEGALES = ["/mentions-legales", "/reglementation", "/cgu"] as const;

type Ton = "primary" | "error";

const COULEURS: Record<Ton, { fond: string; texte: string }> = {
    primary: { fond: "primary.light", texte: "primary.main" },
    error: { fond: "#FDECEA", texte: "error.main" },
};

function Pastille({ icone, ton = "primary", taille = 40 }: { icone: ReactNode; ton?: Ton; taille?: number }) {
    return (
        <Box
            aria-hidden
            sx={{
                flex: "0 0 auto",
                width: taille,
                height: taille,
                borderRadius: "0.75em",
                display: "grid",
                placeItems: "center",
                backgroundColor: COULEURS[ton].fond,
                color: COULEURS[ton].texte,
            }}
        >
            {icone}
        </Box>
    );
}

/** Mise en page commune aux mentions légales, à la politique de confidentialité et aux CGU */
export function PageLegale({ titre, intro, children }: { titre: string; intro: ReactNode; children: ReactNode }) {
    const { pathname } = useLocation();
    const { langue } = useLangue();
    const t = useTextes(TEXTES);
    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 0, sm: 2 }, py: { xs: 2, md: 4 } }}>
            <Box component="header" sx={{ mb: { xs: 4, md: 6 } }}>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                    {t.surtitre}
                </Typography>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.75rem" }, mb: 1.5 }}>
                    {titre}
                </Typography>
                <Typography sx={{ maxWidth: 720, fontSize: "1.05rem", lineHeight: 1.7 }}>{intro}</Typography>
                <Stack component="nav" aria-label={t.nav} direction="row" sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}>
                    {PAGES_LEGALES.map((chemin) => {
                        const courante = pathname.endsWith(chemin);
                        return (
                            <Chip
                                key={chemin}
                                component={RouterLink}
                                to={chemin}
                                label={t.pages[chemin]}
                                clickable
                                color="primary"
                                variant={courante ? "filled" : "outlined"}
                                aria-current={courante ? "page" : undefined}
                            />
                        );
                    })}
                </Stack>
            </Box>
            {langue === "en" && (
                <Alert severity="info" sx={{ mb: 4, borderRadius: "1em" }}>
                    This page is only available in French, which is the authoritative version.
                </Alert>
            )}
            {/* Le texte juridique n'existe qu'en français : les lecteurs d'écran le prononcent en français */}
            <Stack spacing={{ xs: 5, md: 6 }} lang="fr">{children}</Stack>
        </Box>
    );
}

export function SectionLegale({ icone, titre, children }: { icone: ReactNode; titre: string; children: ReactNode }) {
    return (
        <Box component="section">
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                <Pastille icone={icone} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    {titre}
                </Typography>
            </Stack>
            <Stack spacing={2} sx={{ "& p": { lineHeight: 1.7 } }}>
                {children}
            </Stack>
        </Box>
    );
}

export function GrilleCartes({ colonnes = 3, children }: { colonnes?: 2 | 3 | 4; children: ReactNode }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: `repeat(${colonnes}, 1fr)` },
                gap: 2,
            }}
        >
            {children}
        </Box>
    );
}

export function CarteInfo({ icone, titre, ton, children }: { icone: ReactNode; titre: string; ton?: Ton; children: ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "1em", borderColor: "grey.300", display: "flex", gap: 2, minWidth: 0 }}>
            <Pastille icone={icone} ton={ton} taille={36} />
            <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                <Typography component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {titre}
                </Typography>
                <Typography component="div" variant="body2" sx={{ lineHeight: 1.6 }}>
                    {children}
                </Typography>
            </Box>
        </Paper>
    );
}
