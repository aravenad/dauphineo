import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface SPRMapProps {
    commune: string; // Nom de la commune
}

const SPRMap: React.FC<SPRMapProps> = ({ commune }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        commune + ", France"
                    )}&key=***REMOVED***`
                );
                const data = await response.json();
                if (data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    setCoordinates(location);
                } else {
                    console.error("Aucun résultat trouvé pour la commune :", commune);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des coordonnées :", error);
            }
        };

        fetchCoordinates();
    }, [commune]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "***REMOVED***",
    });

    if (!isLoaded) {
        return <div>Chargement de la carte...</div>;
    }

    if (!coordinates) {
        return <div>Impossible de trouver les coordonnées pour {commune}</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                width: "100%",
                height: "300px",
                borderRadius: "1em",
            }}
            center={coordinates}
            zoom={12}
            options={{
                mapId: "29ab90b564e2acba",
                mapTypeId: "terrain",
            }}
        >
            <Marker
                position={coordinates}
                icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Icône personnalisée
                    scaledSize: new window.google.maps.Size(40, 40), // Taille ajustée
                }}
            />
        </GoogleMap>
    );
};

export default SPRMap;