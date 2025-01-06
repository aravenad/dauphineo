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

function ConnexionDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
              <TextField label="Adresse e-mail" variant="standard" />
              <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Mot de passe
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  fullWidth={true}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
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
            <ButtonCustom variant="contained" fullWidth>
              Connectez-vous
            </ButtonCustom>
            <Typography variant="body1">Pas encore membre ?</Typography>
            <Link href="" fontWeight={700} color={"common.black"}>
              Inscrivez-vous
            </Link>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConnexionDialog;
