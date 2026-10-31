/**
 * Lit les CSV de backend/database/data, ceux qui remplissent aussi la base PostgreSQL.
 * Séparateur « ; », une ligne d'en-tête, aucun champ entre guillemets.
 */
export function lireCsv(texte: string): Record<string, string>[] {
    const [entete, ...lignes] = texte.trim().split(/\r?\n/).map((ligne) => ligne.split(";"));
    return lignes
        .filter((valeurs) => valeurs.length === entete.length)
        .map((valeurs) => Object.fromEntries(entete.map((colonne, i) => [colonne, valeurs[i]])));
}
