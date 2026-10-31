import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Langue = "fr" | "en";

const CLE_STOCKAGE = "dauphineo.langue";

function langueEnregistree(): Langue {
    try {
        const langue = localStorage.getItem(CLE_STOCKAGE);
        if (langue === "fr" || langue === "en") return langue;
    } catch {
        // Stockage bloqué (navigation privée, cookies refusés) : le site reste en français
    }
    return "fr";
}

// Copie hors de React, pour ce qui n'est pas un composant : en-tête des requêtes, formats de date et de prix
let courante: Langue = langueEnregistree();

// eslint-disable-next-line react-refresh/only-export-components
export function langueActuelle(): Langue {
    return courante;
}

/** Locale des formats : l'anglais britannique garde le jour avant le mois et l'euro. */
// eslint-disable-next-line react-refresh/only-export-components
export function locale(): string {
    return courante === "en" ? "en-GB" : "fr-FR";
}

/** Textes dans les deux langues ; l'anglais doit avoir exactement les mêmes clés que le français. */
export interface Textes<T> {
    fr: T;
    en: NoInfer<T>;
}

/** Pour le code hors composant, appelé pendant le rendu. */
// eslint-disable-next-line react-refresh/only-export-components
export function traduire<T>(textes: Textes<T>): T {
    return textes[courante];
}

interface ContexteLangue {
    langue: Langue;
    changerLangue: (langue: Langue) => void;
}

const LangueContext = createContext<ContexteLangue | null>(null);

export function LangueProvider({ children }: { children: ReactNode }) {
    const [langue, setLangue] = useState(courante);

    useEffect(() => {
        document.documentElement.lang = langue;
    }, [langue]);

    const changerLangue = useCallback((nouvelle: Langue) => {
        courante = nouvelle;
        try {
            localStorage.setItem(CLE_STOCKAGE, nouvelle);
        } catch {
            // Le choix vaut alors pour cette visite seulement
        }
        setLangue(nouvelle);
    }, []);

    const valeur = useMemo(() => ({ langue, changerLangue }), [langue, changerLangue]);
    return <LangueContext.Provider value={valeur}>{children}</LangueContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLangue(): ContexteLangue {
    const contexte = useContext(LangueContext);
    if (!contexte) {
        throw new Error("useLangue doit être utilisé dans un LangueProvider.");
    }
    return contexte;
}

/** Textes d'un composant dans la langue choisie ; il se redessine quand elle change. */
// eslint-disable-next-line react-refresh/only-export-components
export function useTextes<T>(textes: Textes<T>): T {
    return textes[useLangue().langue];
}
