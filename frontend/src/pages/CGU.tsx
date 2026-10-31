import { Box, Typography, Divider, Link } from "@mui/material";
import { Link as RouterLink } from "react-router";

function CGU() {
  return (
    <Box sx={{ padding: "2em" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "1em" }}>
        Conditions Générales d'Utilisation (CGU)
      </Typography>
      <Divider sx={{ marginBottom: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        1. Objet
      </Typography>
      <Typography>
        Les présentes CGU ont pour objectif de définir les modalités et conditions d’utilisation des services proposés par Dauphinéo. Elles s’appliquent à tous les utilisateurs de la plateforme, qu’ils soient simples visiteurs ou inscrits.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        2. Accès au site
      </Typography>
      <Typography>
        <ul>
          <li>
            <strong>Disponibilité :</strong> Dauphinéo s’efforce d’assurer l’accès à son site 24h/24, 7j/7. Toutefois, l’accès peut être temporairement suspendu pour des raisons de maintenance ou en cas de force majeure.
          </li>
          <li>
            <strong>Matériel requis :</strong> L’utilisateur est responsable de disposer des équipements (ordinateur, connexion Internet) nécessaires pour accéder au site.
          </li>
        </ul>
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        3. Inscription et Compte Utilisateur
      </Typography>
      <Typography>
        <ul>
          <li>
            <strong>Création de compte :</strong> Certains services nécessitent la création d’un compte en fournissant des informations exactes et à jour (nom, prénom, email, mot de passe, etc.).
          </li>
          <li>
            <strong>Confidentialité :</strong> Vous êtes responsable de la confidentialité de vos identifiants. Toute activité réalisée à partir de votre compte est réputée être effectuée par vous.
          </li>
          <li>
            <strong>Suppression de compte :</strong> Vous pouvez demander la suppression de votre compte à tout moment en nous contactant à :{" "}
            <a href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</a>.
          </li>
        </ul>
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        4. Utilisation des Services
      </Typography>
      <Typography>
        <ul>
          <li>
            <strong>Comportement attendu :</strong> Vous vous engagez à utiliser les services conformément aux lois en vigueur et aux présentes CGU.
          </li>
          <li>
            <strong>Interdictions :</strong>
            <ul>
              <li>Publier du contenu illégal, diffamatoire, ou portant atteinte aux droits de tiers.</li>
              <li>Tenter de pirater le site ou d’en perturber le fonctionnement.</li>
              <li>Utiliser le site à des fins commerciales non autorisées par Dauphinéo.</li>
            </ul>
          </li>
        </ul>
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        5. Propriété Intellectuelle
      </Typography>
      <Typography>
        Tous les contenus présents sur le site Dauphinéo (textes, images, logos) sont la propriété exclusive de Dauphinéo ou de ses partenaires et protégés par les lois sur la propriété intellectuelle. Toute reproduction, distribution, modification ou exploitation non autorisée est strictement interdite.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        6. Protection des Données Personnelles
      </Typography>
      <Typography>
        Les données personnelles collectées sur le site sont traitées conformément à notre{" "}
        <Link component={RouterLink} to="/reglementation">Politique de Confidentialité</Link>. Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition concernant vos données.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        7. Responsabilité
      </Typography>
      <Typography>
        Dauphinéo met tout en œuvre pour assurer l'exactitude des informations diffusées sur son site. Cependant, l'éditeur ne peut garantir l'exactitude ou l'exhaustivité des informations disponibles.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        8. Modification des CGU
      </Typography>
      <Typography>
        Dauphinéo se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront effectives dès leur publication sur cette page.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        9. Droit Applicable et Juridiction
      </Typography>
      <Typography>
        Les présentes CGU sont régies par les lois françaises. Tout litige sera soumis aux juridictions compétentes du ressort du siège de Dauphinéo.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        10. Contact
      </Typography>
      <Typography>
        Pour toute question concernant ces CGU, veuillez nous écrire à :{" "}
        <a href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</a> ou à l’adresse suivante : 2 Place Doyen Gosse, 38000 Grenoble, France.
      </Typography>
    </Box>
  );
}

export default CGU;
