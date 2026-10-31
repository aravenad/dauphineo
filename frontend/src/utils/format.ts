import { locale, traduire } from "../i18n";
import { ecartDuree, heures, formaterDuree } from "../demo/recommandation";

export { ecartDuree, heures, formaterDuree };

export const EMOJIS_MOTS_CLES: Record<string, string> = {
    antiquite: "🏺",
    medieval: "🛡️",
    chateau: "🏰",
    religieux: "⛪",
    architecture: "🏛️",
    musee: "🖼️",
    nature: "🌳",
    ville: "🏙️",
    village: "🏘️",
    montagne: "⛰️",
};

const LIBELLES_MOTS_CLES: { fr: Record<string, string>; en: Record<string, string> } = {
    fr: {
        antiquite: "Antiquité",
        medieval: "Moyen Âge",
        chateau: "Château",
        religieux: "Patrimoine religieux",
        architecture: "Architecture",
        musee: "Musée",
        nature: "Nature",
        ville: "Ville",
        village: "Village",
        montagne: "Montagne",
    },
    en: {
        antiquite: "Antiquity",
        medieval: "Middle Ages",
        chateau: "Castle",
        religieux: "Religious heritage",
        architecture: "Architecture",
        musee: "Museum",
        nature: "Nature",
        ville: "Town",
        village: "Village",
        montagne: "Mountains",
    },
};

export const MOTS_CLES = Object.keys(EMOJIS_MOTS_CLES);

export function motsCles(motCle: string): string[] {
    return motCle.trim().split(/\s+/).filter(Boolean);
}

/** Libellé seul, sans emoji : « Moyen Âge ». */
export function nomMotCle(motCle: string): string {
    return traduire(LIBELLES_MOTS_CLES)[motCle] ?? motCle;
}

export function libelleMotCle(motCle: string): string {
    return `${EMOJIS_MOTS_CLES[motCle] ?? "📍"} ${nomMotCle(motCle)}`;
}

export function formaterMotsCles(motCle: string): string {
    return motsCles(motCle).map(libelleMotCle).join(", ");
}

/** Mots de liaison laissés en minuscules dans un nom composé, comme « Saint-Baudille-de-la-Tour ». */
const LIAISONS = new Set(["au", "aux", "de", "des", "du", "en", "et", "la", "le", "les", "lès", "sous", "sur"]);

function majuscule(mot: string): string {
    return mot.replace(/(^|[\s'])(\p{L})/gu, (_, separateur: string, lettre: string) => separateur + lettre.toLocaleUpperCase("fr-FR"));
}

/** « SAINT-ANTOINE-L'ABBAYE » devient « Saint-Antoine-l'Abbaye », « HIÈRES-SUR-AMBY » devient « Hières-sur-Amby ». */
export function nomCommune(nom: string): string {
    return nom
        .toLocaleLowerCase("fr-FR")
        .split("-")
        .map((partie, i) => {
            if (i === 0) return majuscule(partie);
            if (LIAISONS.has(partie)) return partie;
            // Élision : « l'abbaye » devient « l'Abbaye »
            const elision = /^([ld]')(.+)$/u.exec(partie);
            return elision ? elision[1] + majuscule(elision[2]) : majuscule(partie);
        })
        .join("-");
}

/** Pour comparer sans accents, majuscules ni tirets. */
export function normaliser(texte: string): string {
    return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ").toLowerCase();
}

/** « 2026-11-02 » devient « lundi 2 novembre » (« Monday 2 November » en anglais). La date est lue en heure locale. */
export function formaterDate(date: string, options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
    const [annee, mois, jour] = date.slice(0, 10).split("-").map(Number);
    return new Date(annee, mois - 1, jour).toLocaleDateString(locale(), options);
}

/** « 08:00:00 » devient « 8 h », « 13:15:00 » devient « 13 h 15 » ; en anglais « 8:00 » et « 13:15 ». */
export function formaterHeure(heure: string): string {
    const [h, m] = heure.split(":").map(Number);
    if (locale() !== "fr-FR") return `${h}:${String(m).padStart(2, "0")}`;
    return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export function formaterPrix(prix: number): string {
    return prix.toLocaleString(locale(), { style: "currency", currency: "EUR" });
}
