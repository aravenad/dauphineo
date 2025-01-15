import {
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import { ButtonCustom } from "./mui_custom";
import {
  CloseRounded,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import InscriptionDialog from "./InscriptionDialog.tsx";
import {loginUser} from "../api/endpoints/users.tsx";

function ConnexionDialog() {
  const [open, setOpen] = useState(false);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false); // Ajout pour gérer le mode

  const [formData, setFormData] = useState({
    email: "", // Valeur initiale pour l'email
    mot_de_passe: "", // Valeur initiale pour le mot de passe
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true); // Pour ouvrir ConnexionDialog
  };

  const handleClose = () => {
    setOpen(false); // Pour fermer ConnexionDialog
    setIsInscriptionOpen(false); // Pour fermer InscriptionDialog si ouvert
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.mot_de_passe) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await loginUser(formData);
      console.log("Connexion réussie :", response);
      setErrorMessage(""); // Réinitialise les erreurs si la connexion réussit
      setOpen(false); // Ferme la modal
    } catch (error) {
      setErrorMessage("Identifiants invalides. Veuillez réessayer.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      <ButtonCustom onClick={handleClickOpen} variant="contained">
        Se connecter
      </ButtonCustom>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 500 }}>Connexion</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
              <TextField
                  label="Adresse e-mail"
                  variant="standard"
                  value={formData.email} // Associe la valeur saisie au champ email
                  onChange={(e) => handleChange("email", e.target.value)} // Met à jour formData.email
              />
              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Mot de passe
                </InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? "text" : "mot_de_passe"}
                    value={formData.mot_de_passe} // Associe la valeur saisie au champ password
                    onChange={(e) => handleChange("mot_de_passe", e.target.value)} // Met à jour formData.password
                    fullWidth={true}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                        >
                          {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                />
              </FormControl>
              {errorMessage && (
                  <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                    {errorMessage}
                  </Typography>
              )}
            </Stack>
            <Link href="#" color={"common.black"} sx={{ paddingTop: 2 }}>
              Mot de passe oublié ?
            </Link>
          </Stack>
          <Stack
            spacing={2}
            sx={{
              paddingTop: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonCustom
                variant="contained"
                fullWidth
                onClick={handleLogin} // Appel de la fonction de connexion
            >
              Connectez-vous
            </ButtonCustom>
            <Typography variant="body1">Pas encore membre ?</Typography>
            <Typography
                variant="body2"
                component="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setIsInscriptionOpen(true), 300);
                }}
                sx={{ color: "common.black", fontWeight: 700, cursor: "pointer", background: "none", border: "none" }}
            >
              Inscrivez-vous
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
      {isInscriptionOpen && (
          <InscriptionDialog
              open={isInscriptionOpen} // Passe l'état d'ouverture à InscriptionDialog
              onClose={() => setIsInscriptionOpen(false)} // Ferme InscriptionDialog
              onSwitchToLogin={() => {
                setIsInscriptionOpen(false); // Ferme InscriptionDialog
                setOpen(true); // Ouvre ConnexionDialog
              }}
          />
      )}
    </>
  );
}

export default ConnexionDialog;
