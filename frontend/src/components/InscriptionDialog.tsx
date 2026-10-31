import { useState, type FormEvent } from "react";
import { Alert, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { ButtonCustom } from "./mui_custom";
import ChampMotDePasse from "./ChampMotDePasse";
import { erreurEmail, erreurMotDePasse, erreurNom } from "./validation";
import api, { messageErreur, type Connexion } from "../api";

interface InscriptionDialogProps {
    open: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    onConnexion: (connexion: Connexion) => void;
}

const VIDE = { nom: "", prenom: "", email: "", mot_de_passe: "" };

function InscriptionDialog({ open, onClose, onSwitchToLogin, onConnexion }: InscriptionDialogProps) {
    const [formulaire, setFormulaire] = useState(VIDE);
    const [touches, setTouches] = useState<Record<string, boolean>>({});
    const [majeur, setMajeur] = useState(false);
    const [erreur, setErreur] = useState("");
    const [envoi, setEnvoi] = useState(false);

    const erreurs = {
        nom: erreurNom(formulaire.nom, "nom"),
        prenom: erreurNom(formulaire.prenom, "prénom"),
        email: erreurEmail(formulaire.email),
        mot_de_passe: erreurMotDePasse(formulaire.mot_de_passe),
    };
    const valide = majeur && Object.values(erreurs).every((e) => !e);

    const champ = (nom: keyof typeof VIDE) => ({
        value: formulaire[nom],
        onChange: (e: { target: { value: string } }) => setFormulaire((f) => ({ ...f, [nom]: e.target.value })),
        onBlur: () => setTouches((t) => ({ ...t, [nom]: true })),
        error: Boolean(touches[nom] && erreurs[nom]),
        helperText: touches[nom] ? erreurs[nom] : "",
        variant: "standard" as const,
    });

    const sInscrire = async (event: FormEvent) => {
        event.preventDefault();
        setTouches({ nom: true, prenom: true, email: true, mot_de_passe: true });
        if (!valide) return;
        setEnvoi(true);
        try {
            const connexion = await api.register({
                nom: formulaire.nom.trim(),
                prenom: formulaire.prenom.trim(),
                email: formulaire.email.trim(),
                mot_de_passe: formulaire.mot_de_passe,
            });
            setFormulaire(VIDE);
            setTouches({});
            setMajeur(false);
            setErreur("");
            onConnexion(connexion);
        } catch (e) {
            setErreur(messageErreur(e, "L'inscription a échoué. Veuillez réessayer."));
        } finally {
            setEnvoi(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 500 }}>Inscription</DialogTitle>
            <IconButton aria-label="Fermer" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
                <CloseRounded />
            </IconButton>
            <DialogContent>
                <Stack component="form" spacing={2} onSubmit={sInscrire} noValidate sx={{ pt: 1 }}>
                    <TextField label="Nom" autoComplete="family-name" {...champ("nom")} />
                    <TextField label="Prénom" autoComplete="given-name" {...champ("prenom")} />
                    <TextField label="Adresse e-mail" type="email" autoComplete="email" {...champ("email")} />
                    <ChampMotDePasse label="Mot de passe" autoComplete="new-password" {...champ("mot_de_passe")}
                        helperText={touches.mot_de_passe ? erreurs.mot_de_passe : "8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial."} />
                    <FormControlLabel
                        control={<Checkbox checked={majeur} onChange={(e) => setMajeur(e.target.checked)} />}
                        label="Je certifie avoir 15 ans ou plus"
                    />
                    {erreur && <Alert severity="error">{erreur}</Alert>}
                    <ButtonCustom type="submit" variant="contained" fullWidth disabled={envoi || !majeur}>
                        Inscrivez-vous
                    </ButtonCustom>
                    <Stack spacing={0.5} sx={{ alignItems: "center" }}>
                        <Typography variant="body1">Déjà membre ?</Typography>
                        <ButtonCustom variant="text" onClick={onSwitchToLogin} sx={{ color: "common.black", fontWeight: 700 }}>
                            Connectez-vous
                        </ButtonCustom>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default InscriptionDialog;
