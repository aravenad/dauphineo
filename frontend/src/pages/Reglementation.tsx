import { Box, Typography, Divider } from "@mui/material";

function Reglementation() {
  return (
    <Box sx={{ padding: "2em"}}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "1em" }}>
        Politique de Confidentialité
      </Typography>
      <Divider sx={{ marginBottom: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Qui sommes-nous ?
      </Typography>
      <Typography >
        Nous sommes Dauphinéo, des développeurs spécialisés dans la valorisation des sites patrimoniaux remarquables situés en Isère. Notre mission est de mettre en avant le patrimoine culturel en fournissant les ressources nécessaires à sa préservation et en l’intégrant dans le développement économique et social d'un territoire.
      </Typography>
      <Typography >
        En accédant à notre Site Web et en utilisant nos services, vous reconnaissez avoir lu et compris la présente Politique de confidentialité, ainsi que les pratiques de collecte et de traitement des informations décrites dans ce document.
      </Typography>

      <Typography >
        Cette politique de confidentialité explique en détail nos principes et pratiques concernant la collecte, l’utilisation et le partage de vos données personnelles.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Quelles données collectons-nous ?
      </Typography>
      <Typography >
        Nous collectons deux types de données : <strong>Données personnelles</strong> et <strong>Données d’utilisation</strong>.
      </Typography>
      <Typography >
        <strong>Données personnelles :</strong> Cela inclut, par exemple, votre nom, prénom, email et mot de passe collectés lors de la création d’un compte.
      </Typography>
      <Typography >
        <strong>Données d’utilisation :</strong> Par exemple, les informations liées à vos réservations, vos publications d’avis, ou vos candidatures en tant que guide.
      </Typography>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Comment utilisons-nous vos données ?
      </Typography>
      <Typography >
        Nous utilisons vos données personnelles pour :
      </Typography>
      <ul>
        <li>Fournir nos services, comme l’envoi de notifications liées à vos réservations.</li>
        <li>Faciliter la mise en relation entre guides et utilisateurs.</li>
        <li>Gérer vos transactions via notre partenaire de paiement, Stripe.</li>
      </ul>

      <Divider sx={{ marginY: "2em" }} />

      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5em" }}>
        Vos droits sur vos données personnelles
      </Typography>
      <Typography >
        Conformément au RGPD, vous disposez des droits suivants :
      </Typography>
      <ul>
        <li><strong>Droit d’accès :</strong> Vous pouvez demander à accéder à vos données personnelles.</li>
        <li><strong>Droit de rectification :</strong> Vous pouvez demander à corriger des données inexactes.</li>
        <li><strong>Droit à l’effacement :</strong> Vous pouvez demander la suppression de vos données, sous réserve de nos obligations légales.</li>
      </ul>

      <Typography sx={{ marginTop: "1em" }}>
        Pour toute demande concernant vos droits, veuillez nous contacter à <a href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</a>.
      </Typography>
    </Box>
  );
}

export default Reglementation;
