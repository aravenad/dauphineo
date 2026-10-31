import { useState } from "react";
import { Alert, Box, Dialog, DialogContent, DialogTitle, Skeleton, Typography } from "@mui/material";
import api, { messageErreur, type Avis } from "../api";
import { useApi } from "../hooks";
import { useSession } from "../session";
import Rating from "./Rating";
import CardAvis from "./CardAvis";
import Confirmation from "./Confirmation";
import FormulaireAvis from "./FormulaireAvis";
import { ButtonCustom } from "./mui_custom";
import { useTextes } from "../i18n";

const TEXTES = {
  fr: {
    echecSuppression: "L'avis n'a pas pu être supprimé.",
    titre: "Avis",
    ecrire: "Écrire un avis",
    aucun: "Aucun avis pour le moment. Soyez le premier à partager votre visite.",
    visiteur: "Visiteur",
    plus: "Voir plus d'avis",
    moins: "Voir moins d'avis",
    laisser: "Laisser un avis",
    confirmerTitre: "Supprimer votre avis ?",
    confirmer: "Supprimer l'avis",
    confirmerTexte: "Votre note et votre commentaire seront retirés de la fiche. Vous pourrez ensuite publier un nouvel avis.",
  },
  en: {
    echecSuppression: "The review could not be deleted.",
    titre: "Reviews",
    ecrire: "Write a review",
    aucun: "No reviews yet. Be the first to share your visit.",
    visiteur: "Visitor",
    plus: "Show more reviews",
    moins: "Show fewer reviews",
    laisser: "Leave a review",
    confirmerTitre: "Delete your review?",
    confirmer: "Delete the review",
    confirmerTexte: "Your rating and comment will be removed from the page. You can then post a new review.",
  },
};

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
  const [aSupprimer, setASupprimer] = useState<number | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreurAction, setErreurAction] = useState("");
  const t = useTextes(TEXTES);

  const avis = trier(local?.sprId === sprId ? local.avis : (donnees ?? []));
  const dejaPublie = utilisateur !== null && avis.some((a) => a.id_utilisateur === utilisateur.id);

  const ecrire = () => (utilisateur ? setFormulaire(true) : ouvrirConnexion());

  const demander = (id: number) => {
    setErreurAction("");
    setASupprimer(id);
  };

  const supprimer = async () => {
    if (aSupprimer === null) return;
    setEnCours(true);
    setErreurAction("");
    try {
      await api.supprimerAvis(aSupprimer);
      setLocal({ sprId, avis: avis.filter((a) => a.id !== aSupprimer) });
      setASupprimer(null);
    } catch (e) {
      setErreurAction(messageErreur(e, t.echecSuppression));
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Box component="section" aria-labelledby="titre-avis">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <Typography id="titre-avis" variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          {t.titre}
        </Typography>
        {!dejaPublie && (
          <ButtonCustom variant="outlined" onClick={ecrire}>
            {t.ecrire}
          </ButtonCustom>
        )}
      </Box>

      {erreur && <Alert severity="error">{erreur}</Alert>}

      {chargement && !local ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: "0 0 30%" }}>
            <Rating avis={avis} />
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {avis.length === 0 ? (
              <Typography sx={{ color: "text.secondary" }}>{t.aucun}</Typography>
            ) : (
              avis.slice(0, visibles).map((a) => (
                <CardAvis
                  key={a.id}
                  titre={a.titre}
                  commentaire={a.commentaire}
                  note={a.note}
                  date={a.created_at}
                  pseudo={a.utilisateur?.pseudo ?? t.visiteur}
                  onSupprimer={utilisateur?.id === a.id_utilisateur ? () => demander(a.id) : undefined}
                />
              ))
            )}

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              {avis.length > visibles && (
                <ButtonCustom variant="outlined" onClick={() => setVisibles((v) => v + PAR_PAGE)}>
                  {t.plus}
                </ButtonCustom>
              )}
              {visibles > PAR_PAGE && (
                <ButtonCustom variant="outlined" onClick={() => setVisibles(PAR_PAGE)}>
                  {t.moins}
                </ButtonCustom>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Dialog open={formulaire} onClose={() => setFormulaire(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t.laisser}</DialogTitle>
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

      <Confirmation
        open={aSupprimer !== null}
        titre={t.confirmerTitre}
        confirmer={t.confirmer}
        enCours={enCours}
        erreur={erreurAction}
        onConfirmer={() => void supprimer()}
        onFermer={() => setASupprimer(null)}
      >
        {t.confirmerTexte}
      </Confirmation>
    </Box>
  );
};

export default AvisSection;
