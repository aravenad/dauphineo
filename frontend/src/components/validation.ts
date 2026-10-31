/** Règles partagées par l'inscription, le profil et le changement de mot de passe. */

export function erreurNom(valeur: string, champ: "nom" | "prénom"): string {
    const texte = valeur.trim();
    if (!texte) return `Le ${champ} est requis.`;
    if (!/^\p{L}+(?:[-' ]\p{L}+)*$/u.test(texte)) {
        return `Le ${champ} ne peut contenir que des lettres, des tirets, des apostrophes et des espaces.`;
    }
    if (texte.length < 2) return `Le ${champ} doit contenir au moins 2 caractères.`;
    if (texte.length > 50) return `Le ${champ} ne peut pas dépasser 50 caractères.`;
    return "";
}

export function erreurEmail(valeur: string): string {
    if (!valeur.trim()) return "L'adresse e-mail est requise.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim()) ? "" : "Entrez une adresse e-mail valide.";
}

export function erreurMotDePasse(valeur: string): string {
    if (valeur.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/[A-Z]/.test(valeur)) return "Le mot de passe doit contenir au moins une majuscule.";
    if (!/[a-z]/.test(valeur)) return "Le mot de passe doit contenir au moins une minuscule.";
    if (!/[0-9]/.test(valeur)) return "Le mot de passe doit contenir au moins un chiffre.";
    if (!/[^A-Za-z0-9]/.test(valeur)) return "Le mot de passe doit contenir au moins un caractère spécial.";
    return "";
}
