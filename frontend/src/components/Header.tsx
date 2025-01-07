import { useState } from "react";
import {
  Stack,
  Box,
  Link,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { Language } from "@mui/icons-material";
import LogoVert from "../assets/dauphineo_logo_vert.png";
import { ButtonCustom } from "./mui_custom";
import { ConnexionDialog } from "./index";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDialog = () => {};

  return (
    <Stack
      direction="row"
      sx={{
        padding: "1em 6em",
        borderBottom: "1px solid",
        borderBottomColor: "rgba(0,0,0,0.2)",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Link href="#">
          <Box
            component="img"
            src={LogoVert}
            alt="logo"
            sx={{
              width: "40%",
              height: "auto",
            }}
          />
        </Link>
      </Box>
      <Stack direction="row" sx={{ alignItems: "center" }} spacing={4}>
        <Link
          href="#"
          variant="body1"
          sx={{
            fontWeight: 500,
            color: "common.black",
            textDecoration: "none",
          }}
        >
          Explorer
        </Link>
          <IconButton
            aria-label="close"
            sx={(theme) => ({
              color: theme.palette.common.black,
            })}
          >
            <Language />
          </IconButton>
        {isLoggedIn ? (
          <Avatar
            sx={{ bgcolor: "info.main", width: 35, height: 35 }}
            alt="Avatar"
          >
            <Typography variant="body1" color="common.black">
              M
            </Typography>
          </Avatar>
        ) : (
          <ConnexionDialog />
        )}
      </Stack>
    </Stack>
  );
}

export default Header;
