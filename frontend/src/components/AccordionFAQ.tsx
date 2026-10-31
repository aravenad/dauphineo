import React from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { AccordionCustom } from "./mui_custom";

function AccordionFAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const panels = [
    {
      id: "panel1",
      title: "Qu’est-ce que Dauphinéo ?",
      content:
        "Dauphinéo permet de réserver des visites guidées dans les sites patrimoniaux remarquables (SPR) de l’Isère. Le site a été réalisé pendant la SAÉ 3.01 du BUT Informatique à l’IUT2 de Grenoble.",
    },
    {
      id: "panel2",
      title: "Faut-il un compte pour utiliser le site ?",
      content:
        "Non pour explorer les sites et lire les avis. Un compte est nécessaire pour réserver une visite ou publier un avis. Après l’inscription, un lien d’activation valable 24 heures est envoyé par e-mail.",
    },
    {
      id: "panel3",
      title: "Comment trouver un site qui me correspond ?",
      content:
        "La page Explorer filtre les sites par commune, thème, durée de visite et accessibilité. Le questionnaire de l’accueil pose cinq questions (taille du groupe, thèmes, durée, accessibilité, type d’expérience) et propose les sites les plus proches de vos envies.",
    },
    {
      id: "panel4",
      title: "Combien coûte une visite ?",
      content:
        "12 € par personne. Le prix total s’affiche avant de confirmer la réservation. Aucun paiement n’est demandé sur le site.",
    },
    {
      id: "panel5",
      title: "Combien de personnes puis-je inscrire ?",
      content:
        "De 1 à 50 personnes par réservation, dans la limite des places restantes du créneau. Un compte peut avoir jusqu’à 5 visites à venir en même temps.",
    },
    {
      id: "panel6",
      title: "Comment annuler une réservation ?",
      content:
        "Depuis la page Mon compte, tant que la date de la visite n’est pas passée. Les places sont aussitôt libérées pour les autres visiteurs.",
    },
    {
      id: "panel7",
      title: "Les sites sont-ils accessibles aux personnes à mobilité réduite ?",
      content:
        "Chaque fiche indique si le site est accessible aux personnes à mobilité réduite (PMR), et la page Explorer permet de n’afficher que ces sites.",
    },
    {
      id: "panel8",
      title: "Comment laisser un avis ?",
      content:
        "Connectez-vous, puis rendez-vous sur la fiche du site : vous pouvez lui donner une note de 1 à 5 avec un commentaire. Chaque visiteur publie un seul avis par site et peut le supprimer ensuite.",
    },
    {
      id: "panel9",
      title: "Comment supprimer mon compte et mes données ?",
      content:
        "Depuis la page Mon compte, en confirmant avec votre mot de passe. Vos réservations et vos avis sont supprimés avec le compte. Les comptes inactifs depuis 3 ans sont aussi supprimés automatiquement.",
    },
    {
      id: "panel10",
      title: "Comment contacter l’équipe ?",
      content:
        "Par e-mail à contact.dauphineo@gmail.com, ou par courrier au 2 Place Doyen Gosse, 38000 Grenoble.",
    },
  ];

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Stack spacing={2}>
      {panels.map((panel) => (
        <AccordionCustom
          key={panel.id}
          expanded={expanded === panel.id}
          onChange={handleChange(panel.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreRounded />}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {panel.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{panel.content}</Typography>
          </AccordionDetails>
        </AccordionCustom>
      ))}
    </Stack>
  );
}

export default AccordionFAQ;
