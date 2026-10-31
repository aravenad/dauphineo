import { useState } from "react";
import { Alert, Box, Dialog, DialogContent, DialogTitle, Skeleton, Typography } from "@mui/material";
import api, { messageErreur, type Avis } from "../api";
import { useApi } from "../hooks";
import { useSession } from "../session";
import Rating from "./Rating";
import CardAvis from "./CardAvis";
import FormulaireAvis from "./FormulaireAvis";
import { ButtonCustom } from "./mui_custom";

interface AvisSectionProps {
  sprId: number;
}

const PAR_PAGE = 3;

function trier(avis: Avis[]): Avis[] {
  return [...avis].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

const AvisSection: React.FC<AvisSectionProps> = ({ sprId }) => {
  const { utilisateur, ouvrirConnexion } = useSession();
  const { donnees, erreur, chargement } = useApi(() => api.avisSpr(sprId), [sprId]);
  // Les avis publiés ou supprimés ici remplacent la liste chargée
  const [local, setLocal] = useState<{ sprId: number; avis: Avis[] } | null>(null);
  const [visibles, setVisibles] = useState(PAR_PAGE);
  const [formulaire, setFormulaire] = useState(false);
  const [erreurAction, setErreurAction] = useState("");

  const avis = trier(local?.sprId === sprId ? local.avis : (donnees ?? []));
  const dejaPublie = utilisateur !== null && avis.some((a) => a.id_utilisateur === utilisateur.id);

  const ecrire = () => (utilisateur ? setFormulaire(true) : ouvrirConnexion());

  const supprimer = async (id: number) => {
    if (!window.confirm("Supprimer votre avis ?")) return;
    setErreurAction("");
    try {
      await api.supprimerAvis(id);
      setLocal({ sprId, avis: avis.filter((a) => a.id !== id) });
    } catch (e) {
      setErreurAction(messageErreur(e, "L'avis n'a pas pu être supprimé."));
    }
  };

  return (
    <Box component="section" aria-labelledby="titre-avis">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <Typography id="titre-avis" variant="h4" component="h2" fontWeight="bold">
          Avis
        </Typography>
        {!dejaPublie && (
          <ButtonCustom variant="outlined" onClick={ecrire}>
            Écrire un avis
          </ButtonCustom>
        )}
      </Box>

      {erreur && <Alert severity="error">{erreur}</Alert>}
      {erreurAction && <Alert severity="error" sx={{ mb: 2 }}>{erreurAction}</Alert>}

      {chargement && !local ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: "0 0 30%" }}>
            <Rating avis={avis} />
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {avis.length === 0 ? (
              <Typography color="text.secondary">Aucun avis pour le moment. Soyez le premier à partager votre visite.</Typography>
            ) : (
              avis.slice(0, visibles).map((a) => (
                <CardAvis
                  key={a.id}
                  titre={a.titre}
                  commentaire={a.commentaire}
                  note={a.note}
                  date={a.created_at}
                  pseudo={a.utilisateur?.pseudo ?? "Visiteur"}
                  onSupprimer={utilisateur?.id === a.id_utilisateur ? () => void supprimer(a.id) : undefined}
                />
              ))
            )}

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {avis.length > visibles && (
                <ButtonCustom variant="outlined" onClick={() => setVisibles((v) => v + PAR_PAGE)}>
                  Voir plus d'avis
                </ButtonCustom>
              )}
              {visibles > PAR_PAGE && (
                <ButtonCustom variant="outlined" onClick={() => setVisibles(PAR_PAGE)}>
                  Voir moins d'avis
                </ButtonCustom>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Dialog open={formulaire} onClose={() => setFormulaire(false)} fullWidth maxWidth="sm">
        <DialogTitle>Laisser un avis</DialogTitle>
        <DialogContent>
          <FormulaireAvis
            sprId={sprId}
            onAnnuler={() => setFormulaire(false)}
            onPublie={(nouveau) => {
              setLocal({ sprId, avis: [nouveau, ...avis] });
              setFormulaire(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AvisSection;
