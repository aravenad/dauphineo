import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import {useNavigate} from "react-router";


interface SearchBarCustomProps {
    placeholder?: string;
    sprList: any[];
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

const normalizeString = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/-/g, " ")
        .toLowerCase();
};

const capitalizeWords = (str: string) => {
    return str
        .toLowerCase()
        .split(/(\s|-|')/)
        .map((word) => (word === "-" || word === "'" ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");
};

const findMatchingSPR = (input: string, sprList: any[]) => {
    if (input.trim().length < 1) return []; // Minimum 3 caractères pour la recherche

    const normalizedInput = normalizeString(input);

    const matchingSPR = sprList.filter(
        (spr) =>
            spr.nom_commune &&
            normalizeString(spr.nom_commune).includes(normalizedInput)
    );

    return matchingSPR.slice(0, 3);
};

const emojiMap: Record<string, string> = {
    archeologie: '🏺',
    architecture: '🏛️',
    nature: '🌳',
    abbaye: '⛪',
    chateau: '🏰',
    medieval: '🛡️',
    musee: '🖼️',
    promenade: '🚶',
    urbain: '🏙️',
};

const formatKeywords = (keywords: string) => {
    return keywords
        .split(' ')
        .map(keyword => {
            const emoji = emojiMap[keyword] || '❓';
            const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            return `${emoji} ${capitalizedKeyword}`;
        })
        .join(', ');
}


const SearchBarCustom: React.FC<SearchBarCustomProps> = ({ placeholder = "Rechercher...", sprList }) => {
    const [query, setQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        const matchingSPR = findMatchingSPR(value, sprList);
        setFilteredResults(matchingSPR);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && filteredResults.length > 0) {
            const firstResult = filteredResults[0];
            navigate(`/spr`, { state: { jsonSPR: JSON.stringify([firstResult]) } });
        }
    };

    const handleResultClick = (id: number) => {
        const filteredSPR = sprList.filter((spr) => spr.id === id);
        const jsonSPR = JSON.stringify(filteredSPR);
        navigate(`/spr`, { state: { jsonSPR } });
    };


    return (
        <Box
            sx={{
                position: "relative",
                width: "500px",
                maxWidth: "100%",
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
                    onKeyDown={handleKeyDown}
                    inputProps={{ "aria-label": "search" }}
                />
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
                                transition: "transform 0.2s ease, background-color 0.2s ease",
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
                            <Typography variant="body1" sx={{ fontWeight: 500, fontSize : "1.15em"}}>
                                {capitalizeWords(result.nom_commune)}&nbsp;&middot;&nbsp;
                            </Typography>
                            <Typography variant={"body2"} sx={{ color: "dimgray", display: "flex", alignItems: "center", fontSize: "1em"}}>
                                {formatKeywords(result.mot_cle)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SearchBarCustom;