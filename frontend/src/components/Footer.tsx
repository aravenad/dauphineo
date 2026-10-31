import { Box, Stack, Typography, Divider, List, ListItem, Link } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import LogoVert from "../assets/dauphineo_logo.svg";

interface Lien {
  text: string;
  to?: string;
  href?: string;
}

const footerSections: { title: string; links: Lien[] }[] = [
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
];

const styleLien = { paddingY: 1, color: "common.white", textDecoration: "none", "&:hover": { textDecoration: "underline" } };

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", paddingX: { xs: "1.5em", md: "6em" }, paddingTop: "2em" }}>
      <Box component="img" src={LogoVert} alt="Dauphinéo" sx={{ width: { xs: "40%", md: "10%" }, height: "auto" }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 0 }} sx={{ justifyContent: "space-between", marginTop: "2em" }}>
        {footerSections.map((section) => (
          <Box component="nav" aria-label={section.title} key={section.title} sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={500} sx={{ color: "primary.light" }}>
              {section.title}
            </Typography>
            <List>
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
          Projet réalisé pendant la SAÉ 3.01 du BUT Informatique à l'IUT2 de Grenoble.
        </Typography>
        <Link href="https://github.com/aravenad/dauphineo" aria-label="Dépôt GitHub de Dauphinéo" sx={{ display: "flex" }}>
          <GitHub sx={{ color: "common.white", fontSize: 22 }} />
        </Link>
      </Stack>
      <Divider sx={{ borderColor: "rgba(252, 250, 249, 0.2)" }} />
      <Typography variant="body1" color="common.white" sx={{ paddingY: "2em" }}>
        © 2024-2026 Dauphinéo
      </Typography>
    </Box>
  );
}

export default Footer;
