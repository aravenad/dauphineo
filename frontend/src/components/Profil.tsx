import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ButtonCustom } from "./mui_custom";



const PrenomField = () => {
    const [prenom, setPrenom] = useState("");
    const [error, setError] = useState("");

    const validatePrenom = (value: string | string[]) => {
        if (!value) {
            setError("Le prénom ne peut pas être vide.");
        } else if (!/^[A-Za-z-]+$/.test(value as string)) {
            setError("Le prénom ne peut contenir que des lettres et des tirets.");
        } else if (value.includes(" ")) {
            setError("Le prénom ne peut pas contenir d'espaces.");
        } else if (value.length > 50) {
            setError("Le prénom ne peut pas dépasser 50 caractères.");
        } else if (value.length < 2) {
            setError("Le prénom doit contenir au moins 2 caractères.");
        } else {
            setError("");
        }
    };

    const handleChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setPrenom(value);
        validatePrenom(value);
    };

    return (
        <Box sx={{ width: "50%" }}>
            <Typography variant="body2" sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                Prénom
            </Typography>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Entrez votre prénom"
                value={prenom}
                onChange={handleChange}
                error={Boolean(error)}
                helperText={error}
                FormHelperTextProps={{
                    sx: {
                        textAlign: "left",
                        margin: 0,
                    },
                }}
            />
        </Box>
    );
};


const NomField = () => {
    const [nom, setNom] = useState("");
    const [error, setError] = useState("");

    const validateNom = (value: string | string[]) => {
        if (!value) {
            setError("Le nom ne peut pas être vide.");
        } else if (!/^[A-Za-z-]+$/.test(value as string)) {
            setError("Le nom ne peut contenir que des lettres et des tirets.");
        } else if (value.includes(" ")) {
            setError("Le nom ne peut pas contenir d'espaces.");
        } else if (value.length > 50) {
            setError("Le nom ne peut pas dépasser 50 caractères.");
        } else if (value.length < 2) {
            setError("Le nom doit contenir au moins 2 caractères.");
        } else {
            setError("");
        }
    };

    const handleChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setNom(value);
        validateNom(value);
    };

    return (
        <Box sx={{ width: "50%" }}>
            <Typography variant="body2" sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                Nom
            </Typography>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Entrez votre nom"
                value={nom}
                onChange={handleChange}
                error={Boolean(error)}
                helperText={error}
                FormHelperTextProps={{
                    sx: {
                        textAlign: "left",
                        margin: 0,
                    },
                }}
            />
        </Box>
    );
};


const EmailField = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            setError("L'adresse e-mail ne peut pas être vide.");
        } else if (!emailRegex.test(value)) {
            setError("Entrez une adresse e-mail valide.");
        } else {
            setError("");
        }
    };

    const handleChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    return (
        <Box>
            <Typography variant="body2" sx={{ marginBottom: "5px", fontWeight: "bold" }}>
                Adresse e-mail
            </Typography>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Entrez votre adresse e-mail"
                value={email}
                onChange={handleChange}
                error={Boolean(error)}
                helperText={error}
                FormHelperTextProps={{
                    sx: {
                        textAlign: "left",
                        margin: 0,
                    },
                }}
            />
        </Box>
    );
};


const Profil = () => {
    const [isGuideVolontaire, setIsGuideVolontaire] = useState("non");

    return (
        <Box
            sx={{
                width: "100%",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            {/* Titre */}
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                Informations personnelles
            </Typography>

            {/* Photo de profil avec Prénom Nom */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                        backgroundColor: "#e0e0e0",
                    }}
                >
                    <AccountCircleIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6">Maxime Roux</Typography>
            </Box>

            {/* Champs Prénom et Nom */}
            <Box
                sx={{
                    display: "flex",
                    gap: "20px",
                }}
            >
                {/* Prénom */}
                <PrenomField />

                {/* Nom */}
                <NomField />
            </Box>

            {/* Champ Adresse e-mail */}
            <EmailField />

            {/* Radio Button */}
            <Box>
                <Typography sx={{ marginBottom: "10px" }}>
                    Je suis guide volontaire
                </Typography>
                <RadioGroup
                    value={isGuideVolontaire}
                    onChange={(e) => setIsGuideVolontaire(e.target.value)}
                    row
                >
                    <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                    <FormControlLabel value="non" control={<Radio />} label="Non" />
                </RadioGroup>
            </Box>

            {/* Boutons Annuler et Mettre à jour */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                }}
            >
                {/* il faut faire que ca reset les fields quand on clique sur annuler */}
                <ButtonCustom variant="outlined" color="secondary">
                    Annuler
                </ButtonCustom>
                {/* il faut faire que ca update les fields dans la db */}
                <ButtonCustom variant="contained" color="primary">
                    Mettre à jour
                </ButtonCustom>
            </Box>
        </Box>
    );
};

export default Profil;