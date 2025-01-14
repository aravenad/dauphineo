
import axiosInstance from "../../utils/axiosInstance.tsx";

// Fonction pour récupérer tous les guides
export const getAllGuides = async () => {
    try {
        const response = await axiosInstance.get("/guides"); // Appelle l'API
        console.log("Réponse de l'API :", response.data);
        return response.data; // Retourne les données des guides
    } catch (error) {
        console.error("Erreur lors de la récupération des guides :", error);
        throw error; // Relève l'erreur pour qu'elle soit gérée par le composant appelant
    }
};
