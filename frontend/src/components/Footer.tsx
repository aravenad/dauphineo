import {
  Box,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  Link,
} from "@mui/material";
import { Language, Instagram, FacebookRounded, X } from "@mui/icons-material";
import LogoVert from "../assets/dauphineo_logo_vert.png";
import { ButtonCustom } from "./mui_custom";



function Footer() {

  const footerSections = [
    {
      title:'Informations',
      links:[
        {text:'Mentions légales', href:'/MentionsLeg'},
        {text:'Politique de confidentialité', href:'/reglementation'},
        {text:"Conditions générales d'utilisation", href:'/CGU'},
      ],
    },
    {
      title:'Support',
      links: [
        {text:'Contactez-nous', href:''},
        {text:'FAQ', href:'/faq'}
      ],
    },
    {
      title:'À propos',
      links: [
        {text:'Qui sommes-nous ?', href:''},
        {text:'Partenaires', href:''},
        {text:'Actualités', href:''}
      ]
    }
  ]

  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", 
    paddingX:'6em' 
  }}>
      <Box
        component="img"
        src={LogoVert}
        sx={{
          width: "10%",
          height: "auto",
        }}
      />
      <Stack direction="row" sx={{ justifyContent:"space-between", marginTop:'2em'}}>
      {footerSections.map((section) => (
        <Box key={section.title} sx={{flex:1}}>
          <Typography variant="body1" fontWeight={500} sx={{color: "text.secondary"}}>
            {section.title}
          </Typography>
          <List>
            {section.links.map((link) => (
              <ListItem key={link.text} sx={{padding:0}}>
                <Link href={link.href} sx={{paddingY:1, color:'common.white', textDecoration:'none'}}>
                  {link.text}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
      </Stack>
      <Box  sx={{ paddingY: '2em' }}>
        <Typography variant="body1" sx={{ color: "common.white" }}>
          Découvrez les dernières nouvelles sur nos réseaux :
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", paddingTop:'1em' }}>
          <Link href="#">
            <Instagram sx={{ color: "common.white", fontSize: 25 }} />
          </Link>
          <Link href="#">
            <FacebookRounded sx={{ color: "common.white", fontSize: 25 }} />
          </Link>
          <Link href="#">
            <X sx={{ color: "common.white", fontSize: 20 }} />
          </Link>
        </Stack>
      </Box>
      <Divider orientation="horizontal" />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          paddingY: "2em",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
       <ButtonCustom variant="outlined" startIcon={<Language />} sx={{ color:"common.white", borderColor: "common.white"}}>
        FR
       </ButtonCustom>
        <Stack direction="row" spacing={2}>
          <Typography variant="body1" color="common.white">
            2024 Dauphinéo - Tous droits réservés.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Footer;
