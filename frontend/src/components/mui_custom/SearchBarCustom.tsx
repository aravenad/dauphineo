import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import {useNavigate} from "react-router";


// Définition des props du composant
interface SearchBarCustomProps {
    placeholder?: string;
    sprList: any[]; // Liste des SPR passée depuis SearchSection
}

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "2em",
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "480px",
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    padding: "5px 15px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.5, 1.5, 1.5, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

// Fonction pour normaliser les chaînes
const normalizeString = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
        .replace(/-/g, " ") // Remplacer les tirets par des espaces
        .toLowerCase();
};

// Fonction pour mettre en majuscule la première lettre de chaque mot
const capitalizeWords = (str: string) => {
    return str
        .toLowerCase()
        .split(/(\s|-|')/)
        .map((word) => (word === "-" || word === "'" ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");
};

// Fonction pour trouver les SPR correspondants
const findMatchingSPR = (input: string, sprList: any[]) => {
    if (input.trim().length < 1) return []; // Minimum 3 caractères pour la recherche

    const normalizedInput = normalizeString(input);

    const matchingSPR = sprList.filter(
        (spr) =>
            spr.nom_commune &&
            normalizeString(spr.nom_commune).includes(normalizedInput)
    );

    return matchingSPR.slice(0, 3); // Retourner maximum 3 résultats
};

// Dans le composant SearchBarCustom
const SearchBarCustom: React.FC<SearchBarCustomProps> = ({ placeholder = "Rechercher...", sprList }) => {
    const [query, setQuery] = useState(""); // Input de recherche
    const [filteredResults, setFilteredResults] = useState<any[]>([]); // Résultats filtrés
    const navigate = useNavigate(); // Hook pour la navigation

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        // Trouver les SPR correspondants
        const matchingSPR = findMatchingSPR(value, sprList);
        setFilteredResults(matchingSPR);
    };

    const handleResultClick = (id: number) => {
        const filteredSPR = sprList.filter(spr => spr.id === id);
        const jsonSPR = JSON.stringify(filteredSPR);
        navigate(`/spr`, { state: {jsonSPR} });
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "500px", // Largeur fixe de la barre de recherche
                maxWidth: "100%", // Adaptable
            }}
        >
            <Search>
                <SearchIconWrapper>
                    <SearchIcon sx={{ color: "common.black" }} />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={placeholder}
                    value={query}
                    onChange={handleSearch}
                    inputProps={{ "aria-label": "search" }}
                />
                <Box sx={{ marginLeft: "10px" }}>
                    <IconButton onClick={() => console.log("Filtrage ouvert")}>
                        <TuneIcon sx={{ color: "gray" }} />
                    </IconButton>
                </Box>
            </Search>

            {filteredResults.length > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "calc(100% + 5px)",
                        width: "100%",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    {filteredResults.map((result) => (
                        <Box
                            key={result.id}
                            onClick={() => handleResultClick(result.id)}
                            sx={{
                                padding: "5px 15px",
                                marginLeft: "0px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                borderRadius: "50px",
                                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                                fontSize: "0.9rem",
                                textAlign: "left",
                                transition : "transform 0.2s ease, background-color 0.2s ease",
                                animation: `${filteredResults.length !== sprList.length ? "fadeIn" : "none"} 0.3s ease`,
                                width: "fit-content",
                                "&:hover": {
                                    backgroundColor: "#f9f9f9",
                                    cursor: "pointer",
                                    transform: "scale(1.05)",
                                    transition: "transform 0.2s ease, background-color 0.2s ease",
                                },
                                "@keyframes fadeIn": {
                                    from: { opacity: 0, transform: "translateY(-10px)" },
                                    to: { opacity: 1, transform: "translateY(0)" },
                                },
                                "@keyframes fadeOut": {
                                    from: { opacity: 1, transform: "translateY(0)" },
                                    to: { opacity: 0, transform: "translateY(-10px)" },
                                },
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {capitalizeWords(result.nom_commune)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SearchBarCustom;