import { useState, type FormEvent } from "react";
import { Alert, Avatar, Box, TextField, Typography } from "@mui/material";
import api, { messageErreur, type Utilisateur } from "../api";
import { useSession } from "../session";
import ChampMotDePasse from "./ChampMotDePasse";
import { erreurEmail, erreurNom } from "./validation";
import { ButtonCustom } from "./mui_custom";

type Champs = Pick<Utilisateur, "prenom" | "nom" | "email">;

function initiales({ prenom, nom }: Champs): string {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

function Profil({ utilisateur }: { utilisateur: Utilisateur }) {
    const { mettreAJour } = useSession();
    const [champs, setChamps] = useState<Champs>({ prenom: utilisateur.prenom, nom: utilisateur.nom, email: utilisateur.email });
    const [motDePasse, setMotDePasse] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; texte: string } | null>(null);

    const erreurs = {
        prenom: erreurNom(champs.prenom, "prénom"),
        nom: erreurNom(champs.nom, "nom"),
        email: erreurEmail(champs.email),
    };
    const modifie = champs.prenom !== utilisateur.prenom || champs.nom !== utilisateur.nom || champs.email !== utilisateur.email;
    // L'API redemande le mot de passe avant de changer l'adresse qui sert à se connecter
    const nouvelEmail = champs.email.trim().toLowerCase() !== utilisateur.email.toLowerCase();
    const valide = !erreurs.prenom && !erreurs.nom && !erreurs.email && (!nouvelEmail || motDePasse !== "");

    const champ = (nom: keyof Champs) => ({
        value: champs[nom],
        onChange: (e: { target: { value: string } }) => setChamps((c) => ({ ...c, [nom]: e.target.value })),
        error: Boolean(erreurs[nom]),
        helperText: erreurs[nom] || " ",
        fullWidth: true,
    });

    const enregistrer = async (e: FormEvent) => {
        e.preventDefault();
        if (!modifie || !valide) return;
        setEnvoi(true);
        setMessage(null);
        try {
            const modification = Object.fromEntries(
                (Object.keys(champs) as (keyof Champs)[]).filter((cle) => champs[cle] !== utilisateur[cle]).map((cle) => [cle, champs[cle].trim()]),
            );
            const misAJour = await api.updateMe(nouvelEmail ? { ...modification, mot_de_passe_actuel: motDePasse } : modification);
            mettreAJour(misAJour);
            setMotDePasse("");
            setChamps({ prenom: misAJour.prenom, nom: misAJour.nom, email: misAJour.email });
            setMessage({ type: "success", texte: "Vos informations ont été mises à jour." });
        } catch (erreur) {
            setMessage({ type: "error", texte: messageErreur(erreur, "Vos informations n'ont pas pu être mises à jour.") });
        } finally {
            setEnvoi(false);
        }
    };

    return (
        <Box component="form" onSubmit={enregistrer} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>{initiales(utilisateur)}</Avatar>
                <Box>
                    <Typography variant="h6" component="p">
                        {utilisateur.prenom} {utilisateur.nom}
                    </Typography>
                    <Typography color="text.secondary">@{utilisateur.pseudo}</Typography>
                </Box>
            </Box>

            {message && <Alert severity={message.type} role="status">{message.texte}</Alert>}

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <TextField label="Prénom" autoComplete="given-name" {...champ("prenom")} />
                <TextField label="Nom" autoComplete="family-name" {...champ("nom")} />
            </Box>
            <TextField label="Adresse e-mail" type="email" autoComplete="email" {...champ("email")} />
            {nouvelEmail && (
                <ChampMotDePasse
                    label="Mot de passe actuel"
                    autoComplete="current-password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    helperText="Nécessaire pour changer d'adresse e-mail."
                    fullWidth
                />
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <ButtonCustom
                    variant="outlined"
                    disabled={!modifie || envoi}
                    onClick={() => {
                        setChamps({ prenom: utilisateur.prenom, nom: utilisateur.nom, email: utilisateur.email });
                        setMotDePasse("");
                    }}
                >
                    Annuler
                </ButtonCustom>
                <ButtonCustom type="submit" variant="contained" disabled={!modifie || !valide || envoi}>
                    {envoi ? "Enregistrement…" : "Mettre à jour"}
                </ButtonCustom>
            </Box>
        </Box>
    );
}

export default Profil;
