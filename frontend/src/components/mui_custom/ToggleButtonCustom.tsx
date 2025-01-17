import {styled} from "@mui/system";
import Button from "@mui/material/Button";

const ToggleButtonCustom = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    borderRadius: "2em",
    fontWeight: 500,
    padding: "0.5em 1em",
    border: "1px solid",
    borderColor: theme.palette.grey[400],
    "&.selected": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        borderColor: theme.palette.primary.main,
    },
    "&:hover": {
        backgroundColor: theme.palette.primary.light,
        boxShadow: "none",
    },
    "&.selected:hover": {
        backgroundColor: theme.palette.primary.main,
    },


}));

export default ToggleButtonCustom;