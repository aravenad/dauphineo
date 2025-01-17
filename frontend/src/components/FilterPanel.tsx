import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Divider, Slider } from "@mui/material";
import { ButtonCustom } from "./mui_custom";
import ToggleButtonCustom from "./mui_custom/ToggleButtonCustom";

// Slider marks pour le temps de visite (1h à 5h, par crans de 30 min)
const sliderMarks = [
    { value: 1, label: "1h" },
    { value: 2, label: "2h" },
    { value: 3, label: "3h" },
    { value: 4, label: "4h" },
    { value: 5, label: "5h" },
];

// Map pour associer les émojis aux mots-clés
const emojiMap: Record<string, string> = {
    archeologie: "🏺",
    architecture: "🏛️",
    nature: "🌳",
    abbaye: "⛪",
    chateau: "🏰",
    medieval: "🛡️",
    musee: "🖼️",
    promenade: "🚶",
    urbain: "🏙️",
};

const keywords = Object.keys(emojiMap);

type FilterPanelProps = {
    onClose: () => void;
    onApply: (filters: {
        keywords: string[];
        maxVisitTime: number;
        isAccessible: boolean;
    }) => void;
    filters: {
        keywords: string[];
        maxVisitTime: number;
        isAccessible: boolean;
    }; // Filtres actuels
    setIsFiltered: (value: boolean) => void; // Fonction pour mettre à jour isFiltered
};

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, onApply, filters, setIsFiltered }) => {
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>(filters.keywords);
    const [maxVisitTime, setMaxVisitTime] = useState<number>(filters.maxVisitTime);
    const [isAccessible, setIsAccessible] = useState<boolean>(filters.isAccessible);
    const [isClosing, setIsClosing] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedKeywords(filters.keywords);
        setMaxVisitTime(filters.maxVisitTime);
        setIsAccessible(filters.isAccessible);
    }, [filters]);

    const toggleKeyword = (keyword: string) => {
        const updatedKeywords = selectedKeywords.includes(keyword)
            ? selectedKeywords.filter((k) => k !== keyword)
            : [...selectedKeywords, keyword];

        setSelectedKeywords(updatedKeywords);
        setIsFiltered(true);
        onApply({
            keywords: updatedKeywords,
            maxVisitTime,
            isAccessible,
        });
    };

    const handleSliderChange = (value: number) => {
        setMaxVisitTime(value);
        setIsFiltered(value < 5);
        onApply({
            keywords: selectedKeywords,
            maxVisitTime: value,
            isAccessible,
        });
    };

    const handleToggleAccessibility = () => {
        const updatedAccessibility = !isAccessible;
        setIsAccessible(updatedAccessibility);
        setIsFiltered(true);
        onApply({
            keywords: selectedKeywords,
            maxVisitTime,
            isAccessible: updatedAccessibility,
        });
    };

    const handleResetFilters = () => {
        setSelectedKeywords([]);
        setMaxVisitTime(5);
        setIsAccessible(false);
        setIsFiltered(false);
        onApply({
            keywords: [],
            maxVisitTime: 5,
            isAccessible: false,
        });
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            handleClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Box
            ref={panelRef}
            sx={{
                width: "100%",
                maxWidth: 375,
                padding: "1.5em",
                backgroundColor: "white",
                borderRadius: "1em",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.35)",
                position: "absolute",
                top: "20px",
                right: "70px",
                zIndex: 10000,
                animation: isClosing ? "fadeOut 0.2s ease-in-out" : "fadeIn 0.2s ease-in-out",
                "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "@keyframes fadeOut": {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
            }}
        >
            <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Mots-clés
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                    }}
                >
                    {keywords.map((keyword) => (
                        <ToggleButtonCustom
                            key={keyword}
                            className={selectedKeywords.includes(keyword) ? "selected" : ""}
                            onClick={() => toggleKeyword(keyword)}
                        >
                            {emojiMap[keyword]} {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                        </ToggleButtonCustom>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ margin: "1.5em 0" }} />

            <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Temps de visite (max)
                </Typography>
                <Slider
                    value={maxVisitTime}
                    onChange={(e, value) => handleSliderChange(value as number)}
                    step={0.5}
                    min={1}
                    max={5}
                    marks={sliderMarks}
                    valueLabelDisplay="on"
                />
            </Box>

            <Divider sx={{ margin: "1.5em 0" }} />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ToggleButtonCustom
                    className={isAccessible ? "selected" : ""}
                    onClick={handleToggleAccessibility}
                >
                    ♿️ Accessibilité PMR
                </ToggleButtonCustom>
            </Box>

            <Box sx={{ marginTop: "2em", display: "flex" }}>
                <ButtonCustom
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    onClick={handleResetFilters}
                >
                    ⃠ Réinitialiser
                </ButtonCustom>
            </Box>
        </Box>
    );
};

export default FilterPanel;