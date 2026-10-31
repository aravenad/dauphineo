import { Box, Typography, Divider, Link } from "@mui/material";
import { Link as RouterLink } from "react-router";

function MentionsLeg() {
  return (
    <Box sx={{ padding: "2em" }}>
    
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "1em" }}>
        Mentions Légales
      </Typography>
      <Divider sx={{ marginBottom: "2em" }} />

     
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Éditeur du site
      </Typography>
      <ul>
        <li>
          <strong>Nom de l’application :</strong> Dauphinéo
        </li>
        <li>
          <strong>Adresse :</strong> 2 Pl. Doyen Gosse, 38000 Grenoble
        </li>
        <li>
          <strong>Responsable de la publication :</strong> Damien ARAVENA-BRAVO.
        </li>
        <li>
          <strong>Contact :</strong> contact.dauphineo@gmail.com
        </li>
      </ul>
      <br/>
      <Typography>
        Le responsable de la publication est chargé de veiller au respect des dispositions légales en matière de communication en ligne.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

    
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Hébergeur du site
      </Typography>
      <ul>
        <li>
          <strong>Nom de l'hébergeur :</strong> IUT2 Grenoble
        </li>
        <li>
          <strong>Adresse :</strong> 2 Pl. Doyen Gosse, 38000 Grenoble
        </li>
        <li>
          <strong>Site internet :</strong>{" "}
          <Link href="https://iut2.univ-grenoble-alpes.fr/" target="_blank" rel="noopener">
            https://iut2.univ-grenoble-alpes.fr/
          </Link>
        </li>
      </ul>
      <br/>
      <Typography>
        L’hébergeur est responsable du stockage des données et de la disponibilité technique du site.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

   
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Propriété intellectuelle
      </Typography>
      <Typography>
        Tous les contenus présents sur le site Dauphinéo (textes, images, logos, etc.) sont protégés par les lois en vigueur sur la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments est strictement interdite sans autorisation écrite préalable de Dauphinéo.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Données personnelles
      </Typography>
      <Typography>
        Pour des informations détaillées sur la collecte, l’utilisation et la gestion de vos données personnelles, veuillez consulter notre{" "}
        <Link component={RouterLink} to="/reglementation" underline="hover">
          Politique de confidentialité.
        </Link>
        <br />
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
      </Typography>
      <br />
      <ul>
        <li>Droit d'accès, de rectification, d'effacement, et de portabilité.</li>
        <li>Droit de limitation ou d'opposition au traitement de vos données.</li>
        <li>
          Droit d'introduire une réclamation auprès de la{" "}
          <Link href="https://www.cnil.fr/" target="_blank" rel="noopener">
            CNIL
          </Link>{" "}
          en cas de non-respect de vos droits.
        </li>
      </ul>
      <Typography sx={{ marginTop: "1em" }}>
        Pour exercer vos droits, veuillez nous contacter à l'adresse suivante :{" "}
        <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Responsabilité
      </Typography>
      <Typography>
        Dauphinéo met tout en œuvre pour assurer l'exactitude des informations diffusées sur son site. Cependant, l'éditeur ne peut garantir
        l'exactitude, l'exhaustivité ou la mise à jour des informations disponibles. L'utilisation du site se fait sous la seule
        responsabilité de l'utilisateur. Dauphinéo décline toute responsabilité en cas de dommages directs ou indirects résultant de l'accès
        ou de l'utilisation de ce site.
      </Typography>
    </Box>
  );
}

export default MentionsLeg;
