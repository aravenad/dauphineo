import {
    Stack,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    FormControl,
    Input,
    InputLabel, FormControlLabel, Checkbox, Tooltip,
} from "@mui/material";
import { ButtonCustom } from "./mui_custom";
import { CloseRounded, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import React, { useState } from "react";

interface InscriptionDialogProps {
    open: boolean; // Contrôle l'ouverture du dialog
    onClose?: () => void; // Fonction pour fermer le dialog
    onSwitchToLogin?: () => void; // Fonction pour basculer vers ConnexionDialog
}

function InscriptionDialog({ open, onClose, onSwitchToLogin }: InscriptionDialogProps) {

    const [NomValide, setNomValide] = useState(false);
    const [PrenomValide, setPrenomValide] = useState(false);
    const [EmailValide, setEmailValide] = useState(false);
    const [PwdValide, setPwdValide] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nom: "",
        prenom: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        nom: "",
        prenom: "",
    });

    //fonction pour afficher les erreurs et valider les champs
    const handleChange = (field: string, value: string) => {
        // Met à jour les valeurs saisies
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Valide le champ et met à jour les erreurs
        let error = "";
        if (field === "nom") {
            error = validateNom(value);
            setNomValide(error === ""); // Nom valide si aucune erreur
        }
        if (field === "prenom") {
            error = validatePrenom(value);
            setPrenomValide(error === ""); // Prénom valide si aucune erreur
        }
        if (field === "email") {
            error = validateEmail(value);
            setEmailValide(error === ""); // Email valide si aucune erreur
        }
        if (field === "password") {
            error = validatePassword(value);
            setPwdValide(error === ""); // Mot de passe valide si aucune erreur
        }

        setFormErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    };

    //fonction pour vérifier la validité de l'email
    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Vérifie si l'email est valide
        if (!emailRegex.test(email)) {
            return "Veuillez entrer une adresse email valide.";
        }

        return ""; // Aucun

    };

    //fonction pour vérifier la validité du nom
    const validateNom = (nom: string): string => {
        if (nom.trim() === "") {
            return "Le nom est requis.";
        }
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(-[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
        if (!nameRegex.test(nom)) {
            return "Le nom ne peut contenir que des lettres et des tirets, sans espaces.";
        }
        if (nom.length > 50) {
            return "Le nom ne peut pas dépasser 50 caractères.";
        }
        if (nom.length < 2) {
            return "Le nom doit contenir au moins 2 caractères.";
        }


        return ""; // Aucun problème

    };

    //fonction pour vérifier la validité du prénom
    const validatePrenom = (prenom: string): string => {
        if (prenom.trim() === "") {
            return "Le prénom est requis.";
        }
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(-[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
        if (!nameRegex.test(prenom)) {
            return "Le prénom ne peut contenir que des lettres et des tirets, sans espaces.";
        }
        if (prenom.length > 50) {
            return "Le prénom ne peut pas dépasser 50 caractères.";
        }
        if (prenom.length < 2) {
            return "Le prénom doit contenir au moins 2 caractères.";
        }


        return ""; // Aucun problème

    };

    //fonction pour vérifier la validité du mot de passe
    const validatePassword = (password: string): string => {
        if (password.length < 6) {
            return "Le mot de passe doit contenir au moins 6 caractères.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Le mot de passe doit contenir au moins une lettre majuscule.";
        }
        if (!/[a-z]/.test(password)) {
            return "Le mot de passe doit contenir au moins une lettre minuscule.";
        }
        if (!/[0-9]/.test(password)) {
            return "Le mot de passe doit contenir au moins un chiffre.";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Le mot de passe doit contenir au moins un caractère spécial.";
        }

        return ""; // Aucun problème


    };

    const [isChecked, setIsChecked] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: 500 }}>Inscription</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseRounded />
            </IconButton>
            <DialogContent>
                <Stack>
                    <Stack direction="column" sx={{ paddingTop: 1 }}>
                        <TextField label="Nom" variant="standard" value={formData.nom} // Récupère la valeur actuelle
                                   onChange={(e) => handleChange("nom", e.target.value)} // Met à jour la valeur et valide
                                   error={!!formErrors.nom} // Affiche l'erreur si un message existe
                                   helperText={formErrors.nom}/>
                        <TextField label="Prénom" variant="standard" value={formData.prenom} // Récupère la valeur actuelle
                                   onChange={(e) => handleChange("prenom", e.target.value)} // Met à jour la valeur et valide
                                   error={!!formErrors.prenom} // Affiche l'erreur si un message existe
                                   helperText={formErrors.prenom}/>
                        <TextField label="Adresse e-mail" variant="standard" value={formData.email} // Récupère la valeur actuelle
                                   onChange={(e) => handleChange("email", e.target.value)} // Met à jour la valeur et valide
                                   error={!!formErrors.email} // Affiche l'erreur si un message existe
                                   helperText={formErrors.email}/>
                        <FormControl sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">
                                Mot de passe
                            </InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password} // Associe la valeur au champ
                                onChange={(e) => handleChange("password", e.target.value)} // Met à jour et valide
                                error={!!formErrors.password} // Affiche l'erreur si elle existe
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <Typography variant="caption" color="error">
                                {formErrors.password} {/* Affiche le message d'erreur */}
                            </Typography>
                        </FormControl>

                    </Stack>
                    <Stack
                        spacing={2}
                        sx={{
                            paddingTop: 4,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FormControlLabel control={<Checkbox
                            checked={isChecked}
                            onChange={(event) => setIsChecked(event.target.checked)}
                        />} label="Je certifie avoir 15 ans ou plus" />
                        <Tooltip
                            title={!isChecked ? "Vous devez avoir 15 ans ou plus pour continuer" : ""}
                            placement="top"
                            arrow
                        >
                          <span>
                            <ButtonCustom
                                variant="contained"
                                fullWidth
                                disabled={!isChecked || !NomValide || !PrenomValide || !EmailValide || !PwdValide}

                            >
                              Inscrivez-vous
                            </ButtonCustom>
                          </span>
                        </Tooltip>
                        <Typography variant="body1">Déjà membre ?</Typography>
                        <Typography
                            variant="body2"
                            component="button"
                            onClick={onSwitchToLogin}
                            sx={{ color: "common.black", fontWeight: 700, cursor: "pointer", background: "none", border: "none" }}
                        >
                            Connectez-vous
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default InscriptionDialog;
