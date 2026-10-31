import type { Duree, Experience, Interet, Preferences, Spr } from "../api/types";

/**
 * Portage de App\Services\Recommandation\LocalRecommender : les deux calculs doivent rester identiques.
 */
const MOTS_CLES_INTERETS: Record<Interet, string[]> = {
    archeologie: ["archeologie"],
    architecture: ["architecture", "urbain"],
    medieval: ["medieval", "chateau"],
    nature: ["nature"],
    religion: ["abbaye"],
    villages: ["promenade", "medieval"],
    jardins: ["nature", "promenade"],
};

const MOTS_CLES_EXPERIENCES: Record<Experience, string[]> = {
    balade: ["promenade", "nature"],
    decouverte: ["musee", "architecture"],
    visite_guidee: ["chateau", "abbaye", "musee"],
    exploration: ["archeologie", "chateau"],
    immersion: ["medieval", "abbaye"],
};

const DUREES_HEURES: Record<Duree, [number, number]> = {
    court: [0, 2],
    moyen: [2, 3],
    long: [3, 24],
};

const LIBELLES: Record<Interet | Experience, string> = {
    archeologie: "archéologie", architecture: "architecture", medieval: "médiéval",
    nature: "nature", religion: "patrimoine religieux", villages: "villages",
    jardins: "jardins", balade: "balade", decouverte: "découverte",
    visite_guidee: "visite guidée", exploration: "exploration", immersion: "immersion",
};

/** Convertit « 02:30:00 » en 2.5. */
export function heures(temps: string): number {
    const [h, m] = temps.split(":").map(Number);
    return h + (m || 0) / 60;
}

export function formaterDuree(nbHeures: number): string {
    const h = Math.floor(nbHeures);
    const m = Math.round((nbHeures - h) * 60);
    return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

function evaluer(preferences: Preferences, spr: Spr): { score: number; raison: string } {
    const motsCles = spr.mot_cle.trim().split(/\s+/);
    let points = 0;
    let maximum = 0;
    const retenus: string[] = [];

    const criteres: [string[], Record<string, string[]>, number][] = [
        [preferences.interets, MOTS_CLES_INTERETS, 3],
        [preferences.experiences, MOTS_CLES_EXPERIENCES, 2],
    ];
    for (const [choix, correspondances, poids] of criteres) {
        for (const cle of choix) {
            maximum += poids;
            if ((correspondances[cle] ?? []).some((mot) => motsCles.includes(mot))) {
                points += poids;
                retenus.push(LIBELLES[cle as Interet | Experience]);
            }
        }
    }

    const duree = heures(spr.temps_de_visite);
    const [min, max] = DUREES_HEURES[preferences.duree];
    const ecart = duree < min ? min - duree : Math.max(0, duree - max);
    maximum += 2;
    points += Math.max(0, 2 - ecart);

    const raisons: string[] = [];
    if (retenus.length > 0) {
        raisons.push(`Correspond à vos envies : ${retenus.join(", ")}.`);
    }
    raisons.push(`Visite de ${formaterDuree(duree)}${ecart === 0 ? ", comme vous le souhaitez." : "."}`);
    if (preferences.pmr) {
        raisons.push("Accessible aux personnes à mobilité réduite.");
    }

    return { score: Math.round((100 * points) / maximum), raison: raisons.join(" ") };
}

export function recommander(preferences: Preferences, sprs: Spr[], limite = 3) {
    return sprs
        .filter((spr) => (!preferences.pmr || spr.is_pmr) && spr.capacite_de_visite >= preferences.taille_groupe)
        .sort((a, b) => a.id - b.id)
        .map((spr) => ({ spr, ...evaluer(preferences, spr) }))
        .sort((a, b) => b.score - a.score || a.spr.id - b.spr.id)
        .slice(0, limite);
}
