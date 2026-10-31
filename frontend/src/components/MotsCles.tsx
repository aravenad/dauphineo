import { Box, Chip } from "@mui/material";
import { libelleMotCle, motsCles } from "../utils/format";
import { useTextes } from "../i18n";

interface MotsClesProps {
    motCle: string;
    taille?: "small" | "medium";
}

function MotsCles({ motCle, taille = "small" }: MotsClesProps) {
    const t = useTextes({ fr: { themes: "Thèmes" }, en: { themes: "Themes" } });
    return (
        <Box component="ul" aria-label={t.themes} sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", p: 0, m: 0 }}>
            {motsCles(motCle).map((mot) => (
                <li key={mot}>
                    <Chip label={libelleMotCle(mot)} size={taille} variant="outlined" sx={{ backgroundColor: "grey.50" }} />
                </li>
            ))}
        </Box>
    );
}

export default MotsCles;
