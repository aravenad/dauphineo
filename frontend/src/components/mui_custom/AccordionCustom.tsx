import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";

const AccordionCustom = styled((props: AccordionProps) => (
  <MuiAccordion square {...props} />
))(({ theme }) => ({
  boxShadow: "none",
  backgroundColor: theme.palette.grey[50],
  borderRadius: "8px",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

export default AccordionCustom;
