import axios from "axios";

const BASE_URL = "http://localhost:8000/api"; // Modifie selon ton projet

// Récupérer tous les SPR
export const fetchSPR = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/spr`);
        console.log("SPR récupérés :", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des SPR :", error);
        throw error;
    }
};

// Récupérer les SPR les plus visités et les mieux notés
export const fetchTopSPR = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/spr/top`);
        return response.data; // Renvoie les SPR organisés en "most_visited" et "best_rated"
    } catch (error) {
        console.error("Erreur lors de la récupération des SPR les plus populaires :", error);
        throw error;
    }
};

export const fetchSPRById = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/spr/${id}`);
        console.log(`SPR récupéré avec l'ID ${id} :`, response.data);
        return response.data; // Renvoie les détails du SPR
    } catch (error) {
        console.error(`Erreur lors de la récupération du SPR avec l'ID ${id} :`, error);
        throw error;
    }
};