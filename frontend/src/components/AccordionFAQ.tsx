import React from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Stack,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { AccordionCustom } from "./mui_custom";

function AccordionFAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  // Données dynamiques
  const panels = [
    {
      id: "panel1",
      title: "Lorem Ipsum ?",
      content:
        "Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat Aliquam eget maximus est, id dignissim quam",
    },
    {
      id: "panel2",
      title: "Lorem Ipsum ?",
      content:
        "Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat Aliquam eget maximus est, id dignissim quam",
    },
  ];

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Stack spacing={2}>
      {panels.map((panel) => (
        <AccordionCustom
          key={panel.id}
          expanded={expanded === panel.id}
          onChange={handleChange(panel.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreRounded />}>
            <Typography variant="body1" fontWeight={700}>
              {panel.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{panel.content}</Typography>
          </AccordionDetails>
        </AccordionCustom>
      ))}
    </Stack>
  );
}

export default AccordionFAQ;
