import { useState, type FormEvent } from "react";
import { Alert, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { ButtonCustom } from "./mui_custom";
import ChampMotDePasse from "./ChampMotDePasse";
import InscriptionDialog from "./InscriptionDialog";
import api, { messageErreur, modeDemo, type Connexion } from "../api";
import { MOT_DE_PASSE_DEMO } from "../demo/constantes";

interface ConnexionDialogProps {
    open: boolean;
    onClose: () => void;
    onConnexion: (connexion: Connexion) => void;
}

function ConnexionDialog({ open, onClose, onConnexion }: ConnexionDialogProps) {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [inscription, setInscription] = useState(false);

    const fermer = () => {
        setErreur("");
        setMotDePasse("");
        onClose();
    };

    const seConnecter = async (event: FormEvent) => {
        event.preventDefault();
        if (!email.trim() || !motDePasse) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }
        setEnvoi(true);
        try {
            const connexion = await api.login(email.trim(), motDePasse);
            setErreur("");
            setMotDePasse("");
            onConnexion(connexion);
        } catch (e) {
            setErreur(messageErreur(e, "Identifiants invalides. Veuillez réessayer."));
        } finally {
            setEnvoi(false);
        }
    };

    const remplirDemo = () => {
        setEmail("demo@dauphineo.test");
        setMotDePasse(MOT_DE_PASSE_DEMO);
    };

    return (
        <>
            <Dialog open={open && !inscription} onClose={fermer} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 500 }}>Connexion</DialogTitle>
                <IconButton aria-label="Fermer" onClick={fermer} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
                    <CloseRounded />
                </IconButton>
                <DialogContent>
                    <Stack component="form" spacing={2} onSubmit={seConnecter} noValidate sx={{ pt: 1 }}>
                        {modeDemo && (
                            <Alert severity="info">
                                Démo hors ligne : les données restent dans votre navigateur.{" "}
                                <Typography component="button" type="button" variant="body2" onClick={remplirDemo}
                                    sx={{ p: 0, border: 0, background: "none", fontWeight: 700, textDecoration: "underline", cursor: "pointer", color: "inherit" }}>
                                    Utiliser le compte de démo
                                </Typography>
                            </Alert>
                        )}
                        <TextField
                            label="Adresse e-mail"
                            type="email"
                            autoComplete="email"
                            variant="standard"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                        />
                        <ChampMotDePasse
                            label="Mot de passe"
                            autoComplete="current-password"
                            variant="standard"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                        />
                        {erreur && <Alert severity="error">{erreur}</Alert>}
                        <ButtonCustom type="submit" variant="contained" fullWidth disabled={envoi}>
                            Connectez-vous
                        </ButtonCustom>
                        <Stack spacing={0.5} sx={{ alignItems: "center" }}>
                            <Typography variant="body1">Pas encore membre ?</Typography>
                            <ButtonCustom variant="text" onClick={() => setInscription(true)} sx={{ color: "common.black", fontWeight: 700 }}>
                                Inscrivez-vous
                            </ButtonCustom>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
            <InscriptionDialog
                open={open && inscription}
                onClose={() => {
                    setInscription(false);
                    fermer();
                }}
                onSwitchToLogin={() => setInscription(false)}
                onConnexion={(connexion) => {
                    setInscription(false);
                    onConnexion(connexion);
                }}
            />
        </>
    );
}

export default ConnexionDialog;
