import axiosInstance from "../../utils/axiosInstance.tsx";

export const getVisitesFromSPRId = async (idSpr: number) => {
    try {
        if (!idSpr) {
            throw new Error("L'identifiant du SPR est requis");
        }
        const response = await axiosInstance.get(`/visites/spr/${idSpr}`);
        console.log("Visites récupérées :", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des visites :", error);
        throw error.response?.data || error.message || "Erreur inconnue";
    }
};

export const getVisitesFromDispoID = async (idDispo: number) => {
    try {
        if (!idDispo) {
            throw new Error("L'identifiant de la disponibilité est requis");
        }
        const response = await axiosInstance.get(`/visites/disponibilite/${idDispo}`);
        console.log("Visites récupérées :", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des visites :", error);
        throw error.response?.data || error.message || "Erreur inconnue";
    }
}
