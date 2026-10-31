import { Box, Stack, Typography, Divider, List, ListItem, Link } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import LogoVert from "../assets/dauphineo_logo.svg";
import { useTextes } from "../i18n";

interface Lien {
  text: string;
  to?: string;
  href?: string;
}

const TEXTES = {
  fr: {
    sections: [
      {
        title: "Informations",
        links: [
          { text: "Mentions légales", to: "/mentions-legales" },
          { text: "Politique de confidentialité", to: "/reglementation" },
          { text: "Conditions générales d'utilisation", to: "/cgu" },
        ],
      },
      {
        title: "Support",
        links: [
          { text: "Contactez-nous", href: "mailto:contact.dauphineo@gmail.com" },
          { text: "FAQ", to: "/faq" },
        ],
      },
      {
        title: "À propos",
        links: [
          { text: "Explorer les sites", to: "/explorer" },
          { text: "Code source", href: "https://github.com/aravenad/dauphineo" },
        ],
      },
    ] as { title: string; links: Lien[] }[],
    projet: "Projet réalisé pendant la SAÉ 3.01 du BUT Informatique à l'IUT2 de Grenoble.",
    depot: "Dépôt GitHub de Dauphinéo",
  },
  en: {
    sections: [
      {
        title: "Information",
        links: [
          { text: "Legal notice", to: "/mentions-legales" },
          { text: "Privacy policy", to: "/reglementation" },
          { text: "Terms of use", to: "/cgu" },
        ],
      },
      {
        title: "Support",
        links: [
          { text: "Contact us", href: "mailto:contact.dauphineo@gmail.com" },
          { text: "FAQ", to: "/faq" },
        ],
      },
      {
        title: "About",
        links: [
          { text: "Explore the sites", to: "/explorer" },
          { text: "Source code", href: "https://github.com/aravenad/dauphineo" },
        ],
      },
    ],
    projet: "Built during the SAÉ 3.01 project of the BUT in Computer Science at IUT2 Grenoble.",
    depot: "Dauphinéo GitHub repository",
  },
};

// Titres en surtitre vert clair, liens en blanc atténué : contrastes de 7,1:1 et 9:1 sur le fond du pied de page
const styleTitre = { fontWeight: 700, letterSpacing: "0.1em", color: "#7FB8AF" };
const styleLien = { paddingY: 0.75, color: "rgba(252, 250, 249, 0.75)", textDecoration: "none", "&:hover": { color: "common.white", textDecoration: "underline" } };

function Footer() {
  const t = useTextes(TEXTES);
  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", paddingX: { xs: "1.5em", md: "6em" }, paddingTop: "2em" }}>
      <Box component="img" src={LogoVert} alt="Dauphinéo" sx={{ width: { xs: "40%", md: "10%" }, height: "auto" }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 0 }} sx={{ justifyContent: "space-between", marginTop: "2em" }}>
        {t.sections.map((section, i) => (
          <Box component="nav" aria-labelledby={`pied-${i}`} key={section.title} sx={{ flex: 1 }}>
            <Typography variant="overline" component="h2" id={`pied-${i}`} sx={styleTitre}>
              {section.title}
            </Typography>
            <List sx={{ paddingTop: 0.5 }}>
              {section.links.map((link) => (
                <ListItem key={link.text} sx={{ padding: 0 }}>
                  {link.to ? (
                    <Link component={RouterLink} to={link.to} sx={styleLien}>
                      {link.text}
                    </Link>
                  ) : (
                    <Link href={link.href} sx={styleLien}>
                      {link.text}
                    </Link>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", paddingY: "2em" }}>
        <Typography variant="body1" sx={{ color: "common.white" }}>
          {t.projet}
        </Typography>
        <Link href="https://github.com/aravenad/dauphineo" aria-label={t.depot} sx={{ display: "flex" }}>
          <GitHub sx={{ color: "common.white", fontSize: 22 }} />
        </Link>
      </Stack>
      <Divider sx={{ borderColor: "rgba(252, 250, 249, 0.2)" }} />
      <Typography variant="body1" sx={{ color: "common.white", paddingY: "2em" }}>
        © 2024-2026 Dauphinéo
      </Typography>
    </Box>
  );
}

export default Footer;
