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
    const [version, setVersion] = useState(0);
    const cle = [...dependances, version];
    // La réponse garde la clé de sa requête : tant qu'elle ne correspond pas aux dépendances actuelles, le chargement est en cours
    const [etat, setEtat] = useState<{ cle: unknown[] | null; donnees: T | null; erreur: string | null }>({
        cle: null,
        donnees: null,
        erreur: null,
    });

    useEffect(() => {
        let actif = true;
        charger()
            .then((donnees) => actif && setEtat({ cle, donnees, erreur: null }))
            .catch((erreur) => actif && setEtat({ cle, donnees: null, erreur: messageErreur(erreur) }));
        return () => {
            actif = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, cle);

    const aJour = etat.cle !== null && etat.cle.length === cle.length && etat.cle.every((valeur, i) => Object.is(valeur, cle[i]));
    return {
        donnees: etat.donnees,
        erreur: aJour ? etat.erreur : null,
        chargement: !aJour,
        recharger: () => setVersion((v) => v + 1),
    };
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
