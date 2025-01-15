import React from "react";
import { useLocation } from "react-router";
import GuideSection from "../components/GuideSection";
import AvisSection from "../components/AvisSection";

const SPR: React.FC = () => {
    const location = useLocation();
    const sprData = location.state?.jsonSPR ? JSON.parse(location.state.jsonSPR) : null; // Récupération et parsing des données JSON

    if (!sprData) {
        return <p>Aucune donnée disponible</p>;
    }

    // Assurez-vous que `sprData` contient un seul objet pour un SPR
    const spr = sprData[0];

    return (
        <>
            <h1>{spr.nom_commune}</h1>
            <img
                src={spr.image_url} // Ajout d'une propriété dynamique pour l'image
                alt={spr.nom_commune}
                style={{
                    width: "80%", // Limite la largeur à 80% du conteneur parent
                    maxWidth: "500px", // Limite maximale pour la largeur
                    height: "auto", // Conserve les proportions
                    display: "block", // Centre l'image
                    margin: "0 auto 20px", // Centre l'image horizontalement et ajoute un espacement en bas
                }}
            />
            <div>
                <p><strong>Capacité maximale :</strong> {spr.capacite_de_visite}</p>
                <p><strong>Accessibilité PMR :</strong> {spr.is_pmr ? "Oui" : "Non"}</p>
                <p><strong>Temps de visite :</strong> {spr.temps_de_visite}</p>
            </div>
            <GuideSection />
            <AvisSection />
        </>
    );
};

export default SPR;