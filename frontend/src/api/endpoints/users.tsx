import axiosInstance from "../../utils/axiosInstance";

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour créer un nouvel utilisateur
export const createUser = async (userData: any) => {
  try {
    console.log("Données envoyées :", userData);
    const response = await axiosInstance.post("/utilisateur/register", userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour connecter un utilisateur
export const loginUser = async (userData: { email: string; mot_de_passe: string }) => {
  try {
    console.log("Données envoyées :", userData);
    const response = await axiosInstance.post("/utilisateur/login", userData);
    console.log(response.data);
    // Traite et retourne les données si la requête réussit
    return response.data;
  } catch (error) {
    throw error; // Relève l'erreur pour être gérée dans le composant
  }
};