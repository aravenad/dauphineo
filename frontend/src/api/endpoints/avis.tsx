
import axiosInstance from "../../utils/axiosInstance";
import axios from 'axios';


const BASE_URL = "http://localhost:8000/api"; // Modifie selon ton projet



// Fonction pour récupérer tous les avis
export const getReviews = async () => {
  const response = await axiosInstance.get("/reviews"); // Remplacez "/reviews" par l'endpoint approprié
  return response.data; // Retourne les données des avis
};


  // Fonction pour créer un nouvel avis
  export const createReview = async (reviewData: { 
    titre: string, 
    commentaire: string,
    note: number, 
    id_utilisateur: number,
    id_spr: number 
}) => {
    try {
        console.log('Tentative d\'envoi avec :', reviewData);
        
        const response = await axiosInstance.post(`/avis`, reviewData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Remplace par ton mécanisme de stockage
            },
        });
        console.log('Avis créé avec succès:', response.data);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error('Erreur Axios:', error.response?.data || error.message);
        } else {
            console.error('Erreur inconnue:', error);
        }
        throw error;
    }
};

  // Fonction pour supprimer un avis
export const deleteReview = async (reviewId: string) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`); // Remplacez "/reviews/:id" par l'endpoint approprié
    return response.data; // Retourne une réponse de confirmation ou les données après suppression
  };
