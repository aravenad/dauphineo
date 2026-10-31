import { Box, Divider, Drawer, FormControlLabel, IconButton, Slider, Switch, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MOTS_CLES, libelleMotCle } from "../utils/format";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom";
import { DUREE_MAX, FILTRES_VIDES, type Filtres } from "./filtres";

const REPERES = [1, 2, 3, 4, 5].map((h) => ({ value: h, label: h === DUREE_MAX ? "5 h et +" : `${h} h` }));

interface FilterPanelProps {
    open: boolean;
    filtres: Filtres;
    resultats: number;
    onChange: (filtres: Filtres) => void;
    onClose: () => void;
}

function FilterPanel({ open, filtres, resultats, onChange, onClose }: FilterPanelProps) {
    const modifier = (modification: Partial<Filtres>) => onChange({ ...filtres, ...modification });

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 380 }, p: 3 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2" fontWeight={700}>
                    Filtres
                </Typography>
                <IconButton onClick={onClose} aria-label="Fermer les filtres">
                    <CloseIcon />
                </IconButton>
            </Box>

            <TextField
                label="Commune"
                value={filtres.recherche}
                onChange={(e) => modifier({ recherche: e.target.value })}
                fullWidth
            />

            <Divider sx={{ my: 3 }} />

            <Typography component="h3" variant="h6" fontWeight={700} gutterBottom>
                Thèmes
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

            <Typography id="titre-duree" component="h3" variant="h6" fontWeight={700} gutterBottom>
                Durée de visite maximale
            </Typography>
            <Box sx={{ px: 2 }}>
                <Slider
                    value={filtres.dureeMax}
                    onChange={(_, valeur) => modifier({ dureeMax: valeur as number })}
                    step={0.5}
                    min={1}
                    max={DUREE_MAX}
                    marks={REPERES}
                    aria-labelledby="titre-duree"
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            <FormControlLabel
                control={<Switch checked={filtres.pmr} onChange={(e) => modifier({ pmr: e.target.checked })} />}
                label="Accessible aux personnes à mobilité réduite"
            />

            <Box sx={{ mt: "auto", pt: 3, display: "flex", gap: 1 }}>
                <ButtonCustom variant="outlined" fullWidth onClick={() => onChange(FILTRES_VIDES)}>
                    Réinitialiser
                </ButtonCustom>
                <ButtonCustom variant="contained" fullWidth onClick={onClose}>
                    Voir {resultats} site{resultats > 1 ? "s" : ""}
                </ButtonCustom>
            </Box>
        </Drawer>
    );
}

export default FilterPanel;
