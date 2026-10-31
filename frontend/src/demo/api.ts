import { ApiError } from "../api/erreurs";
import { lireToken } from "../api/token";
import type { Api, Avis, Reservation, Utilisateur } from "../api/types";
import {
    AVIS_DEMO, COMPTES_DEMO, MAX_A_VENIR_PAR_COMPTE, MOT_DE_PASSE_DEMO, PRIX_PAR_PERSONNE, RESERVATIONS_DEMO, SPR,
    aujourdhui, visitesOuvertes,
} from "./donnees";
import { recommander } from "./recommandation";

/**
 * Rejoue l'API Laravel dans le navigateur pour la démo GitHub Pages.
 * Les données de départ viennent des CSV du backend ; les changements restent dans le localStorage.
 */

interface UtilisateurDemo extends Utilisateur {
    empreinte: string;
}

interface ReservationDemo {
    id: number;
    id_utilisateur: number;
    id_visite: number;
    id_spr: number;
    date_visite: string;
    taille: number;
}

interface InscriptionDemo {
    nom: string;
    prenom: string;
    email: string;
    empreinte: string;
    expire: number;
}

interface Etat {
    version: 1;
    prochainId: number;
    utilisateurs: UtilisateurDemo[];
    reservations: ReservationDemo[];
    avis: Avis[];
    sessions: Record<string, number>;
    /** Demandes d'inscription en attente d'activation, absentes des sauvegardes plus anciennes */
    inscriptions?: Record<string, InscriptionDemo>;
}

const DUREE_LIEN_MS = 24 * 60 * 60 * 1000;
const MESSAGE_INSCRIPTION = "Si cette adresse peut être utilisée, un e-mail vient d'y être envoyé. Ouvrez le lien qu'il contient pour activer votre compte.";

const CLE = "dauphineo.demo";

async function empreinte(motDePasse: string): Promise<string> {
    const octets = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`dauphineo:${motDePasse}`));
    return Array.from(new Uint8Array(octets), (o) => o.toString(16).padStart(2, "0")).join("");
}

async function verifierMotDePasse(utilisateur: UtilisateurDemo, motDePasse: string | undefined): Promise<void> {
    if (!motDePasse || (await empreinte(motDePasse)) !== utilisateur.empreinte) {
        throw new ApiError(422, "Le mot de passe actuel est incorrect.");
    }
}

async function etatInitial(): Promise<Etat> {
    const empreinteDemo = await empreinte(MOT_DE_PASSE_DEMO);
    const utilisateurs = COMPTES_DEMO.map((compte, i) => ({ id: i + 1, ...compte, empreinte: empreinteDemo }));
    const idDe = (pseudo: string) => utilisateurs.find((u) => u.pseudo === pseudo)!.id;
    const maintenant = new Date().toISOString();

    const avis: Avis[] = AVIS_DEMO.map((ligne, i) => ({
        id: i + 1,
        titre: ligne.titre,
        commentaire: ligne.commentaire,
        note: ligne.note,
        id_utilisateur: idDe(ligne.pseudo),
        id_spr: ligne.id_spr,
        created_at: maintenant,
        utilisateur: { id: idDe(ligne.pseudo), pseudo: ligne.pseudo },
    }));

    // Comme le seeder : chaque réservation porte sur la première visite du SPR
    const reservations = RESERVATIONS_DEMO.map(([pseudo, idSpr, taille], i) => {
        const visite = visitesOuvertes().find((v) => v.id_spr === idSpr)!;
        return { id: i + 1, id_utilisateur: idDe(pseudo), id_visite: visite.id, id_spr: idSpr, date_visite: visite.date_visite, taille };
    });

    return { version: 1, prochainId: 1000, utilisateurs, reservations, avis, sessions: {} };
}

let etat: Etat | null = null;

async function charger(): Promise<Etat> {
    if (etat) return etat;
    try {
        const sauvegarde = JSON.parse(localStorage.getItem(CLE) ?? "null") as Etat | null;
        if (sauvegarde?.version === 1) {
            etat = sauvegarde;
            return etat;
        }
    } catch {
        // Stockage illisible ou indisponible : on repart des données de départ
    }
    etat = await etatInitial();
    return etat;
}

function sauvegarder(nouvelEtat: Etat): void {
    try {
        localStorage.setItem(CLE, JSON.stringify(nouvelEtat));
    } catch {
        // Sans stockage, les changements durent jusqu'au rechargement de la page
    }
}

function public_(utilisateur: UtilisateurDemo): Utilisateur {
    const { id, nom, prenom, email, pseudo } = utilisateur;
    return { id, nom, prenom, email, pseudo };
}

async function connecte(): Promise<{ etat: Etat; utilisateur: UtilisateurDemo }> {
    const e = await charger();
    const token = lireToken();
    const utilisateur = token ? e.utilisateurs.find((u) => u.id === e.sessions[token]) : undefined;
    if (!utilisateur) {
        throw new ApiError(401, "Votre session a expiré. Veuillez vous reconnecter.");
    }
    return { etat: e, utilisateur };
}

function ouvrirSession(e: Etat, utilisateur: UtilisateurDemo) {
    const token = `demo-${crypto.randomUUID()}`;
    e.sessions[token] = utilisateur.id;
    sauvegarder(e);
    return { user: public_(utilisateur), access_token: token };
}

function placesRestantes(e: Etat, idVisite: number, date: string, capaciteMax: number): number {
    return capaciteMax - e.reservations
        .filter((r) => r.id_visite === idVisite && r.date_visite === date)
        .reduce((total, r) => total + r.taille, 0);
}

function enReservation(reservation: ReservationDemo): Reservation {
    const spr = SPR.find((s) => s.id === reservation.id_spr)!;
    const visite = visitesOuvertes().find((v) => v.id === reservation.id_visite);
    return {
        id: reservation.id,
        prix: reservation.taille * PRIX_PAR_PERSONNE,
        taille: reservation.taille,
        date_visite: reservation.date_visite,
        // Une visite passée n'est plus générée : on garde au moins la date
        heure_debut: visite?.date_visite === reservation.date_visite ? visite.heure_debut : "",
        heure_fin: visite?.date_visite === reservation.date_visite ? visite.heure_fin : "",
        spr: { id: spr.id, nom_commune: spr.nom_commune },
        guide: { nom: visite?.guide_nom ?? "", prenom: visite?.guide_prenom ?? "" },
    };
}

function sprOu404(id: number) {
    const spr = SPR.find((s) => s.id === id);
    if (!spr) throw new ApiError(404, "Ce site est introuvable.");
    return spr;
}

function pseudoLibre(e: Etat, prenom: string): string {
    const base = prenom.normalize("NFD").replace(/[^A-Za-z]/g, "").toLowerCase() || "membre";
    let pseudo = base;
    for (let n = 2; e.utilisateurs.some((u) => u.pseudo === pseudo); n++) {
        pseudo = `${base}${n}`;
    }
    return pseudo;
}

const demo: Api = {
    listSpr: async () => SPR,
    getSpr: async (id) => sprOu404(id),
    topSpr: async () => {
        const e = await charger();
        const plusReserves = SPR
            .map((spr) => ({ id: spr.id, reservations: e.reservations.filter((r) => r.id_spr === spr.id).length }))
            .filter((s) => s.reservations > 0)
            .sort((a, b) => b.reservations - a.reservations || a.id - b.id)
            .slice(0, 3);
        const mieuxNotes = SPR
            .map((spr) => {
                const notes = e.avis.filter((a) => a.id_spr === spr.id).map((a) => a.note);
                return { id: spr.id, note_moyenne: notes.length ? notes.reduce((x, y) => x + y, 0) / notes.length : 0 };
            })
            .filter((s) => s.note_moyenne > 0)
            .sort((a, b) => b.note_moyenne - a.note_moyenne || a.id - b.id)
            .slice(0, 3);
        return { plus_reserves: plusReserves, mieux_notes: mieuxNotes };
    },
    visitesSpr: async (id) => {
        sprOu404(id);
        const e = await charger();
        return visitesOuvertes()
            .filter((v) => v.id_spr === id)
            .map(({ id_spr, ...visite }) => ({
                ...visite,
                capacite_actuelle: placesRestantes(e, visite.id, visite.date_visite, visite.capacite_max),
            }))
            .sort((a, b) => (a.date_visite + a.heure_debut).localeCompare(b.date_visite + b.heure_debut));
    },
    avisSpr: async (id) => {
        sprOu404(id);
        const e = await charger();
        return e.avis.filter((a) => a.id_spr === id).sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);
    },
    login: async (email, motDePasse) => {
        const e = await charger();
        const utilisateur = e.utilisateurs.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!utilisateur || utilisateur.empreinte !== (await empreinte(motDePasse))) {
            throw new ApiError(401, "Identifiants invalides.");
        }
        return ouvrirSession(e, utilisateur);
    },
    // Comme l'API : même réponse pour une adresse connue ou non, le compte n'existe qu'après activation
    register: async (inscription) => {
        const e = await charger();
        const jeton = crypto.randomUUID();
        e.inscriptions = { ...e.inscriptions, [jeton]: {
            nom: inscription.nom,
            prenom: inscription.prenom,
            email: inscription.email.trim(),
            empreinte: await empreinte(inscription.mot_de_passe),
            expire: Date.now() + DUREE_LIEN_MS,
        } };
        sauvegarder(e);
        return { message: MESSAGE_INSCRIPTION, jetonDemo: jeton };
    },
    confirmerInscription: async (jeton) => {
        const e = await charger();
        const inscription = e.inscriptions?.[jeton];
        if (!inscription) {
            throw new ApiError(422, "Ce lien d'activation n'est pas valide. Vérifiez qu'il a été copié en entier.");
        }
        if (inscription.expire < Date.now()) {
            throw new ApiError(422, "Ce lien d'activation a expiré. Inscrivez-vous de nouveau pour en recevoir un autre.");
        }
        if (e.utilisateurs.some((u) => u.email.toLowerCase() === inscription.email.toLowerCase())) {
            throw new ApiError(409, "Ce compte est déjà activé. Connectez-vous avec votre adresse e-mail et votre mot de passe.");
        }
        const utilisateur: UtilisateurDemo = {
            id: e.prochainId++,
            nom: inscription.nom,
            prenom: inscription.prenom,
            email: inscription.email,
            pseudo: pseudoLibre(e, inscription.prenom),
            empreinte: inscription.empreinte,
        };
        e.utilisateurs.push(utilisateur);
        return ouvrirSession(e, utilisateur);
    },
    logout: async () => {
        const e = await charger();
        const token = lireToken();
        if (token) delete e.sessions[token];
        sauvegarder(e);
    },
    me: async () => public_((await connecte()).utilisateur),
    updateMe: async (modification) => {
        const { etat: e, utilisateur } = await connecte();
        const email = modification.email?.trim();
        const nouvelEmail = Boolean(email) && email!.toLowerCase() !== utilisateur.email.toLowerCase();
        if (modification.mot_de_passe || nouvelEmail) await verifierMotDePasse(utilisateur, modification.mot_de_passe_actuel);
        if (email && e.utilisateurs.some((u) => u.id !== utilisateur.id && u.email.toLowerCase() === email.toLowerCase())) {
            throw new ApiError(422, "Cette adresse e-mail est déjà utilisée.");
        }
        if (modification.nom) utilisateur.nom = modification.nom;
        if (modification.prenom) utilisateur.prenom = modification.prenom;
        if (email) utilisateur.email = email;
        if (modification.mot_de_passe) {
            utilisateur.empreinte = await empreinte(modification.mot_de_passe);
            // Comme l'API : les autres sessions ouvertes sont fermées
            const courant = lireToken();
            e.sessions = Object.fromEntries(Object.entries(e.sessions).filter(([token, id]) => id !== utilisateur.id || token === courant));
        }
        sauvegarder(e);
        return public_(utilisateur);
    },
    deleteMe: async (motDePasse) => {
        const { etat: e, utilisateur } = await connecte();
        await verifierMotDePasse(utilisateur, motDePasse);
        // Comme les clés étrangères en cascade du backend
        e.utilisateurs = e.utilisateurs.filter((u) => u.id !== utilisateur.id);
        e.reservations = e.reservations.filter((r) => r.id_utilisateur !== utilisateur.id);
        e.avis = e.avis.filter((a) => a.id_utilisateur !== utilisateur.id);
        e.sessions = Object.fromEntries(Object.entries(e.sessions).filter(([, id]) => id !== utilisateur.id));
        sauvegarder(e);
    },
    mesReservations: async () => {
        const { etat: e, utilisateur } = await connecte();
        return e.reservations
            .filter((r) => r.id_utilisateur === utilisateur.id)
            .map((r) => enReservation(r))
            .sort((a, b) => (a.date_visite + a.heure_debut).localeCompare(b.date_visite + b.heure_debut));
    },
    reserver: async (idVisite, taille) => {
        const { etat: e, utilisateur } = await connecte();
        const visite = visitesOuvertes().find((v) => v.id === idVisite);
        if (!visite) {
            throw new ApiError(422, "Cette visite n'est plus disponible.");
        }
        if (!Number.isInteger(taille) || taille < 1 || taille > 50) {
            throw new ApiError(422, "Le groupe doit compter entre 1 et 50 personnes.");
        }
        if (placesRestantes(e, visite.id, visite.date_visite, visite.capacite_max) < taille) {
            throw new ApiError(409, "Il ne reste pas assez de places pour cette visite.");
        }
        const aVenir = e.reservations.filter((r) => r.id_utilisateur === utilisateur.id && r.date_visite >= aujourdhui()).length;
        if (aVenir >= MAX_A_VENIR_PAR_COMPTE) {
            throw new ApiError(422, `Vous avez déjà ${MAX_A_VENIR_PAR_COMPTE} visites à venir. Annulez-en une pour en réserver une autre.`);
        }
        const reservation = {
            id: e.prochainId++,
            id_utilisateur: utilisateur.id,
            id_visite: visite.id,
            id_spr: visite.id_spr,
            date_visite: visite.date_visite,
            taille,
        };
        e.reservations.push(reservation);
        sauvegarder(e);
        return enReservation(reservation);
    },
    annulerReservation: async (id) => {
        const { etat: e, utilisateur } = await connecte();
        const reservation = e.reservations.find((r) => r.id === id);
        if (!reservation) throw new ApiError(404, "Réservation introuvable.");
        if (reservation.id_utilisateur !== utilisateur.id) {
            throw new ApiError(403, "Vous n'êtes pas autorisé à annuler cette réservation.");
        }
        if (reservation.date_visite < aujourdhui()) {
            throw new ApiError(422, "Une visite passée ne peut plus être annulée.");
        }
        e.reservations = e.reservations.filter((r) => r.id !== id);
        sauvegarder(e);
    },
    publierAvis: async (nouvelAvis) => {
        const { etat: e, utilisateur } = await connecte();
        sprOu404(nouvelAvis.id_spr);
        if (e.avis.some((a) => a.id_utilisateur === utilisateur.id && a.id_spr === nouvelAvis.id_spr)) {
            throw new ApiError(409, "Vous avez déjà laissé un avis pour ce SPR.");
        }
        const avis: Avis = {
            id: e.prochainId++,
            ...nouvelAvis,
            id_utilisateur: utilisateur.id,
            created_at: new Date().toISOString(),
            utilisateur: { id: utilisateur.id, pseudo: utilisateur.pseudo },
        };
        e.avis.push(avis);
        sauvegarder(e);
        return avis;
    },
    supprimerAvis: async (id) => {
        const { etat: e, utilisateur } = await connecte();
        const avis = e.avis.find((a) => a.id === id);
        if (!avis) throw new ApiError(404, "Avis introuvable.");
        if (avis.id_utilisateur !== utilisateur.id) {
            throw new ApiError(403, "Vous n'êtes pas autorisé à supprimer cet avis.");
        }
        e.avis = e.avis.filter((a) => a.id !== id);
        sauvegarder(e);
    },
    recommander: async (preferences) => ({ source: "local", recommandations: recommander(preferences, SPR) }),
};

export default demo;
