import React from "react";
import { useLocation } from "react-router";

const SPR: React.FC = () => {
    const location = useLocation();
    const sprData = location.state?.jsonSPR ? JSON.parse(location.state.jsonSPR) : null; // Récupérer et parser les données JSON

    return (
        <div>
            <h1>Détails du SPR</h1>
            {sprData ? (
                <div>
                    <p>ID : {sprData[0].id}</p>
                    <p>Nom : {sprData[0].nom_commune}</p>
                    <p>Capacité de visite maximale : {sprData[0].capacite_de_visite}</p>
                </div>
            ) : (
                <p>Aucune donnée disponible</p>
            )}
        </div>
    );
};

export default SPR;