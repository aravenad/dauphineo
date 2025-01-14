import GuideSection from "../components/GuideSection.tsx";
import FormulaireAvis from "../components/FormulaireAvis.tsx";
import AvisSection from "../components/AvisSection.tsx";


function SPR() {
    return (
        <>
            <h1>Saint Antoine l'Abbaye</h1>
            

            <img
                src="https://tourisme.saintmarcellin-vercors-isere.fr/wp-content/apidae/objects/134787/photos/saa515-cnossos-_-musee-de-saint-antoine-labbaye-lr_19595610.jpg"
                alt="Saint Antoine l'Abbaye"
                style={{
                    width: "80%", // Limite la largeur à 80% du conteneur parent
                    maxWidth: "500px", // Limite maximale pour la largeur
                    height: "auto", // Conserve les proportions
                    display: "block", // Centre l'image
                    margin: "0 auto 20px", // Centre l'image horizontalement et ajoute un espacement en bas
                }}
            />
            <GuideSection />
            <FormulaireAvis/>
            <AvisSection/>
        </>

    );
}

export default SPR;