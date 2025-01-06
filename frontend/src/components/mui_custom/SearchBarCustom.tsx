import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from '@mui/icons-material/Search';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "2em",
  border:"1px solid",
  borderColor: theme.palette.text.secondary,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "75%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(3),
//     width: "auto",
//   },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
  
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // transition: theme.transitions.create("width"),
   width: "100%",
    // [theme.breakpoints.up("md")]: {
    //   width: "20ch",
    // },
  },
}));

export default function SearchBarCustom() {
    return (
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{color:"common.black"}}/>
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Des endroits à visiter en Isère"
            inputProps={{ "aria-label": "search" }}
            fullWidth
          />
        </Search>
    );
}
