import { useEffect, useState } from "react";
import { messageErreur } from "./api";

interface Chargement<T> {
    donnees: T | null;
    erreur: string | null;
    chargement: boolean;
    recharger: () => void;
}

/** Charge une donnée de l'API et ignore les réponses arrivées après un changement de dépendances. */
export function useApi<T>(charger: () => Promise<T>, dependances: unknown[]): Chargement<T> {
    const [etat, setEtat] = useState<{ donnees: T | null; erreur: string | null; chargement: boolean }>({
        donnees: null,
        erreur: null,
        chargement: true,
    });
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let actif = true;
        setEtat((precedent) => ({ ...precedent, chargement: true, erreur: null }));
        charger()
            .then((donnees) => actif && setEtat({ donnees, erreur: null, chargement: false }))
            .catch((erreur) => actif && setEtat({ donnees: null, erreur: messageErreur(erreur), chargement: false }));
        return () => {
            actif = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependances, version]);

    return { ...etat, recharger: () => setVersion((v) => v + 1) };
}

/** Donne à l'onglet le titre de la page, ou celui du site quand il n'est pas encore connu. */
export function useTitre(titre?: string) {
    useEffect(() => {
        document.title = titre ? `${titre} | Dauphinéo` : "Dauphinéo";
        return () => {
            document.title = "Dauphinéo";
        };
    }, [titre]);
}
