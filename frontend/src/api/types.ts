export interface Image {
    id: number;
    image_url: string;
    id_spr: number;
    /** Crédit de la photo sur Wikimedia Commons. */
    auteur: string | null;
    licence: string | null;
    source: string | null;
}

export interface Spr {
    id: number;
    code_departement: number;
    nom_du_departement: string;
    nom_commune: string;
    capacite_de_visite: number;
    mot_cle: string;
    is_pmr: boolean;
    /** Au format « 02:30:00 ». */
    temps_de_visite: string;
    courte_description: string;
    longue_description: string;
    /** Traductions anglaises ; le français s'affiche quand elles manquent. */
    courte_description_en: string | null;
    longue_description_en: string | null;
    images: Image[];
}

export interface Top {
    plus_reserves: { id: number; reservations: number }[];
    mieux_notes: { id: number; note_moyenne: number }[];
}

/** Visite encore réservable, avec son créneau et son guide. */
export interface Visite {
    id: number;
    date_visite: string;
    capacite_actuelle: number;
    capacite_max: number;
    heure_debut: string;
    heure_fin: string;
    id_guide: number;
    guide_nom: string;
    guide_prenom: string;
}

export interface Avis {
    id: number;
    titre: string;
    commentaire: string;
    note: number;
    id_utilisateur: number;
    id_spr: number;
    created_at: string;
    utilisateur: { id: number; pseudo: string };
}

export interface NouvelAvis {
    titre: string;
    commentaire: string;
    note: number;
    id_spr: number;
}

export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    pseudo: string;
}

export interface Inscription {
    nom: string;
    prenom: string;
    email: string;
    mot_de_passe: string;
}

export interface ModificationUtilisateur {
    nom?: string;
    prenom?: string;
    email?: string;
    mot_de_passe?: string;
    /** Exigé par l'API pour changer d'adresse e-mail ou de mot de passe */
    mot_de_passe_actuel?: string;
}

/** Réponse identique que l'adresse ait déjà un compte ou non */
export interface DemandeInscription {
    message: string;
    /** Mode démo seulement : aucun e-mail n'est envoyé, le jeton d'activation est rendu directement */
    jetonDemo?: string;
}

export interface Connexion {
    user: Utilisateur;
    access_token: string;
}

export interface Reservation {
    id: number;
    prix: number;
    taille: number;
    date_visite: string;
    heure_debut: string;
    heure_fin: string;
    spr: { id: number; nom_commune: string };
    guide: { nom: string; prenom: string };
}

/** Thèmes du questionnaire : chacun est aussi un mot-clé des SPR. */
export type Theme = "antiquite" | "medieval" | "chateau" | "religieux" | "architecture" | "musee" | "nature";
/** Cadre de la visite : ville, village et montagne sont des mots-clés des SPR. */
export type Cadre = "ville" | "village" | "montagne" | "indifferent";
export type Duree = "court" | "moyen" | "long";
export type Langue = "fr" | "en";

export interface Preferences {
    taille_groupe: number;
    interets: Theme[];
    cadre: Cadre;
    duree: Duree;
    pmr: boolean;
    /** Langue des raisons rédigées par Claude. */
    langue?: Langue;
}

export interface Recommandations {
    /** « claude » quand Claude Haiku a rédigé les raisons, « local » sinon. */
    source: "claude" | "local";
    /**
     * criteres : clés des thèmes et du cadre choisis que le site satisfait.
     * raison : null quand Claude n'en a pas rédigé ; le site compose alors celle du moteur local.
     */
    recommandations: { spr: Spr; score: number; raison: string | null; criteres: string[] }[];
}

export interface Api {
    listSpr(): Promise<Spr[]>;
    getSpr(id: number): Promise<Spr>;
    topSpr(): Promise<Top>;
    visitesSpr(id: number): Promise<Visite[]>;
    avisSpr(id: number): Promise<Avis[]>;
    login(email: string, motDePasse: string): Promise<Connexion>;
    register(inscription: Inscription): Promise<DemandeInscription>;
    confirmerInscription(jeton: string): Promise<Connexion>;
    logout(): Promise<void>;
    me(): Promise<Utilisateur>;
    updateMe(modification: ModificationUtilisateur): Promise<Utilisateur>;
    deleteMe(motDePasse: string): Promise<void>;
    mesReservations(): Promise<Reservation[]>;
    reserver(idVisite: number, taille: number): Promise<Reservation>;
    annulerReservation(id: number): Promise<void>;
    publierAvis(avis: NouvelAvis): Promise<Avis>;
    supprimerAvis(id: number): Promise<void>;
    recommander(preferences: Preferences): Promise<Recommandations>;
}
