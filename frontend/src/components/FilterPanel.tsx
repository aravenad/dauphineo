import { Box, Divider, Drawer, FormControlLabel, IconButton, Slider, Switch, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MOTS_CLES, libelleMotCle } from "../utils/format";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom";
import { DUREE_MAX, FILTRES_VIDES, type Filtres } from "./filtres";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: {
        filtres: "Filtres",
        fermer: "Fermer les filtres",
        commune: "Commune",
        themes: "Thèmes",
        duree: "Durée de visite maximale",
        plus: "5 h et +",
        pmr: "Accessible aux personnes à mobilité réduite",
        reinitialiser: "Réinitialiser",
        voir: (n: number) => `Voir ${n} site${n > 1 ? "s" : ""}`,
    },
    en: {
        filtres: "Filters",
        fermer: "Close the filters",
        commune: "Town",
        themes: "Themes",
        duree: "Maximum tour length",
        plus: "5 h +",
        pmr: "Accessible to people with reduced mobility",
        reinitialiser: "Reset",
        voir: (n: number) => `See ${n} site${n === 1 ? "" : "s"}`,
    },
};


interface FilterPanelProps {
    open: boolean;
    filtres: Filtres;
    resultats: number;
    onChange: (filtres: Filtres) => void;
    onClose: () => void;
}

function FilterPanel({ open, filtres, resultats, onChange, onClose }: FilterPanelProps) {
    const t = useTextes(TEXTES);
    const reperes = [1, 2, 3, 4, 5].map((h) => ({ value: h, label: h === DUREE_MAX ? t.plus : `${h} h` }));
    const modifier = (modification: Partial<Filtres>) => onChange({ ...filtres, ...modification });

    return (
        <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 380 }, p: 3, borderRadius: { sm: "1.5em 0 0 1.5em" } } } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    {t.filtres}
                </Typography>
                <IconButton onClick={onClose} aria-label={t.fermer}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <TextField
                label={t.commune}
                value={filtres.recherche}
                onChange={(e) => modifier({ recherche: e.target.value })}
                fullWidth
            />

            <Divider sx={{ my: 3 }} />

            <Typography component="h3" variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                {t.themes}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {MOTS_CLES.map((mot) => {
                    const actif = filtres.motsCles.includes(mot);
                    return (
                        <ToggleButtonCustom
                            key={mot}
                            className={actif ? "selected" : ""}
                            aria-pressed={actif}
                            onClick={() => modifier({ motsCles: actif ? filtres.motsCles.filter((m) => m !== mot) : [...filtres.motsCles, mot] })}
                        >
                            {libelleMotCle(mot)}
                        </ToggleButtonCustom>
                    );
                })}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography id="titre-duree" component="h3" variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                {t.duree}
            </Typography>
            <Box sx={{ px: 2 }}>
                <Slider
                    value={filtres.dureeMax}
                    onChange={(_, valeur) => modifier({ dureeMax: valeur as number })}
                    step={0.5}
                    min={1}
                    max={DUREE_MAX}
                    marks={reperes}
                    aria-labelledby="titre-duree"
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            <FormControlLabel
                control={<Switch checked={filtres.pmr} onChange={(e) => modifier({ pmr: e.target.checked })} />}
                label={t.pmr}
            />

            <Box sx={{ mt: "auto", pt: 3, display: "flex", gap: 1 }}>
                <ButtonCustom variant="outlined" fullWidth onClick={() => onChange(FILTRES_VIDES)}>
                    {t.reinitialiser}
                </ButtonCustom>
                <ButtonCustom variant="contained" fullWidth onClick={onClose}>
                    {t.voir(resultats)}
                </ButtonCustom>
            </Box>
        </Drawer>
    );
}

export default FilterPanel;
