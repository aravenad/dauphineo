import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";

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
    width: "50%",
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

// Fonction pour normaliser les chaînes (supprimer accents et tirets, insensible à la casse)
const normalizeString = (str: string) => {
    return str
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/-/g, " ") // Remplace les tirets par des espaces
        .toLowerCase(); // Met en minuscule
};

// Fonction pour trouver les 3 SPR correspondants
const findMatchingSPR = (input: string, sprList: any[]) => {
    if (input.trim().length < 3) return []; // Recherche uniquement si au moins 3 caractères

    const normalizedInput = normalizeString(input);

    // Filtrer les SPR valides dont `nom_commune` correspond au critère
    const matchingSPR = sprList.filter(
        (spr) =>
            spr.nom_commune &&
            normalizeString(spr.nom_commune).includes(normalizedInput)
    );

    // Retourner les 3 premiers résultats maximum
    return matchingSPR.slice(0, 3);
};

const SearchBarCustom: React.FC<SearchBarCustomProps> = ({ placeholder = "Rechercher...", sprList }) => {
    const [query, setQuery] = useState(""); // Input de recherche

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        // Trouver les SPR correspondants
        const matchingSPR = findMatchingSPR(value, sprList);
        console.log("Résultats correspondants :", matchingSPR);
    };

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon sx={{ color: "common.black" }} />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={placeholder}
                value={query}
                onChange={handleSearch} // Recherche déclenchée à chaque frappe
                inputProps={{ "aria-label": "search" }}
            />
            {/* Bouton de filtrage */}
            <Box sx={{ marginLeft: "10px" }}>
                <IconButton onClick={() => console.log("Filtrage ouvert")}>
                    <TuneIcon sx={{ color: "gray" }} />
                </IconButton>
            </Box>
        </Search>
    );
};

export default SearchBarCustom;