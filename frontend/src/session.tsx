import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import { Alert, Snackbar } from "@mui/material";
import api, { ApiError, messageErreur, type Connexion, type Utilisateur } from "./api";
import { enregistrerToken, lireToken } from "./api/token";
import { traduire } from "./i18n";
import ConnexionDialog from "./components/ConnexionDialog";

interface Session {
    utilisateur: Utilisateur | null;
    /** Vrai tant que la session enregistrée n'a pas été vérifiée auprès de l'API. */
    verification: boolean;
    ouvrirConnexion: () => void;
    connecter: (connexion: Connexion) => void;
    deconnecter: () => Promise<void>;
    oublier: () => void;
    mettreAJour: (utilisateur: Utilisateur) => void;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
    const [verification, setVerification] = useState(() => lireToken() !== null);
    const [dialogue, setDialogue] = useState(false);
    // Le message reste en place pendant que la notification se referme
    const [activation, setActivation] = useState({ ouverte: false, succes: true, message: "" });
    const [parametres, setParametres] = useSearchParams();
    const jetonActivation = parametres.get("inscription");
    const activationLancee = useRef(false);

    useEffect(() => {
        if (!lireToken()) return;
        api.me()
            .then(setUtilisateur)
            .catch((erreur) => {
                // Un jeton expiré ou révoqué est oublié ; une panne réseau ne déconnecte pas
                if (erreur instanceof ApiError && erreur.status === 401) {
                    enregistrerToken(null);
                }
            })
            .finally(() => setVerification(false));
    }, []);

    const connecter = useCallback((connexion: Connexion) => {
        enregistrerToken(connexion.access_token);
        setUtilisateur(connexion.user);
        setDialogue(false);
    }, []);

    // Lien d'activation reçu par e-mail : ?inscription=<jeton>
    useEffect(() => {
        if (!jetonActivation || activationLancee.current) return;
        activationLancee.current = true;
        setParametres((p) => {
            p.delete("inscription");
            return p;
        }, { replace: true });
        api.confirmerInscription(jetonActivation)
            .then((connexion) => {
                connecter(connexion);
                setActivation({ ouverte: true, succes: true, message: traduire({ fr: "Votre compte est activé. Bienvenue sur Dauphinéo !", en: "Your account is activated. Welcome to Dauphinéo!" }) });
            })
            .catch((erreur) => setActivation({ ouverte: true, succes: false, message: messageErreur(erreur, traduire({ fr: "Votre compte n'a pas pu être activé.", en: "Your account could not be activated." })) }));
    }, [jetonActivation, setParametres, connecter]);

    const fermerActivation = () => setActivation((a) => ({ ...a, ouverte: false }));

    const oublier = useCallback(() => {
        enregistrerToken(null);
        setUtilisateur(null);
    }, []);

    const deconnecter = useCallback(async () => {
        try {
            await api.logout();
        } finally {
            oublier();
        }
    }, [oublier]);

    const valeur = useMemo<Session>(() => ({
        utilisateur,
        verification,
        ouvrirConnexion: () => setDialogue(true),
        connecter,
        deconnecter,
        oublier,
        mettreAJour: setUtilisateur,
    }), [utilisateur, verification, connecter, deconnecter, oublier]);

    return (
        <SessionContext.Provider value={valeur}>
            {children}
            <ConnexionDialog open={dialogue} onClose={() => setDialogue(false)} onConnexion={connecter} />
            <Snackbar open={activation.ouverte} autoHideDuration={activation.succes ? 6000 : null} onClose={fermerActivation}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={activation.succes ? "success" : "error"} variant="filled" onClose={fermerActivation}>
                    {activation.message}
                </Alert>
            </Snackbar>
        </SessionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession(): Session {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("useSession doit être utilisé dans un SessionProvider.");
    }
    return session;
}
