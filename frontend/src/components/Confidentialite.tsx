import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Divider, Typography } from "@mui/material";
import api, { messageErreur } from "../api";
import { useSession } from "../session";
import ChampMotDePasse from "./ChampMotDePasse";
import Confirmation from "./Confirmation";
import { erreurMotDePasse } from "./validation";
import { ButtonCustom } from "./mui_custom";
import { useTextes } from "../i18n";

const TEXTES = {
    fr: {
        modifie: "Votre mot de passe a été modifié. Vos autres sessions ont été déconnectées.",
        echecModif: "Le mot de passe n'a pas pu être modifié.",
        echecSuppr: "Le compte n'a pas pu être supprimé.",
        changer: "Changer de mot de passe",
        actuel: "Mot de passe actuel",
        saisirActuel: "Saisissez votre mot de passe actuel.",
        nouveau: "Nouveau mot de passe",
        regles: "8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial.",
        confirmer: "Confirmer le mot de passe",
        differents: "Les deux mots de passe ne correspondent pas.",
        modification: "Modification…",
        modifier: "Modifier le mot de passe",
        supprimer: "Supprimer mon compte",
        avertissement: "Vos réservations et vos avis seront supprimés avec votre compte. Cette action est définitive.",
        titreSuppr: "Supprimer votre compte ?",
        definitif: "Supprimer définitivement",
        garder: "Garder mon compte",
        motDePasse: "Mot de passe",
        confirmation: "Vos réservations et vos avis seront supprimés. Cette action est définitive. Saisissez votre mot de passe pour confirmer.",
    },
    en: {
        modifie: "Your password has been changed. Your other sessions have been logged out.",
        echecModif: "The password could not be changed.",
        echecSuppr: "The account could not be deleted.",
        changer: "Change password",
        actuel: "Current password",
        saisirActuel: "Enter your current password.",
        nouveau: "New password",
        regles: "At least 8 characters, with an uppercase letter, a lowercase letter, a digit and a special character.",
        confirmer: "Confirm the password",
        differents: "The two passwords do not match.",
        modification: "Changing…",
        modifier: "Change password",
        supprimer: "Delete my account",
        avertissement: "Your bookings and reviews will be deleted along with your account. This cannot be undone.",
        titreSuppr: "Delete your account?",
        definitif: "Delete permanently",
        garder: "Keep my account",
        motDePasse: "Password",
        confirmation: "Your bookings and reviews will be deleted. This cannot be undone. Enter your password to confirm.",
    },
};

function Confidentialite() {
    const { oublier } = useSession();
    const t = useTextes(TEXTES);
    const navigate = useNavigate();
    const [actuel, setActuel] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [touche, setTouche] = useState(false);
    const [envoi, setEnvoi] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; texte: string } | null>(null);
    const [suppression, setSuppression] = useState(false);
    const [erreurSuppression, setErreurSuppression] = useState("");
    const [enSuppression, setEnSuppression] = useState(false);
    const [motDePasseSuppression, setMotDePasseSuppression] = useState("");

    const erreur = erreurMotDePasse(motDePasse);
    const differents = confirmation !== motDePasse;

    const changer = async (e: FormEvent) => {
        e.preventDefault();
        setTouche(true);
        if (!actuel || erreur || differents) return;
        setEnvoi(true);
        setMessage(null);
        try {
            await api.updateMe({ mot_de_passe: motDePasse, mot_de_passe_actuel: actuel });
            setActuel("");
            setMotDePasse("");
            setConfirmation("");
            setTouche(false);
            setMessage({ type: "success", texte: t.modifie });
        } catch (erreurApi) {
            setMessage({ type: "error", texte: messageErreur(erreurApi, t.echecModif) });
        } finally {
            setEnvoi(false);
        }
    };

    const ouvrirSuppression = () => {
        setMotDePasseSuppression("");
        setErreurSuppression("");
        setSuppression(true);
    };

    const supprimer = async () => {
        if (!motDePasseSuppression) return;
        setErreurSuppression("");
        setEnSuppression(true);
        try {
            await api.deleteMe(motDePasseSuppression);
            oublier();
            navigate("/");
        } catch (erreurApi) {
            setErreurSuppression(messageErreur(erreurApi, t.echecSuppr));
            setEnSuppression(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box component="form" onSubmit={changer} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                    {t.changer}
                </Typography>
                {message && <Alert severity={message.type} role="status">{message.texte}</Alert>}
                <ChampMotDePasse
                    label={t.actuel}
                    autoComplete="current-password"
                    value={actuel}
                    onChange={(e) => setActuel(e.target.value)}
                    error={touche && !actuel}
                    helperText={touche && !actuel ? t.saisirActuel : " "}
                    fullWidth
                />
                <ChampMotDePasse
                    label={t.nouveau}
                    autoComplete="new-password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    error={touche && Boolean(erreur)}
                    helperText={touche && erreur ? erreur : t.regles}
                    fullWidth
                />
                <ChampMotDePasse
                    label={t.confirmer}
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    error={touche && differents}
                    helperText={touche && differents ? t.differents : " "}
                    fullWidth
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <ButtonCustom type="submit" variant="contained" disabled={envoi || !motDePasse}>
                        {envoi ? t.modification : t.modifier}
                    </ButtonCustom>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                {t.supprimer}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
                {t.avertissement}
            </Typography>
            <Box>
                <ButtonCustom variant="outlined" color="error" onClick={ouvrirSuppression}>
                    {t.supprimer}
                </ButtonCustom>
            </Box>

            <Confirmation
                open={suppression}
                titre={t.titreSuppr}
                confirmer={t.definitif}
                retour={t.garder}
                enCours={enSuppression}
                erreur={erreurSuppression}
                desactive={!motDePasseSuppression}
                champ={
                    <ChampMotDePasse
                        label={t.motDePasse}
                        autoComplete="current-password"
                        value={motDePasseSuppression}
                        onChange={(e) => setMotDePasseSuppression(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") void supprimer();
                        }}
                        autoFocus
                        fullWidth
                    />
                }
                onConfirmer={() => void supprimer()}
                onFermer={() => setSuppression(false)}
            >
                {t.confirmation}
            </Confirmation>
        </Box>
    );
}

export default Confidentialite;
