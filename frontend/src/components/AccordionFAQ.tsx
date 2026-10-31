import React from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { AccordionCustom } from "./mui_custom";
import { useTextes } from "../i18n";

const PANNEAUX = {
fr: [
  {
    id: "panel1",
    title: "Qu’est-ce que Dauphinéo ?",
    content:
      "Dauphinéo permet de réserver des visites guidées dans les sites patrimoniaux remarquables (SPR) du Dauphiné, en Isère, dans la Drôme et dans les Hautes-Alpes. Le site a été réalisé pendant la SAÉ 3.01 du BUT Informatique à l’IUT2 de Grenoble.",
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
      "La page Explorer filtre les sites par commune, thème, durée de visite et accessibilité. Le questionnaire de l’accueil pose cinq questions (taille du groupe, thèmes, cadre, durée, accessibilité) et classe les sites selon les réponses qu’ils satisfont : les mêmes réponses donnent toujours les mêmes sites.",
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
],
en: [
  {
    id: "panel1",
    title: "What is Dauphinéo?",
    content:
      "Dauphinéo lets you book guided tours of the remarkable heritage sites (SPR) of the Dauphiné, in Isère, Drôme and Hautes-Alpes. The site was built during the SAÉ 3.01 project of the BUT in Computer Science at IUT2 Grenoble.",
  },
  {
    id: "panel2",
    title: "Do I need an account to use the site?",
    content:
      "Not to explore the sites and read the reviews. You need an account to book a tour or post a review. After signing up, an activation link valid for 24 hours is sent by email.",
  },
  {
    id: "panel3",
    title: "How do I find a site that suits me?",
    content:
      "The Explore page filters the sites by town, theme, tour length and accessibility. The questionnaire on the home page asks five questions (group size, themes, setting, length, accessibility) and ranks the sites by the answers they match: the same answers always give the same sites.",
  },
  {
    id: "panel4",
    title: "How much does a tour cost?",
    content:
      "€12 per person. The total price is shown before you confirm the booking. No payment is taken on the site.",
  },
  {
    id: "panel5",
    title: "How many people can I book for?",
    content:
      "From 1 to 50 people per booking, within the places left in the time slot. An account can have up to 5 upcoming tours at the same time.",
  },
  {
    id: "panel6",
    title: "How do I cancel a booking?",
    content:
      "From the My account page, as long as the tour date has not passed. The places are released for other visitors straight away.",
  },
  {
    id: "panel7",
    title: "Are the sites accessible to people with reduced mobility?",
    content:
      "Each site page says whether the site is accessible to people with reduced mobility, and the Explore page can show only those sites.",
  },
  {
    id: "panel8",
    title: "How do I leave a review?",
    content:
      "Log in, then go to the site page: you can rate it from 1 to 5 with a comment. Each visitor posts one review per site and can delete it later.",
  },
  {
    id: "panel9",
    title: "How do I delete my account and my data?",
    content:
      "From the My account page, by confirming with your password. Your bookings and reviews are deleted with the account. Accounts inactive for 3 years are also deleted automatically.",
  },
  {
    id: "panel10",
    title: "How do I contact the team?",
    content:
      "By email at contact.dauphineo@gmail.com, or by post at 2 Place Doyen Gosse, 38000 Grenoble, France.",
  },
],
};

function AccordionFAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const panels = useTextes(PANNEAUX);

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
