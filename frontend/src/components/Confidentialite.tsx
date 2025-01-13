import { useState } from "react";
import { Box, Typography, TextField} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {ButtonCustom} from "./mui_custom";

const Confidentialite = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isEightChars, setIsEightChars] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);

    // Validation dynamique du nouveau mot de passe
    const validatePassword = (value: string) => {
        setIsEightChars(value.length >= 8);
        setHasUppercase(/[A-Z]/.test(value));
    };

    // Gestion du changement du champ "nouveau mot de passe"
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        validatePassword(value);

        // Validation des erreurs spécifiques
        if (/\s/.test(value)) {
            setNewPasswordError("Le mot de passe ne doit pas contenir d'espaces.");
        } else if (value.length < 8 || !/[A-Z]/.test(value)) {
            setNewPasswordError("Le mot de passe doit contenir au moins 8 caractères et une majuscule.");
        } else {
            setNewPasswordError("");
        }
    };

    // Gestion du changement du champ "confirmation"
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (newPassword && value !== newPassword) {
            setConfirmPasswordError("Les mots de passe ne correspondent pas.");
        } else {
            setConfirmPasswordError("");
        }
    };

    // Réinitialisation des champs
    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setIsEightChars(false);
        setHasUppercase(false);
    };

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

            {/* Mot de passe actuel */}
            <TextField
                label="Mot de passe actuel"
                variant="outlined"
                type="password"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />

            {/* Nouveau mot de passe */}
            <TextField
                label="Nouveau mot de passe"
                variant="outlined"
                type="password"
                fullWidth
                value={newPassword}
                onChange={handleNewPasswordChange}
                error={Boolean(newPasswordError)}
                helperText={newPasswordError}
            />

            {/* Confirmation du mot de passe */}
            <TextField
                label="Confirmation du mot de passe"
                variant="outlined"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={Boolean(confirmPasswordError)}
                helperText={confirmPasswordError}
            />

            {/* Conditions pour un mot de passe sûr */}
            <Box
                sx={{
                    display: "flex",
                    backgroundColor: "#f8f8f8",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    marginTop: "10px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "50%", // Chaque condition occupe 50% du conteneur parent
                    }}
                >
                    {isEightChars ? <CheckIcon sx={{ color: "green" }} /> : <CloseIcon sx={{ color: "gray" }} />}
                    <Typography variant="body2">8 caractères</Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "50%",
                    }}
                >
                    {hasUppercase ? <CheckIcon sx={{ color: "green" }} /> : <CloseIcon sx={{ color: "gray" }} />}
                    <Typography variant="body2">1 majuscule</Typography>
                </Box>
            </Box>

            {/* Boutons Annuler et Mettre à jour */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                }}
            >
                <ButtonCustom variant="outlined" color="secondary" onClick={handleCancel}>
                    Annuler
                </ButtonCustom>
                <ButtonCustom
                    variant="contained"
                    color="primary"
                    disabled={!isEightChars || !hasUppercase || Boolean(newPasswordError) || Boolean(confirmPasswordError)}
                >
                    Mettre à jour
                </ButtonCustom>
            </Box>
        </Box>
    );
};

export default Confidentialite;