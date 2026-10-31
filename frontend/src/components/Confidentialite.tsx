import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Divider, Typography } from "@mui/material";
import api, { messageErreur } from "../api";
import { useSession } from "../session";
import ChampMotDePasse from "./ChampMotDePasse";
import Confirmation from "./Confirmation";
import { erreurMotDePasse } from "./validation";
import { ButtonCustom } from "./mui_custom";

function Confidentialite() {
    const { oublier } = useSession();
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
            setMessage({ type: "success", texte: "Votre mot de passe a été modifié. Vos autres sessions ont été déconnectées." });
        } catch (erreurApi) {
            setMessage({ type: "error", texte: messageErreur(erreurApi, "Le mot de passe n'a pas pu être modifié.") });
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
            setErreurSuppression(messageErreur(erreurApi, "Le compte n'a pas pu être supprimé."));
            setEnSuppression(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box component="form" onSubmit={changer} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                    Changer de mot de passe
                </Typography>
                {message && <Alert severity={message.type} role="status">{message.texte}</Alert>}
                <ChampMotDePasse
                    label="Mot de passe actuel"
                    autoComplete="current-password"
                    value={actuel}
                    onChange={(e) => setActuel(e.target.value)}
                    error={touche && !actuel}
                    helperText={touche && !actuel ? "Saisissez votre mot de passe actuel." : " "}
                    fullWidth
                />
                <ChampMotDePasse
                    label="Nouveau mot de passe"
                    autoComplete="new-password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    error={touche && Boolean(erreur)}
                    helperText={touche && erreur ? erreur : "8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial."}
                    fullWidth
                />
                <ChampMotDePasse
                    label="Confirmer le mot de passe"
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    error={touche && differents}
                    helperText={touche && differents ? "Les deux mots de passe ne correspondent pas." : " "}
                    fullWidth
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <ButtonCustom type="submit" variant="contained" disabled={envoi || !motDePasse}>
                        {envoi ? "Modification…" : "Modifier le mot de passe"}
                    </ButtonCustom>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" component="h2" fontWeight="bold">
                Supprimer mon compte
            </Typography>
            <Typography color="text.secondary">
                Vos réservations et vos avis seront supprimés avec votre compte. Cette action est définitive.
            </Typography>
            <Box>
                <ButtonCustom variant="outlined" color="error" onClick={ouvrirSuppression}>
                    Supprimer mon compte
                </ButtonCustom>
            </Box>

            <Confirmation
                open={suppression}
                titre="Supprimer votre compte ?"
                confirmer="Supprimer définitivement"
                retour="Garder mon compte"
                enCours={enSuppression}
                erreur={erreurSuppression}
                desactive={!motDePasseSuppression}
                champ={
                    <ChampMotDePasse
                        label="Mot de passe"
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
                Vos réservations et vos avis seront supprimés. Cette action est définitive. Saisissez votre mot de passe pour confirmer.
            </Confirmation>
        </Box>
    );
}

export default Confidentialite;
