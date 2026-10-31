import { traduire } from "../i18n";

/** Règles partagées par l'inscription, le profil et le changement de mot de passe. */

export function erreurNom(valeur: string, champ: "nom" | "prenom"): string {
    const texte = valeur.trim();
    const t = traduire({
        fr: {
            nom: champ === "nom" ? "Le nom" : "Le prénom",
            requis: "est requis.",
            lettres: "ne peut contenir que des lettres, des tirets, des apostrophes et des espaces.",
            court: "doit contenir au moins 2 caractères.",
            long: "ne peut pas dépasser 50 caractères.",
        },
        en: {
            nom: champ === "nom" ? "Last name" : "First name",
            requis: "is required.",
            lettres: "may only contain letters, hyphens, apostrophes and spaces.",
            court: "must be at least 2 characters long.",
            long: "may not be longer than 50 characters.",
        },
    });
    if (!texte) return `${t.nom} ${t.requis}`;
    if (!/^\p{L}+(?:[-' ]\p{L}+)*$/u.test(texte)) return `${t.nom} ${t.lettres}`;
    if (texte.length < 2) return `${t.nom} ${t.court}`;
    if (texte.length > 50) return `${t.nom} ${t.long}`;
    return "";
}

export function erreurEmail(valeur: string): string {
    const t = traduire({
        fr: { requise: "L'adresse e-mail est requise.", invalide: "Entrez une adresse e-mail valide." },
        en: { requise: "The email address is required.", invalide: "Enter a valid email address." },
    });
    if (!valeur.trim()) return t.requise;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim()) ? "" : t.invalide;
}

export function erreurMotDePasse(valeur: string): string {
    const t = traduire({
        fr: {
            longueur: "Le mot de passe doit contenir au moins 8 caractères.",
            majuscule: "Le mot de passe doit contenir au moins une majuscule.",
            minuscule: "Le mot de passe doit contenir au moins une minuscule.",
            chiffre: "Le mot de passe doit contenir au moins un chiffre.",
            special: "Le mot de passe doit contenir au moins un caractère spécial.",
        },
        en: {
            longueur: "The password must be at least 8 characters long.",
            majuscule: "The password must contain at least one uppercase letter.",
            minuscule: "The password must contain at least one lowercase letter.",
            chiffre: "The password must contain at least one digit.",
            special: "The password must contain at least one special character.",
        },
    });
    if (valeur.length < 8) return t.longueur;
    if (!/[A-Z]/.test(valeur)) return t.majuscule;
    if (!/[a-z]/.test(valeur)) return t.minuscule;
    if (!/[0-9]/.test(valeur)) return t.chiffre;
    if (!/[^A-Za-z0-9]/.test(valeur)) return t.special;
    return "";
}
