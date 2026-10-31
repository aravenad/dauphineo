import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BalanceIcon from "@mui/icons-material/Balance";
import BlockIcon from "@mui/icons-material/Block";
import CopyrightIcon from "@mui/icons-material/Copyright";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DevicesIcon from "@mui/icons-material/Devices";
import GavelIcon from "@mui/icons-material/Gavel";
import LanguageIcon from "@mui/icons-material/Language";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import RuleIcon from "@mui/icons-material/Rule";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import { CarteInfo, GrilleCartes, PageLegale, SectionLegale } from "../components/PageLegale";
import { useTitre } from "../hooks";
import { useTextes } from "../i18n";

const TEXTES = {
  fr: {
    titre: "Conditions générales d'utilisation",
    intro: "Les règles qui encadrent l'utilisation de Dauphinéo, que vous soyez simple visiteur ou inscrit.",
  },
  en: {
    titre: "Terms of use",
    intro: "The rules for using Dauphinéo, whether you are browsing or have an account.",
  },
};

function CGU() {
  const t = useTextes(TEXTES);
  useTitre(t.titre);
  return (
    <PageLegale
      titre={t.titre}
      intro={t.intro}
    >
      <SectionLegale icone={<DescriptionOutlinedIcon />} titre="Objet">
        <Typography>
          Les présentes CGU ont pour objectif de définir les modalités et conditions d’utilisation des services proposés par Dauphinéo. Elles
          s’appliquent à tous les utilisateurs de la plateforme, qu’ils soient simples visiteurs ou inscrits.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<LanguageIcon />} titre="Accès au site">
        <GrilleCartes colonnes={2}>
          <CarteInfo icone={<ScheduleIcon fontSize="small" />} titre="Disponibilité">
            Dauphinéo s’efforce d’assurer l’accès à son site 24h/24, 7j/7. L’accès peut toutefois être temporairement suspendu pour des raisons
            de maintenance ou en cas de force majeure.
          </CarteInfo>
          <CarteInfo icone={<DevicesIcon fontSize="small" />} titre="Matériel requis">
            L’utilisateur est responsable de disposer des équipements (ordinateur, connexion Internet) nécessaires pour accéder au site.
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>

      <SectionLegale icone={<AccountCircleOutlinedIcon />} titre="Inscription et compte utilisateur">
        <GrilleCartes>
          <CarteInfo icone={<PersonAddAltOutlinedIcon fontSize="small" />} titre="Création de compte">
            Certains services nécessitent un compte, créé avec des informations exactes et à jour (nom, prénom, email, mot de passe, etc.).
          </CarteInfo>
          <CarteInfo icone={<LockOutlinedIcon fontSize="small" />} titre="Confidentialité">
            Vous êtes responsable de la confidentialité de vos identifiants. Toute activité réalisée depuis votre compte est réputée effectuée
            par vous.
          </CarteInfo>
          <CarteInfo icone={<DeleteOutlineIcon fontSize="small" />} titre="Suppression de compte">
            Vous pouvez supprimer votre compte à tout moment, ou en faire la demande à{" "}
            <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>.
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>

      <SectionLegale icone={<RuleIcon />} titre="Utilisation des services">
        <Typography>
          Vous vous engagez à utiliser les services conformément aux lois en vigueur et aux présentes CGU. Il est notamment interdit de :
        </Typography>
        <GrilleCartes>
          <CarteInfo ton="error" icone={<BlockIcon fontSize="small" />} titre="Contenu illicite">
            Publier du contenu illégal, diffamatoire ou portant atteinte aux droits de tiers.
          </CarteInfo>
          <CarteInfo ton="error" icone={<BlockIcon fontSize="small" />} titre="Piratage">
            Tenter de pirater le site ou d’en perturber le fonctionnement.
          </CarteInfo>
          <CarteInfo ton="error" icone={<BlockIcon fontSize="small" />} titre="Usage commercial">
            Utiliser le site à des fins commerciales non autorisées par Dauphinéo.
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>

      <SectionLegale icone={<CopyrightIcon />} titre="Propriété intellectuelle">
        <Typography>
          Les contenus présents sur le site Dauphinéo (textes, images, logos) sont la propriété de Dauphinéo ou de ses partenaires et protégés
          par les lois sur la propriété intellectuelle. Toute reproduction, distribution, modification ou exploitation non autorisée est
          strictement interdite. Les photographies des sites, sous licence libre, suivent les conditions indiquées dans les{" "}
          <Link component={RouterLink} to="/mentions-legales">
            mentions légales
          </Link>
          .
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<ShieldOutlinedIcon />} titre="Protection des données personnelles">
        <Typography>
          Les données personnelles collectées sur le site sont traitées conformément à notre{" "}
          <Link component={RouterLink} to="/reglementation">
            politique de confidentialité
          </Link>
          . Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition concernant vos données.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<BalanceIcon />} titre="Responsabilité">
        <Typography>
          Dauphinéo met tout en œuvre pour assurer l'exactitude des informations diffusées sur son site. Cependant, l'éditeur ne peut garantir
          l'exactitude ou l'exhaustivité des informations disponibles.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<UpdateIcon />} titre="Modification des CGU">
        <Typography>
          Dauphinéo se réserve le droit de modifier les présentes CGU à tout moment. Les modifications sont effectives dès leur publication sur
          cette page.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<GavelIcon />} titre="Droit applicable et juridiction">
        <Typography>
          Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux juridictions compétentes du ressort du siège de
          Dauphinéo.
        </Typography>
      </SectionLegale>

      <SectionLegale icone={<MailOutlineIcon />} titre="Contact">
        <Typography>Pour toute question concernant ces CGU, vous pouvez nous joindre :</Typography>
        <GrilleCartes colonnes={2}>
          <CarteInfo icone={<MailOutlineIcon fontSize="small" />} titre="Par email">
            <Link href="mailto:contact.dauphineo@gmail.com">contact.dauphineo@gmail.com</Link>
          </CarteInfo>
          <CarteInfo icone={<PlaceOutlinedIcon fontSize="small" />} titre="Par courrier">
            2 Place Doyen Gosse, 38000 Grenoble, France
          </CarteInfo>
        </GrilleCartes>
      </SectionLegale>
    </PageLegale>
  );
}

export default CGU;
