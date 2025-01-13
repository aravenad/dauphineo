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
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour connecter un utilisateur
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/api/utilisateur/login", userData);
    // Traite et retourne les données si la requête réussit
    return response.data;
  } catch (error) {
    throw error; // Relève l'erreur pour être gérée dans le composant
  }
};