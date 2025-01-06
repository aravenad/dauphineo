import axiosInstance from "../utils/axiosInstance";

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Fonction pour créer un nouvel utilisateur
export const createUser = async (userData : any) => {
    try {
        const response = await axiosInstance.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}