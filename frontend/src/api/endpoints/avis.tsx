
import axiosInstance from "../../utils/axiosInstance";

// Fonction pour récupérer tous les avis
export const getReviews = async () => {
  const response = await axiosInstance.get("/reviews"); // Remplacez "/reviews" par l'endpoint approprié
  return response.data; // Retourne les données des avis
};


  // Fonction pour créer un nouvel avis
  export const createReview = async (reviewData: { rating: number; comment: string }) => {
    try {
      const response = await axiosInstance.post("/reviews", reviewData);
      return response.data; // Retourne la réponse, par exemple un message de succès ou l'avis créé
    } catch (error) {
      console.error("Erreur lors de la création de l'avis:", error);
      throw new Error("Une erreur est survenue lors de la création de l'avis.");
    }
  };

  // Fonction pour supprimer un avis
export const deleteReview = async (reviewId: string) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`); // Remplacez "/reviews/:id" par l'endpoint approprié
    return response.data; // Retourne une réponse de confirmation ou les données après suppression
  };
