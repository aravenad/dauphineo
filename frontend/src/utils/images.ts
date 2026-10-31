/**
 * Les photos viennent de Wikimedia Commons en 1280 px de large, soit 300 à 600 ko chacune.
 * Wikimedia sert la même image à d'autres largeurs en changeant le préfixe « 1280px- », mais
 * seulement aux largeurs standard : toute autre largeur renvoie une erreur 400.
 */
const LARGEURS = [120, 330, 500, 960, 1280] as const;

export type Largeur = (typeof LARGEURS)[number];

const PREFIXE = /\/\d+px-([^/]+)$/;

export function vignette(url: string, largeur: Largeur): string {
    return url.replace(PREFIXE, `/${largeur}px-$1`);
}

/** Attributs src, srcSet et sizes : le navigateur choisit la plus petite version assez nette */
export function attributsImage(url: string, sizes: string, largeurs: readonly Largeur[] = LARGEURS) {
    if (!PREFIXE.test(url)) return { src: url };
    return {
        src: vignette(url, largeurs[largeurs.length - 1]),
        srcSet: largeurs.map((l) => `${vignette(url, l)} ${l}w`).join(", "),
        sizes,
    };
}
