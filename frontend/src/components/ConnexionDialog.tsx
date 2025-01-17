import { useState } from "react";
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
import React from "react";
import InscriptionDialog from "./InscriptionDialog.tsx";
import { loginUser } from "../api/endpoints/users.tsx";

interface ConnexionDialogProps {
  setIsLoggedIn: (loggedIn: boolean) => void; // Ajout de la prop setIsLoggedIn
}

function ConnexionDialog({ setIsLoggedIn }: ConnexionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsInscriptionOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await loginUser(formData);
      console.log(response);
      localStorage.setItem("accessToken", response.access_token); // Stocke uniquement le token
      setIsLoggedIn(true); // Mise à jour de l'état de connexion dans le parent
      setErrorMessage("");
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
              <TextField
                  label="Adresse e-mail"
                  variant="standard"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
              />
              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Mot de passe
                </InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                              <VisibilityOffOutlined />
                          ) : (
                              <VisibilityOutlined />
                          )}
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
              <Link href="#" color={"common.black"} sx={{ paddingTop: 2 }}>
                Mot de passe oublié ?
              </Link>
            </Stack>
            <Stack spacing={2} sx={{ paddingTop: 4, alignItems: "center" }}>
              <ButtonCustom variant="contained" fullWidth onClick={handleLogin}>
                Connectez-vous
              </ButtonCustom>
              <Typography variant="body1">Pas encore membre ?</Typography>
              <Typography
                  variant="body2"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => setIsInscriptionOpen(true), 300);
                  }}
                  sx={{
                    color: "common.black",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
              >
                Inscrivez-vous
              </Typography>
            </Stack>
          </DialogContent>
        </Dialog>
        {isInscriptionOpen && (
            <InscriptionDialog
                open={isInscriptionOpen}
                onClose={() => setIsInscriptionOpen(false)}
                onSwitchToLogin={() => {
                  setIsInscriptionOpen(false);
                  setOpen(true);
                }}
            />
        )}
      </>
  );
}

export default ConnexionDialog;
