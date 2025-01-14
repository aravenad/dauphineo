import axiosInstance from "../../utils/axiosInstance";

// Fonction pour récupérer les créneaux d'un SPR par son ID
export const getCreneauxBySPR = async (sprId: string) => {
    try {
        const response = await axiosInstance.get(`/api/creneaux/${sprId}`);
        return response.data; // Retourne les données des créneaux
    } catch (error) {
        throw error; // Relève l'erreur pour qu'elle soit gérée dans le composant
    }
};
