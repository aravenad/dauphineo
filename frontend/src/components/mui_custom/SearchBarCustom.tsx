import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import type { Spr } from "../../api";
import { formaterMotsCles, nomCommune, normaliser } from "../../utils/format";
import { useTextes } from "../../i18n";

interface SearchBarCustomProps {
    placeholder?: string;
    sprList: Spr[];
    isHeader?: boolean;
}

const Search = styled("div", { shouldForwardProp: (prop) => prop !== "isHeader" })<{ isHeader: boolean }>(({ theme, isHeader }) => ({
    position: "relative",
    borderRadius: "2em",
    backgroundColor: theme.palette.common.white,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "5px 15px",
    boxShadow: isHeader ? "0px 2px 6px rgba(0, 0, 0, 0.2)" : "none",
    border: isHeader ? "1px solid #f0f0f0" : "none",
    "&:focus-within": {
        outline: `2px solid ${theme.palette.primary.main}`,
    },
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

function chercher(saisie: string, sprList: Spr[]): Spr[] {
    const recherche = normaliser(saisie.trim());
    if (!recherche) return [];
    return sprList.filter((spr) => normaliser(spr.nom_commune).includes(recherche)).slice(0, 4);
}

/** Recherche de SPR par commune, au clavier comme à la souris (motif combobox). */
function SearchBarCustom({ placeholder, sprList, isHeader = false }: SearchBarCustomProps) {
    const t = useTextes({
        fr: { rechercher: "Rechercher…", resultats: "Résultats de la recherche" },
        en: { rechercher: "Search…", resultats: "Search results" },
    });
    const libelle = placeholder ?? t.rechercher;
    const [saisie, setSaisie] = useState("");
    const [ouvert, setOuvert] = useState(false);
    const [actif, setActif] = useState(-1);
    const [secousse, setSecousse] = useState(false);
    const navigate = useNavigate();
    const conteneur = useRef<HTMLDivElement>(null);
    const idListe = useId();

    const resultats = ouvert ? chercher(saisie, sprList) : [];

    useEffect(() => {
        const clicExterieur = (event: MouseEvent) => {
            if (conteneur.current && !conteneur.current.contains(event.target as Node)) {
                setOuvert(false);
            }
        };
        document.addEventListener("mousedown", clicExterieur);
        return () => document.removeEventListener("mousedown", clicExterieur);
    }, []);

    const choisir = (spr: Spr) => {
        setSaisie("");
        setOuvert(false);
        setActif(-1);
        navigate(`/spr/${spr.id}`);
    };

    const auClavier = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOuvert(true);
            setActif((i) => Math.min(i + 1, resultats.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActif((i) => Math.max(i - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault();
            const choix = resultats[Math.max(actif, 0)];
            if (choix) {
                choisir(choix);
            } else {
                setSecousse(true);
            }
        } else if (event.key === "Escape") {
            setOuvert(false);
            setActif(-1);
        }
    };

    return (
        <Box ref={conteneur} sx={{ position: "relative", width: isHeader ? "500px" : "100%", maxWidth: "100%" }}>
            <Search
                isHeader={isHeader}
                onAnimationEnd={() => setSecousse(false)}
                sx={{
                    // Dans le bandeau d'accueil, la recherche est l'action principale : plus haute et plus lisible
                    ...(!isHeader && { py: 1, fontSize: "1.15rem", boxShadow: "0 8px 24px rgba(22, 37, 33, 0.25)" }),
                    animation: secousse ? "secousse 0.3s ease" : "none",
                    "@keyframes secousse": {
                        "0%, 100%": { transform: "translateX(0)" },
                        "25%, 75%": { transform: "translateX(-5px)" },
                        "50%": { transform: "translateX(5px)" },
                    },
                }}
            >
                <SearchIconWrapper>
                    <SearchIcon sx={{ color: "common.black" }} />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={libelle}
                    value={saisie}
                    onChange={(e) => {
                        setSaisie(e.target.value);
                        setOuvert(true);
                        setActif(-1);
                    }}
                    onKeyDown={auClavier}
                    inputProps={{
                        role: "combobox",
                        "aria-label": libelle,
                        "aria-expanded": resultats.length > 0,
                        "aria-controls": idListe,
                        "aria-autocomplete": "list",
                        "aria-activedescendant": actif >= 0 && resultats[actif] ? `${idListe}-${resultats[actif].id}` : undefined,
                    }}
                />
            </Search>

            <Box
                id={idListe}
                role="listbox"
                aria-label={t.resultats}
                sx={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    width: "100%",
                    zIndex: 10,
                    display: resultats.length ? "flex" : "none",
                    flexDirection: "column",
                    gap: "5px",
                }}
            >
                {resultats.map((spr, index) => (
                    <Box
                        key={spr.id}
                        id={`${idListe}-${spr.id}`}
                        role="option"
                        aria-selected={index === actif}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => choisir(spr)}
                        onMouseEnter={() => setActif(index)}
                        sx={{
                            padding: "5px 15px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: index === actif ? "#f9f9f9" : "#fff",
                            borderRadius: "50px",
                            boxShadow: isHeader ? "0px 4px 12px rgba(0, 0, 0, 0.3)" : "0px 2px 6px rgba(0, 0, 0, 0.1)",
                            transform: index === actif ? "scale(1.05) translateX(10px)" : "none",
                            transition: "transform 0.2s ease, background-color 0.2s ease",
                            animation: "apparition 0.3s ease",
                            width: "fit-content",
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            cursor: "pointer",
                            "@keyframes apparition": {
                                from: { opacity: 0, transform: "translateY(-10px)" },
                                to: { opacity: 1 },
                            },
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "1.15em" }}>
                            {nomCommune(spr.nom_commune)}&nbsp;&middot;&nbsp;
                        </Typography>
                        <Typography variant="body2" sx={{ color: "dimgray", fontSize: "1em", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {formaterMotsCles(spr.mot_cle)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default SearchBarCustom;
