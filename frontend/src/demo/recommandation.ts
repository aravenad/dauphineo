import { langueActuelle } from "../i18n";
import type { Duree, Preferences, Spr, Theme } from "../api/types";

/**
 * Portage de App\Services\Recommandation\LocalRecommender : les deux calculs doivent rester identiques.
 */
const THEMES: Theme[] = ["antiquite", "medieval", "chateau", "religieux", "architecture", "musee", "nature"];

const POIDS_THEME = 3;
const POIDS_CADRE = 3;
const POIDS_DUREE = 2;

const DUREES_HEURES: Record<Duree, [number, number]> = {
    court: [0, 2],
    moyen: [2, 3],
    long: [3, 24],
};

/** Convertit « 02:30:00 » en 2.5. */
export function heures(temps: string): number {
    const [h, m] = temps.split(":").map(Number);
    return h + (m || 0) / 60;
}

export function formaterDuree(nbHeures: number): string {
    const h = Math.floor(nbHeures);
    const m = Math.round((nbHeures - h) * 60);
    if (langueActuelle() === "en") return m === 0 ? `${h} h` : `${h} h ${m} min`;
    return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

/** Heures entre la durée de visite du SPR et la plage voulue, 0 si elle y est. */
export function ecartDuree(duree: Duree, temps: string): number {
    const nbHeures = heures(temps);
    const [min, max] = DUREES_HEURES[duree];
    return nbHeures < min ? min - nbHeures : Math.max(0, nbHeures - max);
}

/** Score sur 100, part des thèmes du site choisis par le visiteur, et réponses que le SPR satisfait. */
function evaluer(preferences: Preferences, spr: Spr): { score: number; focus: number; criteres: string[] } {
    const motsCles = spr.mot_cle.trim().split(/\s+/);

    const themes = preferences.interets.filter((theme) => motsCles.includes(theme));
    let points = POIDS_THEME * themes.length;
    let maximum = POIDS_THEME * preferences.interets.length;
    const criteres: string[] = [...themes];

    if (preferences.cadre !== "indifferent") {
        maximum += POIDS_CADRE;
        if (motsCles.includes(preferences.cadre)) {
            points += POIDS_CADRE;
            criteres.push(preferences.cadre);
        }
    }

    maximum += POIDS_DUREE;
    points += Math.max(0, POIDS_DUREE - ecartDuree(preferences.duree, spr.temps_de_visite));

    const themesDuSite = THEMES.filter((theme) => motsCles.includes(theme)).length;

    return {
        score: Math.round((100 * points) / maximum),
        focus: themesDuSite === 0 ? 0 : themes.length / themesDuSite,
        criteres,
    };
}

export function recommander(preferences: Preferences, sprs: Spr[], limite = 6) {
    return sprs
        .filter((spr) => (!preferences.pmr || spr.is_pmr) && spr.capacite_de_visite >= preferences.taille_groupe)
        .map((spr) => ({ spr, ...evaluer(preferences, spr) }))
        .sort((a, b) => b.score - a.score || b.focus - a.focus || a.spr.id - b.spr.id)
        .slice(0, limite)
        .map(({ spr, score, criteres }) => ({ spr, score, raison: null, criteres }));
}
