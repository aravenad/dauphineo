import { heures, formaterDuree } from "../demo/recommandation";

export { heures, formaterDuree };

export const EMOJIS_MOTS_CLES: Record<string, string> = {
    archeologie: "🏺",
    architecture: "🏛️",
    nature: "🌳",
    abbaye: "⛪",
    chateau: "🏰",
    medieval: "🛡️",
    musee: "🖼️",
    promenade: "🚶",
    urbain: "🏙️",
};

const LIBELLES_MOTS_CLES: Record<string, string> = {
    archeologie: "Archéologie",
    architecture: "Architecture",
    nature: "Nature",
    abbaye: "Abbaye",
    chateau: "Château",
    medieval: "Médiéval",
    musee: "Musée",
    promenade: "Promenade",
    urbain: "Urbain",
};

export const MOTS_CLES = Object.keys(LIBELLES_MOTS_CLES);

export function motsCles(motCle: string): string[] {
    return motCle.trim().split(/\s+/).filter(Boolean);
}

export function libelleMotCle(motCle: string): string {
    return `${EMOJIS_MOTS_CLES[motCle] ?? "📍"} ${LIBELLES_MOTS_CLES[motCle] ?? motCle}`;
}

export function formaterMotsCles(motCle: string): string {
    return motsCles(motCle).map(libelleMotCle).join(", ");
}

/** « SAINT-ANTOINE-L'ABBAYE » devient « Saint-Antoine-L'Abbaye ». */
export function nomCommune(nom: string): string {
    return nom
        .toLocaleLowerCase("fr-FR")
        .replace(/(^|[\s'-])(\p{L})/gu, (_, separateur: string, lettre: string) => separateur + lettre.toLocaleUpperCase("fr-FR"));
}

/** Pour comparer sans accents, majuscules ni tirets. */
export function normaliser(texte: string): string {
    return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/-/g, " ").toLowerCase();
}

/** « 2026-11-02 » devient « lundi 2 novembre ». La date est lue en heure locale. */
export function formaterDate(date: string, options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
    const [annee, mois, jour] = date.slice(0, 10).split("-").map(Number);
    return new Date(annee, mois - 1, jour).toLocaleDateString("fr-FR", options);
}

/** « 08:00:00 » devient « 8 h », « 13:15:00 » devient « 13 h 15 ». */
export function formaterHeure(heure: string): string {
    const [h, m] = heure.split(":").map(Number);
    return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export function formaterPrix(prix: number): string {
    return prix.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
