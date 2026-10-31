import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import api, { ApiError, type Connexion, type Utilisateur } from "./api";
import { enregistrerToken, lireToken } from "./api/token";
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
