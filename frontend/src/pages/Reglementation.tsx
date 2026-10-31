import { Link, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CarteInfo, GrilleCartes, PageLegale, SectionLegale } from "../components/PageLegale";
import { useTitre } from "../hooks";

function Reglementation() {
  useTitre("Politique de confidentialité");
  return (
    <PageLegale
      titre="Politique de confidentialité"
      intro="Les données que nous collectons, ce que nous en faisons et les droits dont vous disposez pour les contrôler."
    >
      <SectionLegale icone={<GroupsOutlinedIcon />} titre="Qui sommes-nous ?">
        <Typography>
          Nous sommes Dauphinéo, des développeurs spécialisés dans la valorisation des sites patrimoniaux remarquables situés en Isère. Notre
          mission est de mettre en avant le patrimoine culturel en fournissant les ressources nécessaires à sa préservation et en l’intégrant
          dans le développement économique et social d'un territoire.
        </Typography>
        <Typography>
          En accédant à notre site et en utilisant nos services, vous reconnaissez avoir lu et compris la présente politique de
          confidentialité, qui détaille nos principes et pratiques de collecte, d’utilisation et de partage de vos données personnelles.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<StorageOutlinedIcon />} titre="Quelles données collectons-nous ?">
        <GrilleCartes colonnes={2}>
          <CarteInfo icone={<PersonOutlineIcon fontSize="small" />} titre="Données personnelles">
            Par exemple votre nom, prénom, email et mot de passe, collectés lors de la création d’un compte.
          </CarteInfo>
          <CarteInfo icone={<EventNoteOutlinedIcon fontSize="small" />} titre="Données d’utilisation">
            Par exemple les informations liées à vos réservations, vos publications d’avis ou vos candidatures en tant que guide.
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>

      <SectionLegale icone={<TuneIcon />} titre="Comment utilisons-nous vos données ?">
        <GrilleCartes>
          <CarteInfo icone={<NotificationsOutlinedIcon fontSize="small" />} titre="Fournir nos services">
            Par exemple l’envoi de notifications liées à vos réservations.
          </CarteInfo>
          <CarteInfo icone={<HandshakeOutlinedIcon fontSize="small" />} titre="Mise en relation">
            Faciliter la mise en relation entre guides et visiteurs.
          </CarteInfo>
          <CarteInfo icone={<PaymentOutlinedIcon fontSize="small" />} titre="Paiements">
            Gérer vos transactions via notre partenaire de paiement, Stripe.
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>

      <SectionLegale icone={<VerifiedUserOutlinedIcon />} titre="Vos droits sur vos données">
        <Typography>Conformément au RGPD, vous disposez des droits suivants :</Typography>
        <GrilleCartes>
          <CarteInfo icone={<VisibilityOutlinedIcon fontSize="small" />} titre="Droit d’accès">
            Vous pouvez demander à accéder à vos données personnelles.
          </CarteInfo>
          <CarteInfo icone={<EditOutlinedIcon fontSize="small" />} titre="Droit de rectification">
            Vous pouvez demander à corriger des données inexactes.
          </CarteInfo>
          <CarteInfo icone={<DeleteOutlineIcon fontSize="small" />} titre="Droit à l’effacement">
            Vous pouvez demander la suppression de vos données, sous réserve de nos obligations légales.
          </CarteInfo>
        </GrilleCartes>
        <Typography>
          Pour toute demande concernant vos droits, écrivez-nous à{" "}
          <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>.
        </Typography>
      </SectionLegale>
    </PageLegale>
  );
}

export default Reglementation;
