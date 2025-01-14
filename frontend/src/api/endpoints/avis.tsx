
import axiosInstance from "../../utils/axiosInstance";

// Fonction pour récupérer tous les avis
export const getReviews = async () => {
  try {
    const response = await axiosInstance.get("/reviews"); // Remplacez "/reviews" par l'endpoint approprié
    return response.data; // Retourne les données des avis
  } catch (error) {
    throw error; // Relève l'erreur pour qu'elle soit gérée dans le composant
  }
};


  // Fonction pour créer un nouvel avis
export const createReview = async (reviewData: { rating: number; comment: string }) => {
    try {
      const response = await axiosInstance.post("/reviews", reviewData); // Remplacez "/reviews" par l'endpoint approprié
      return response.data; // Retourne la réponse (par exemple, l'avis créé ou un message de confirmation)
    } catch (error) {
      throw error; // Relève l'erreur pour qu'elle soit gérée dans le composant
    }
};

  // Fonction pour supprimer un avis
export const deleteReview = async (reviewId: string) => {
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`); // Remplacez "/reviews/:id" par l'endpoint approprié
      return response.data; // Retourne une réponse de confirmation ou les données après suppression
    } catch (error) {
      throw error; // Relève l'erreur pour qu'elle soit gérée dans le composant
    }
  };
