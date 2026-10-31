import { Box, Typography, LinearProgress, Rating as Etoiles } from "@mui/material";
import type { Avis } from "../api";
import { useVisible } from "../animations";
import { locale, useTextes } from "../i18n";

interface RatingProps {
  avis: Avis[];
}

/** Évaluation globale calculée à partir des avis déjà chargés. */
const Rating: React.FC<RatingProps> = ({ avis }) => {
  // Les barres partent de zéro et se remplissent quand le bloc arrive à l'écran
  const { ref, visible } = useVisible<HTMLDivElement>();
  const t = useTextes({
    fr: {
      titre: "Évaluation globale",
      aucune: "Pas encore de note.",
      total: (n: number) => `(${n} avis)`,
      barre: (n: number, e: number) => `${n} avis à ${e} étoile${e > 1 ? "s" : ""}`,
    },
    en: {
      titre: "Overall rating",
      aucune: "No ratings yet.",
      total: (n: number) => `(${n} review${n > 1 ? "s" : ""})`,
      barre: (n: number, e: number) => `${n} review${n === 1 ? "" : "s"} with ${e} star${e > 1 ? "s" : ""}`,
    },
  });
  const total = avis.length;
  const moyenne = total ? avis.reduce((somme, a) => somme + a.note, 0) / total : 0;
  const repartition = [5, 4, 3, 2, 1].map((etoiles) => ({
    etoiles,
    nombre: avis.filter((a) => a.note === etoiles).length,
  }));

  return (
    <Box ref={ref} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <Typography variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
        {t.titre}
      </Typography>

      {total === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>{t.aucune}</Typography>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
            {moyenne.toLocaleString(locale(), { maximumFractionDigits: 1 })}
          </Typography>
          <Etoiles value={moyenne} precision={0.1} readOnly aria-hidden />
          <Typography sx={{ color: "text.secondary" }}>{t.total(total)}</Typography>
        </Box>
      )}

      {repartition.map(({ etoiles, nombre }) => (
        <Box key={etoiles} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ minWidth: 20 }}>{etoiles}</Typography>
          <LinearProgress
            variant="determinate"
            value={total && visible ? (nombre / total) * 100 : 0}
            aria-label={t.barre(nombre, etoiles)}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": { backgroundColor: "primary.main", transitionDuration: "0.8s" },
            }}
          />
          <Typography sx={{ minWidth: 20, color: "text.secondary" }}>{nombre}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Rating;
