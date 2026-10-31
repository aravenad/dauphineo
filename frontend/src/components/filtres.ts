export interface Filtres {
    recherche: string;
    motsCles: string[];
    /** Durée maximale en heures ; DUREE_MAX signifie « sans limite ». */
    dureeMax: number;
    pmr: boolean;
}

export const DUREE_MAX = 5;

export const FILTRES_VIDES: Filtres = { recherche: "", motsCles: [], dureeMax: DUREE_MAX, pmr: false };
