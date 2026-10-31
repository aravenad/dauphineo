import type { SprClasse } from "../api";

export interface Filtres {
    recherche: string;
    motsCles: string[];
    /** Durée maximale en heures ; DUREE_MAX signifie « sans limite ». */
    dureeMax: number;
    pmr: boolean;
}

export const DUREE_MAX = 5;

export const FILTRES_VIDES: Filtres = { recherche: "", motsCles: [], dureeMax: DUREE_MAX, pmr: false };

/** Ordre de l'explorateur, gardé dans l'adresse (?tri=note) pour que l'accueil puisse y renvoyer. */
export type Tri = "nom" | "note" | "reservations";

export const TRIS: Tri[] = ["nom", "note", "reservations"];

export function lireTri(valeur: string | null): Tri {
    return TRIS.find((tri) => tri === valeur) ?? "nom";
}

/** Les ex aequo passent par le nombre d'avis puis le nom : l'accueil et l'explorateur montrent le même ordre. */
export function trier(sprs: SprClasse[], tri: Tri): SprClasse[] {
    const parNom = (a: SprClasse, b: SprClasse) => a.nom_commune.localeCompare(b.nom_commune, "fr");
    return [...sprs].sort((a, b) => {
        if (tri === "note") return (b.note_moyenne ?? 0) - (a.note_moyenne ?? 0) || b.nb_avis - a.nb_avis || parNom(a, b);
        if (tri === "reservations") return b.reservations - a.reservations || parNom(a, b);
        return parNom(a, b);
    });
}
