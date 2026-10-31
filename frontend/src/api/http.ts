import axios, { AxiosError } from "axios";
import { ApiError, messageErreur } from "./erreurs";
import { lireToken } from "./token";
import { langueActuelle, traduire } from "../i18n";
import type { Api, Reservation, Spr, SprClasse, Visite, Avis, Connexion, DemandeInscription, Utilisateur, Recommandations } from "./types";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
    headers: { Accept: "application/json" },
});

client.interceptors.request.use((config) => {
    const token = lireToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // L'API répond dans la langue du site
    config.headers["Accept-Language"] = langueActuelle();
    return config;
});

client.interceptors.response.use(undefined, (erreur: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const reponse = erreur.response;
    if (!reponse) {
        throw new ApiError(0, traduire({ fr: "Le serveur ne répond pas. Vérifiez que l'API est lancée.", en: "The server is not responding. Check that the API is running." }));
    }
    // Pour une erreur de validation, le premier message de champ est plus précis que le message global
    const validation = reponse.data?.errors && Object.values(reponse.data.errors)[0]?.[0];
    throw new ApiError(reponse.status, validation ?? reponse.data?.message ?? messageErreur(null));
});

interface ReservationApi {
    id: number;
    prix: number;
    taille: number;
    spr: { id: number; nom_commune: string };
    guide: { nom: string; prenom: string };
    visite: { date_visite: string; disponibilite?: { creneaux: { heure_debut: string; heure_fin: string } } };
}

function aplatir(reservation: ReservationApi): Reservation {
    return {
        id: reservation.id,
        prix: reservation.prix,
        taille: reservation.taille,
        date_visite: reservation.visite.date_visite,
        heure_debut: reservation.visite.disponibilite?.creneaux.heure_debut ?? "",
        heure_fin: reservation.visite.disponibilite?.creneaux.heure_fin ?? "",
        spr: reservation.spr,
        guide: reservation.guide,
    };
}

const http: Api = {
    listSpr: async () => {
        const { data } = await client.get<(Spr & { reservations_count: number; avis_count: number; avis_avg_note: string | number | null })[]>("/spr");
        return data.map(({ reservations_count, avis_count, avis_avg_note, ...spr }) => ({
            ...spr,
            note_moyenne: avis_avg_note === null ? null : Number(avis_avg_note),
            nb_avis: avis_count,
            reservations: reservations_count,
        })) satisfies SprClasse[];
    },
    getSpr: async (id) => (await client.get<{ spr: Spr }>(`/spr/${id}`)).data.spr,
    visitesSpr: async (id) => (await client.get<Visite[]>(`/spr/${id}/visites`)).data,
    avisSpr: async (id) => (await client.get<Avis[]>(`/spr/${id}/avis`)).data,
    login: async (email, motDePasse) => (await client.post<Connexion>("/auth/login", { email, password: motDePasse })).data,
    register: async (inscription) => (await client.post<DemandeInscription>("/auth/register", { ...inscription, verif_age: true })).data,
    confirmerInscription: async (jeton) => (await client.post<Connexion>("/auth/confirmer", { jeton })).data,
    logout: async () => {
        await client.post("/utilisateur/logout");
    },
    me: async () => (await client.get<Utilisateur>("/utilisateur")).data,
    updateMe: async (modification) => (await client.put<Utilisateur>("/utilisateur", modification)).data,
    deleteMe: async (motDePasse) => {
        await client.delete("/utilisateur", { data: { mot_de_passe_actuel: motDePasse } });
    },
    mesReservations: async () => {
        const { data } = await client.get<ReservationApi[]>("/utilisateur/reservations");
        return data.map(aplatir).sort((a, b) => (a.date_visite + a.heure_debut).localeCompare(b.date_visite + b.heure_debut));
    },
    reserver: async (idVisite, taille) => {
        const { data } = await client.post<ReservationApi>("/reservations", { id_visite: idVisite, taille });
        return aplatir(data);
    },
    annulerReservation: async (id) => {
        await client.delete(`/reservations/${id}`);
    },
    publierAvis: async (avis) => (await client.post<Avis>("/avis", avis)).data,
    supprimerAvis: async (id) => {
        await client.delete(`/avis/${id}`);
    },
    recommander: async (preferences) => (await client.post<Recommandations>("/recommandations", preferences)).data,
};

export default http;
