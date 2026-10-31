import sprCsv from "../../../backend/database/data/spr.csv?raw";
import imagesCsv from "../../../backend/database/data/images.csv?raw";
import guidesCsv from "../../../backend/database/data/guides.csv?raw";
import avisCsv from "../../../backend/database/data/avis.csv?raw";
import { lireCsv } from "./csv";
import type { Spr, Visite } from "../api/types";

/** Mêmes règles que DatabaseSeeder et les triggers PostgreSQL du backend. */
const JOURS_OUVERTS = 21;

export { MAX_A_VENIR_PAR_COMPTE, MOT_DE_PASSE_DEMO, PRIX_PAR_PERSONNE } from "./constantes";

export const COMPTES_DEMO = [
    { nom: "Démo", prenom: "Compte", email: "demo@dauphineo.test", pseudo: "demo" },
    { nom: "Dupont", prenom: "Jean", email: "jean.dupont@dauphineo.test", pseudo: "jeandupont" },
    { nom: "Durand", prenom: "Claire", email: "claire.durand@dauphineo.test", pseudo: "clairedu" },
    { nom: "Lefèvre", prenom: "Sophie", email: "sophie.lefevre@dauphineo.test", pseudo: "sophiel" },
];

export const RESERVATIONS_DEMO: [pseudo: string, idSpr: number, taille: number][] = [
    ["jeandupont", 18, 4], ["clairedu", 18, 2], ["sophiel", 18, 3],
    ["jeandupont", 13, 2], ["sophiel", 13, 5],
    ["clairedu", 3, 2], ["demo", 3, 2],
    ["sophiel", 15, 4],
];

const images = lireCsv(imagesCsv).map((ligne) => ({
    id: Number(ligne.id),
    image_url: ligne.image_url,
    id_spr: Number(ligne.id_spr),
    auteur: ligne.auteur,
    licence: ligne.licence,
    source: ligne.source,
}));

export const SPR: Spr[] = lireCsv(sprCsv).map((ligne) => ({
    id: Number(ligne.id),
    code_departement: Number(ligne.code_departement),
    nom_du_departement: ligne.nom_du_departement,
    nom_commune: ligne.nom_commune,
    capacite_de_visite: Number(ligne.capacite_de_visite),
    mot_cle: ligne.mot_cle,
    is_pmr: ligne.is_pmr === "true",
    temps_de_visite: ligne.temps_de_visite,
    courte_description: ligne.courte_description,
    longue_description: ligne.longue_description,
    images: images.filter((image) => image.id_spr === Number(ligne.id)),
}));

const GUIDES = lireCsv(guidesCsv).map((ligne) => ({
    id: Number(ligne.id),
    nom: ligne.nom,
    prenom: ligne.prenom,
    id_spr: Number(ligne.id_spr),
}));

export const AVIS_DEMO = lireCsv(avisCsv).map((ligne) => ({
    pseudo: ligne.pseudo,
    id_spr: Number(ligne.id_spr),
    note: Number(ligne.note),
    titre: ligne.titre,
    commentaire: ligne.commentaire,
}));

interface Creneau {
    id: number;
    id_spr: number;
    heure_debut: string;
    heure_fin: string;
}

function minutes(temps: string): number {
    const [h, m] = temps.split(":").map(Number);
    return h * 60 + (m || 0);
}

function horaire(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/** Reprend generate_creneaux() : de 8 h à 18 h, 15 min entre deux visites, une heure de pause à partir de 11 h. */
function genererCreneaux(): Creneau[] {
    const creneaux: Creneau[] = [];
    for (const spr of SPR) {
        const duree = minutes(spr.temps_de_visite);
        if (duree <= 0) continue;
        let debut = 8 * 60;
        let pausePrise = false;
        for (;;) {
            if (!pausePrise && debut >= 11 * 60) {
                debut += debut === 8 * 60 ? 60 : 45;
                pausePrise = true;
            }
            if (debut + duree > 18 * 60) break;
            creneaux.push({ id: creneaux.length + 1, id_spr: spr.id, heure_debut: horaire(debut), heure_fin: horaire(debut + duree) });
            debut += duree + 15;
        }
    }
    return creneaux;
}

const CRENEAUX = genererCreneaux();

/** Date locale au format AAAA-MM-JJ. */
export function dateLocale(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function aujourdhui(): string {
    return dateLocale(new Date());
}

let cache: { jour: string; visites: (Visite & { id_spr: number })[] } | null = null;

/**
 * Visites des 21 prochains jours, comme seedDisponibilites() : un jour sur deux par guide,
 * sur tous les créneaux de son SPR. Les identifiants ne dépendent pas de la date du jour.
 * La capacité restante est calculée à part, à partir des réservations.
 */
export function visitesOuvertes(): (Visite & { id_spr: number })[] {
    const jour = aujourdhui();
    if (cache?.jour === jour) return cache.visites;

    const visites: (Visite & { id_spr: number })[] = [];
    for (const guide of GUIDES) {
        const capacite = SPR.find((spr) => spr.id === guide.id_spr)?.capacite_de_visite ?? 0;
        for (let decalage = 1; decalage <= JOURS_OUVERTS; decalage++) {
            if ((decalage + guide.id) % 2 !== 0) continue;
            const date = new Date();
            date.setDate(date.getDate() + decalage);
            for (const creneau of CRENEAUX.filter((c) => c.id_spr === guide.id_spr)) {
                visites.push({
                    id: visites.length + 1,
                    id_spr: guide.id_spr,
                    date_visite: dateLocale(date),
                    capacite_actuelle: capacite,
                    capacite_max: capacite,
                    heure_debut: creneau.heure_debut,
                    heure_fin: creneau.heure_fin,
                    id_guide: guide.id,
                    guide_nom: guide.nom,
                    guide_prenom: guide.prenom,
                });
            }
        }
    }
    cache = { jour, visites };
    return visites;
}
