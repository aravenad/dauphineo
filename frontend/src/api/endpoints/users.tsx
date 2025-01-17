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
export const loginUser = async (userData: { email: string; password: string }) => {
  try {
    console.log("Données envoyées :", userData);
    const response = await axiosInstance.post("/auth/login", userData);
    console.log(response.data);
    // Traite et retourne les données si la requête réussit
    return response.data;
  } catch (error) {
    throw error; // Relève l'erreur pour être gérée dans le composant
  }
};

// Fonction pour déconnecter un utilisateur

export const logoutUser = async (token: string) => {
  try {
    const response = await axiosInstance.post(
        "/utilisateur/logout",  // Remplacez ceci par l'URL de votre endpoint de déconnexion
        {},  // Aucun corps de requête si l'API ne l'exige pas
        {
          headers: {
            "Authorization": `Bearer ${token}`, // Ajout du token Bearer dans l'en-tête
          },
        }
    );

    // Vous pouvez traiter la réponse ici si nécessaire
    return response.data; // Retourne les données de la réponse de l'API
  } catch (error) {
    console.error("Erreur API lors de la déconnexion", error);
    throw error; // Vous pouvez aussi gérer l'erreur en affichant un message à l'utilisateur
  }
};


