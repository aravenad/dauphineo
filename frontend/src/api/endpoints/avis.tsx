import axiosInstance from "../../utils/axiosInstance";

// Fonction pour récupérer tous les avis
export const getAvis = async () => {
  const response = await axiosInstance.get("/avis");
  return response.data;
};

// Fonction pour créer un nouvel avis
export const createAvis = async (reviewData: { rating: number; comment: string }) => {
  try {
    const response = await axiosInstance.post("/api/avis", reviewData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

// Fonction pour supprimer un avis
export const deleteAvis = async (reviewId: string) => {
  const response = await axiosInstance.delete(`/api/avis/${reviewId}`);
  return response.data;
};
