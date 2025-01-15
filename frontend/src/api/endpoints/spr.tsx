import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // Exemple, modifie selon ton projet

export const fetchSPR = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/spr`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des SPR :", error);
        throw error;


    }
};