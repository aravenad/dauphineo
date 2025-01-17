import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import CardSPR from "../components/CardSPR";
import { fetchSPR } from "../api/endpoints/spr";
import { ButtonCustom } from "../components/mui_custom";
import TuneIcon from "@mui/icons-material/Tune";
import FilterPanel from "../components/FilterPanel";

type SPR = {
    id: number;
    nom_commune: string;
    mot_cle: string;
    temps_de_visite: number;
    is_pmr: boolean;
};

type Filters = {
    keywords: string[];
    maxVisitTime: number;
    isAccessible: boolean;
};

const Explorer: React.FC = () => {
    const [sprList, setSprList] = useState<SPR[]>([]);
    const [filteredSprList, setFilteredSprList] = useState<SPR[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | Error>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        keywords: [],
        maxVisitTime: 5,
        isAccessible: false,
    });
    const [isFiltered, setIsFiltered] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadSPR = async () => {
            try {
                const data: SPR[] = await fetchSPR();
                if (!Array.isArray(data)) throw new Error("Données reçues invalides.");
                setSprList(data.sort((a, b) => a.nom_commune.localeCompare(b.nom_commune)));
                setFilteredSprList(data);
            } catch (err) {
                setError(err as Error);
                console.error("Erreur lors de la récupération des SPR :", err);
            } finally {
                setLoading(false);
            }
        };

        loadSPR();
    }, []);

    useEffect(() => {
        if (!isFiltered) {
            setFilteredSprList(sprList);
            return;
        }

        try {
            const filtered = sprList.filter((spr) => {
                const matchesKeywords =
                    filters.keywords.length === 0 ||
                    (spr.mot_cle && filters.keywords.every((keyword) => spr.mot_cle.includes(keyword)));
                const matchesTime = filters.maxVisitTime === 5 || spr.temps_de_visite <= filters.maxVisitTime;
                const matchesAccessibility = !filters.isAccessible || spr.is_pmr;

                return matchesKeywords && matchesTime && matchesAccessibility;
            });

            setFilteredSprList(filtered);
        } catch (filterError) {
            console.error("Erreur lors de l'application des filtres :", filterError);
            setFilteredSprList([]);
        }
    }, [filters, isFiltered, sprList]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography color="error">
                    Erreur : {error.message || "Impossible de charger les SPR."}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "2em", position: "relative", minHeight: "100vh" }}>
            <Box
                sx={{
                    textAlign: "center",
                    marginBottom: "2em",
                    animation: "fadeIn 0.4s ease-in-out",
                    "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(-20px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                <Typography variant="h2" component="h1" fontWeight={800} margin="0.1em 0 0">
                    Explorez le patrimoine
                </Typography>
                <Typography
                    variant="subtitle1"
                    fontWeight={400}
                    color="text.secondary"
                    marginBottom="2em"
                    fontSize="1.4em"
                >
                    Cliquez sur un lieu pour en savoir plus et réserver votre guide
                </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "2em" }}>
                <ButtonCustom variant="outlined" color="error" size="large" onClick={() => navigate("/#")}>
                    &larr; Retour
                </ButtonCustom>
                <ButtonCustom
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                        borderRadius: "50%",
                        minWidth: "42.25px",
                        minHeight: "42.25px",
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={() => setIsFilterOpen(true)}
                >
                    <TuneIcon />
                </ButtonCustom>
            </Box>

            {filteredSprList.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "30px" }}>
                    {filteredSprList.map((spr) => (
                        <Box
                            key={spr.id}
                            sx={{
                                flexBasis: "calc(25% - 20px)",
                                flexGrow: 0,
                                maxWidth: "calc(25% - 30px)",
                                marginBottom: "30px"
                            }}
                        >
                            <CardSPR id={spr.id} variante="regular" />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", marginTop: "2em" }}>
                    Aucun site patrimonial remarquable ne correspond à vos critères de recherche.
                </Typography>
            )}

            {isFilterOpen && (
                <FilterPanel
                    onClose={() => setIsFilterOpen(false)}
                    onApply={(updatedFilters: Filters) => setFilters(updatedFilters)}
                    filters={filters}
                    setIsFiltered={setIsFiltered}
                />
            )}
        </Box>
    );
};

export default Explorer;