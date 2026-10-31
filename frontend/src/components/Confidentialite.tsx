import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from "@mui/material";
import api, { messageErreur } from "../api";
import { useSession } from "../session";
import ChampMotDePasse from "./ChampMotDePasse";
import { erreurMotDePasse } from "./validation";
import { ButtonCustom } from "./mui_custom";

function Confidentialite() {
    const { oublier } = useSession();
    const navigate = useNavigate();
    const [motDePasse, setMotDePasse] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [touche, setTouche] = useState(false);
    const [envoi, setEnvoi] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; texte: string } | null>(null);
    const [suppression, setSuppression] = useState(false);
    const [erreurSuppression, setErreurSuppression] = useState("");

    const erreur = erreurMotDePasse(motDePasse);
    const differents = confirmation !== motDePasse;

    const changer = async (e: FormEvent) => {
        e.preventDefault();
        setTouche(true);
        if (erreur || differents) return;
        setEnvoi(true);
        setMessage(null);
        try {
            await api.updateMe({ mot_de_passe: motDePasse });
            setMotDePasse("");
            setConfirmation("");
            setTouche(false);
            setMessage({ type: "success", texte: "Votre mot de passe a été modifié." });
        } catch (erreurApi) {
            setMessage({ type: "error", texte: messageErreur(erreurApi, "Le mot de passe n'a pas pu être modifié.") });
        } finally {
            setEnvoi(false);
        }
    };

    const supprimer = async () => {
        setErreurSuppression("");
        try {
            await api.deleteMe();
            oublier();
            navigate("/");
        } catch (erreurApi) {
            setErreurSuppression(messageErreur(erreurApi, "Le compte n'a pas pu être supprimé."));
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
                <ButtonCustom variant="outlined" color="error" onClick={() => setSuppression(true)}>
                    Supprimer mon compte
                </ButtonCustom>
            </Box>

            <Dialog open={suppression} onClose={() => setSuppression(false)}>
                <DialogTitle>Supprimer votre compte ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Vos réservations et vos avis seront supprimés. Cette action est définitive.</DialogContentText>
                    {erreurSuppression && <Alert severity="error" sx={{ mt: 2 }}>{erreurSuppression}</Alert>}
                </DialogContent>
                <DialogActions>
                    <ButtonCustom onClick={() => setSuppression(false)}>Annuler</ButtonCustom>
                    <ButtonCustom variant="contained" color="error" onClick={() => void supprimer()}>
                        Supprimer définitivement
                    </ButtonCustom>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Confidentialite;
