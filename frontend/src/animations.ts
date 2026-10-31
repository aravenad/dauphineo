import { useCallback, useEffect, useRef, useState } from "react";
import { keyframes } from "@mui/material/styles";

/**
 * Animations communes : opacité et transform seulement, que le navigateur anime sans recalculer
 * la mise en page. Le thème les coupe toutes quand le système demande moins de mouvement.
 */
const montee = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
`;

const fondu = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const COURBE = "cubic-bezier(0.2, 0, 0, 1)";

/** Arrivée d'une page ou d'un bloc : léger fondu vers le haut */
export const entree = { animation: `${montee} 0.4s ${COURBE} both` };

/** Changement de contenu sur place, comme un onglet : fondu seul */
export const apparition = { animation: `${fondu} 0.25s ease both` };

/** Les enfants d'une grille arrivent l'un après l'autre */
export function entreeEnCascade(active = true) {
    const delais = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`&:nth-of-type(${i + 1})`, { animationDelay: `${i * 60}ms` }]));
    return { "& > *": active ? { ...entree, animationDelay: "480ms", ...delais } : { opacity: 0 } };
}

export function mouvementReduit(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Vrai dès que l'élément entre à l'écran, pour lancer son animation à ce moment-là */
export function useVisible<T extends Element>() {
    const ref = useRef<T>(null);
    const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined" || mouvementReduit());

    useEffect(() => {
        if (visible || !ref.current) return;
        const observateur = new IntersectionObserver(
            ([entree]) => {
                if (entree.isIntersecting) {
                    setVisible(true);
                    observateur.disconnect();
                }
            },
            { rootMargin: "0px 0px -10% 0px" },
        );
        observateur.observe(ref.current);
        return () => observateur.disconnect();
    }, [visible]);

    return { ref, visible };
}

/** Une photo apparaît en fondu une fois téléchargée au lieu de se dessiner ligne par ligne */
export function useImageChargee() {
    const [chargee, setChargee] = useState(false);
    // Une image déjà en cache peut être prête avant que React n'écoute l'événement load
    const ref = useCallback((image: HTMLImageElement | null) => {
        if (image?.complete && image.naturalWidth > 0) setChargee(true);
    }, []);
    return {
        imageProps: { ref, onLoad: () => setChargee(true) },
        style: { opacity: chargee ? 1 : 0, transition: "opacity 0.4s ease, transform 0.3s ease" },
    };
}
