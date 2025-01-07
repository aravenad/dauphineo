import { Typography, Stack } from "@mui/material";
import { AccordionFAQ } from "../components";

function FAQ() {
  return (
    <>
      <Stack sx={{ justifyContent: "center", alignItems: "center", mb:4 }}>
        <Typography variant="h6" fontWeight={700}>
          FAQ - Questions fréquemment posées
        </Typography>
      </Stack>
      <AccordionFAQ />
    </>
  );
}

export default FAQ;
