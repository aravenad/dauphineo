import { Typography, Stack } from "@mui/material";
import { AccordionFAQ } from "../components";
import { useTitre } from "../hooks";
import { useTextes } from "../i18n";

function FAQ() {
  const t = useTextes({
    fr: { titre: "Foire aux questions", entete: "FAQ - Questions fréquemment posées" },
    en: { titre: "Frequently asked questions", entete: "FAQ - Frequently asked questions" },
  });
  useTitre(t.titre);
  return (
    <>
      <Stack sx={{ justifyContent: "center", alignItems: "center", mb:4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t.entete}
        </Typography>
      </Stack>
      <AccordionFAQ />
    </>
  );
}

export default FAQ;
