import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { Spr } from "../api";
import SearchBarCustom from "./mui_custom/SearchBarCustom";
import Questionnaire from "./Questionnaire";

function SearchSection({ sprList }: { sprList: Spr[] }) {
    const [questionnaire, setQuestionnaire] = useState(false);

    return (
        <Box
            component="section"
            aria-label="Rechercher un site"
            sx={{
                width: "100%",
                minHeight: { xs: "40vh", md: "50vh" },
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                // Les massifs de l'Isère, dessinés en dégradés aux couleurs du thème
                background: (theme) => `
                    radial-gradient(ellipse 60% 45% at 20% 100%, ${theme.palette.primary.main} 0 99%, transparent 100%),
                    radial-gradient(ellipse 55% 55% at 75% 105%, ${theme.palette.primary.dark} 0 99%, transparent 100%),
                    radial-gradient(circle at 80% 25%, ${theme.palette.info.main}66 0 8%, transparent 9%),
                    linear-gradient(180deg, ${theme.palette.primary.light} 0%, #cfe9e1 100%)`,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", maxWidth: 800 }}>
                <SearchBarCustom placeholder="Des endroits à visiter en Isère" sprList={sprList} />
                <Tooltip title="Trouver un site avec le questionnaire">
                    <IconButton
                        onClick={() => setQuestionnaire(true)}
                        aria-label="Ouvrir le questionnaire de recommandation"
                        sx={{
                            flex: "0 0 auto",
                            width: 56,
                            height: 56,
                            backgroundColor: "common.white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            "&:hover": { backgroundColor: "grey.50" },
                        }}
                    >
                        <AutoAwesomeIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Questionnaire open={questionnaire} onClose={() => setQuestionnaire(false)} />
        </Box>
    );
}

export default SearchSection;
