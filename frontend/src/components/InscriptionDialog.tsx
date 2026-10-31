import { useState, type FormEvent } from "react";
import { Alert, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { ButtonCustom } from "./mui_custom";
import ChampMotDePasse from "./ChampMotDePasse";
import { erreurEmail, erreurMotDePasse, erreurNom } from "./validation";
import api, { messageErreur, type Connexion, type DemandeInscription } from "../api";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: {
        echec: "L'inscription a échoué. Veuillez réessayer.",
        echecActivation: "L'activation a échoué. Veuillez réessayer.",
        verifiez: "Vérifiez vos e-mails",
        titre: "Inscription",
        fermer: "Fermer",
        demo: "Version de démonstration : aucun e-mail n'est envoyé, ce bouton remplace le lien d'activation.",
        activer: "Activer le compte (démo)",
        nom: "Nom",
        prenom: "Prénom",
        email: "Adresse e-mail",
        motDePasse: "Mot de passe",
        regles: "8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial.",
        age: "Je certifie avoir 15 ans ou plus",
        inscrire: "Inscrivez-vous",
        dejaMembre: "Déjà membre ?",
        connecter: "Connectez-vous",
    },
    en: {
        echec: "Sign-up failed. Please try again.",
        echecActivation: "Activation failed. Please try again.",
        verifiez: "Check your email",
        titre: "Sign up",
        fermer: "Close",
        demo: "Demo version: no email is sent, this button stands in for the activation link.",
        activer: "Activate the account (demo)",
        nom: "Last name",
        prenom: "First name",
        email: "Email address",
        motDePasse: "Password",
        regles: "At least 8 characters, with an uppercase letter, a lowercase letter, a digit and a special character.",
        age: "I confirm I am 15 or older",
        inscrire: "Sign up",
        dejaMembre: "Already a member?",
        connecter: "Log in",
    },
};

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
    const [demande, setDemande] = useState<DemandeInscription | null>(null);
    const t = useTextes(TEXTES);

    const erreurs = {
        nom: erreurNom(formulaire.nom, "nom"),
        prenom: erreurNom(formulaire.prenom, "prenom"),
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
            const reponse = await api.register({
                nom: formulaire.nom.trim(),
                prenom: formulaire.prenom.trim(),
                email: formulaire.email.trim(),
                mot_de_passe: formulaire.mot_de_passe,
            });
            setFormulaire(VIDE);
            setTouches({});
            setMajeur(false);
            setErreur("");
            setDemande(reponse);
        } catch (e) {
            setErreur(messageErreur(e, t.echec));
        } finally {
            setEnvoi(false);
        }
    };

    // En démo aucun e-mail ne part : ce bouton tient lieu du lien d'activation
    const activerDemo = async (jeton: string) => {
        setEnvoi(true);
        try {
            const connexion = await api.confirmerInscription(jeton);
            setDemande(null);
            onConnexion(connexion);
        } catch (e) {
            setErreur(messageErreur(e, t.echecActivation));
        } finally {
            setEnvoi(false);
        }
    };

    const fermer = () => {
        setDemande(null);
        setErreur("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={fermer} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 500 }}>{demande ? t.verifiez : t.titre}</DialogTitle>
            <IconButton aria-label={t.fermer} onClick={fermer} sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}>
                <CloseRounded />
            </IconButton>
            <DialogContent>
                {demande ? (
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <Alert severity="success" role="status">{demande.message}</Alert>
                        {demande.jetonDemo && (
                            <>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    {t.demo}
                                </Typography>
                                {erreur && <Alert severity="error">{erreur}</Alert>}
                                <ButtonCustom variant="contained" fullWidth disabled={envoi} onClick={() => void activerDemo(demande.jetonDemo!)}>
                                    {t.activer}
                                </ButtonCustom>
                            </>
                        )}
                        <ButtonCustom variant={demande.jetonDemo ? "text" : "contained"} fullWidth onClick={fermer}>
                            {t.fermer}
                        </ButtonCustom>
                    </Stack>
                ) : (
                    <Stack component="form" spacing={2} onSubmit={sInscrire} noValidate sx={{ pt: 1 }}>
                        <TextField label={t.nom} autoComplete="family-name" {...champ("nom")} />
                        <TextField label={t.prenom} autoComplete="given-name" {...champ("prenom")} />
                        <TextField label={t.email} type="email" autoComplete="email" {...champ("email")} />
                        <ChampMotDePasse label={t.motDePasse} autoComplete="new-password" {...champ("mot_de_passe")}
                            helperText={touches.mot_de_passe ? erreurs.mot_de_passe : t.regles} />
                        <FormControlLabel
                            control={<Checkbox checked={majeur} onChange={(e) => setMajeur(e.target.checked)} />}
                            label={t.age}
                        />
                        {erreur && <Alert severity="error">{erreur}</Alert>}
                        <ButtonCustom type="submit" variant="contained" fullWidth disabled={envoi || !majeur}>
                            {t.inscrire}
                        </ButtonCustom>
                        <Stack spacing={0.5} sx={{ alignItems: "center" }}>
                            <Typography variant="body1">{t.dejaMembre}</Typography>
                            <ButtonCustom variant="text" onClick={onSwitchToLogin} sx={{ color: "common.black", fontWeight: 700 }}>
                                {t.connecter}
                            </ButtonCustom>
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default InscriptionDialog;
