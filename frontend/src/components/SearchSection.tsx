import { Box, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // Icône correspondant à ✨
import SearchBarCustom from "./mui_custom/SearchBarCustom"; // Correction : import du composant

// Bouton Questionnaire
const QuestionnaireButton = () => {
    return (
        <Button
            variant="contained"
            sx={{
                borderRadius: "50%",
                padding: "0",
                height: "56px",
                width: "56px",
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                color: "black",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                    backgroundColor: "#f0f0f0",
                },
            }}
            onClick={() => alert("Ouverture du questionnaire")}
        >
            <AutoAwesomeIcon sx={{ fontSize: "24px" }} />
        </Button>
    );
};

// Section Recherche
const SearchSection = ({ sprList }: { sprList: any[] }) => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "55vh",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "20px",
                zIndex: 1,

                // Effet de gris opaque
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('https://www.bonplanvoyage.net/wordpress2012/wp-content/uploads/grenoble-telecabines-e1623230394511.jpeg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -2,
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(128, 128, 128, 0.3)",
                    zIndex: -1,
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    maxWidth: "800px",
                    borderRadius: "24px",
                }}
            >
                {/* Barre de recherche */}
                <SearchBarCustom
                    placeholder="Des endroits à visiter en Isère"
                    sprList={sprList}
                />

                {/* Bouton questionnaire */}
                <QuestionnaireButton />
            </Box>
        </Box>
    );
};

export default SearchSection;