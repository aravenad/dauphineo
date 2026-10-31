import { Box, Link, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import AppsIcon from "@mui/icons-material/Apps";
import BalanceIcon from "@mui/icons-material/Balance";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import CopyrightIcon from "@mui/icons-material/Copyright";
import EditNoteIcon from "@mui/icons-material/EditNote";
import GavelIcon from "@mui/icons-material/Gavel";
import LanguageIcon from "@mui/icons-material/Language";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import api from "../api";
import { CarteInfo, GrilleCartes, PageLegale, SectionLegale } from "../components/PageLegale";
import { useApi, useTitre } from "../hooks";
import { nomCommune } from "../utils/format";

function CreditsPhotos() {
  const { donnees, erreur } = useApi(() => api.listSpr(), []);

  if (erreur) {
    return <Typography sx={{ color: "text.secondary" }}>Les crédits n'ont pas pu être chargés.</Typography>;
  }

  const sprs = [...(donnees ?? [])].sort((a, b) => a.nom_commune.localeCompare(b.nom_commune, "fr"));

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
      {sprs.map((spr) => (
        <Paper key={spr.id} variant="outlined" sx={{ p: 2, borderRadius: "1em", borderColor: "grey.300", minWidth: 0 }}>
          <Typography component="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
            {nomCommune(spr.nom_commune)}
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.75 }}>
            {spr.images.map((image) => (
              <Box component="li" key={image.id} sx={{ display: "flex", gap: 1, fontSize: "0.875rem", lineHeight: 1.5, overflowWrap: "anywhere" }}>
                <PhotoCameraOutlinedIcon aria-hidden sx={{ fontSize: "1rem", mt: "0.15em", color: "primary.main", flex: "0 0 auto" }} />
                <span>
                  {image.source ? (
                    <Link href={image.source} target="_blank" rel="noopener">
                      {image.auteur ?? "Auteur inconnu"}
                    </Link>
                  ) : (
                    image.auteur ?? "Auteur inconnu"
                  )}
                  {image.licence && ` (${image.licence})`}
                </span>
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

function MentionsLeg() {
  useTitre("Mentions légales");
  return (
    <PageLegale
      titre="Mentions légales"
      intro="Qui édite Dauphinéo, où le site est hébergé et d'où viennent les photographies des sites patrimoniaux."
    >
      <SectionLegale icone={<StorefrontOutlinedIcon />} titre="Éditeur du site">
        <GrilleCartes colonnes={4}>
          <CarteInfo icone={<AppsIcon fontSize="small" />} titre="Application">
            Dauphinéo
          </CarteInfo>
          <CarteInfo icone={<PlaceOutlinedIcon fontSize="small" />} titre="Adresse">
            2 Pl. Doyen Gosse, 38000 Grenoble
          </CarteInfo>
          <CarteInfo icone={<PersonOutlineIcon fontSize="small" />} titre="Responsable de la publication">
            Damien ARAVENA-BRAVO
          </CarteInfo>
          <CarteInfo icone={<MailOutlineIcon fontSize="small" />} titre="Contact">
            <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>
          </CarteInfo>
        </GrilleCartes>
        <Typography>
          Le responsable de la publication est chargé de veiller au respect des dispositions légales en matière de communication en ligne.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<CloudOutlinedIcon />} titre="Hébergeur du site">
        <GrilleCartes>
          <CarteInfo icone={<CloudOutlinedIcon fontSize="small" />} titre="Hébergeur">
            GitHub, Inc. (service GitHub Pages)
          </CarteInfo>
          <CarteInfo icone={<PlaceOutlinedIcon fontSize="small" />} titre="Adresse">
            88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis
          </CarteInfo>
          <CarteInfo icone={<LanguageIcon fontSize="small" />} titre="Site internet">
            <Link href="https://pages.github.com/" target="_blank" rel="noopener">
              pages.github.com
            </Link>
          </CarteInfo>
        </GrilleCartes>
        <Typography>L’hébergeur est responsable du stockage des données et de la disponibilité technique du site.</Typography>
      </SectionLegale>

      <SectionLegale icone={<CopyrightIcon />} titre="Propriété intellectuelle">
        <Typography>
          Tous les contenus présents sur le site Dauphinéo (textes, images, logos, etc.) sont protégés par les lois en vigueur sur la propriété
          intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments est
          strictement interdite sans autorisation écrite préalable de Dauphinéo.
        </Typography>
        <Typography>
          Les photographies des sites font exception : elles proviennent de Wikimedia Commons et restent la propriété de leurs auteurs, qui les
          diffusent sous licence libre. Elles peuvent être réutilisées selon les conditions de leur licence, indiquées ci-dessous.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<PhotoCameraOutlinedIcon />} titre="Crédits photographiques">
        <Typography>
          Photos de Wikimedia Commons, citées par commune. Chaque nom mène à la page de la photo, où figurent sa licence complète et ses
          éventuelles conditions de réutilisation. Elles sont affichées sans modification autre qu'un redimensionnement.
        </Typography>
        <CreditsPhotos />
      </SectionLegale>

      <SectionLegale icone={<ShieldOutlinedIcon />} titre="Données personnelles">
        <Typography>
          Pour des informations détaillées sur la collecte, l’utilisation et la gestion de vos données personnelles, consultez notre{" "}
          <Link component={RouterLink} to="/reglementation">
            politique de confidentialité
          </Link>
          . Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
        </Typography>
        <GrilleCartes>
          <CarteInfo icone={<VisibilityOutlinedIcon fontSize="small" />} titre="Accès et rectification">
            Droit d'accès, de rectification, d'effacement et de portabilité de vos données.
          </CarteInfo>
          <CarteInfo icone={<EditNoteIcon fontSize="small" />} titre="Limitation et opposition">
            Droit de limiter le traitement de vos données ou de vous y opposer.
          </CarteInfo>
          <CarteInfo icone={<GavelIcon fontSize="small" />} titre="Réclamation">
            Droit d'introduire une réclamation auprès de la{" "}
            <Link href="https://www.cnil.fr/" target="_blank" rel="noopener">
              CNIL
            </Link>{" "}
            en cas de non-respect de vos droits.
          </CarteInfo>
        </GrilleCartes>
        <Typography>
          Pour exercer vos droits, écrivez-nous à <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<BalanceIcon />} titre="Responsabilité">
        <Typography>
          Dauphinéo met tout en œuvre pour assurer l'exactitude des informations diffusées sur son site. Cependant, l'éditeur ne peut garantir
          l'exactitude, l'exhaustivité ou la mise à jour des informations disponibles. L'utilisation du site se fait sous la seule
          responsabilité de l'utilisateur. Dauphinéo décline toute responsabilité en cas de dommages directs ou indirects résultant de l'accès
          ou de l'utilisation de ce site.
        </Typography>
      </SectionLegale>
    </PageLegale>
  );
}

export default MentionsLeg;
