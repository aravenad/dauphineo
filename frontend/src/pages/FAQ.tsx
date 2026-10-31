import { Typography, Stack } from "@mui/material";
import { AccordionFAQ } from "../components";
import { useTitre } from "../hooks";

function FAQ() {
  useTitre("Foire aux questions");
  return (
    <>
      <Stack sx={{ justifyContent: "center", alignItems: "center", mb:4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          FAQ - Questions fréquemment posées
        </Typography>
      </Stack>
      <AccordionFAQ />
    </>
  );
}

export default FAQ;
