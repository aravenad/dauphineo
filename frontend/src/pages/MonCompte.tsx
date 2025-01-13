import { Box, Button, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import {useState} from "react";
import {ButtonCustom} from "../components/mui_custom";

const Sidebar = () => {

    const [selected, setSelected] = useState("profil"); // "profil" par défaut

    return (
        <Box
            sx={{
                width: "40%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "50px",
                borderRight: "1px solid #e0e0e0",
            }}
        >
            <ButtonCustom
                variant="contained"
                onClick={() => setSelected("profil")}
                sx={{
                    width: "80%",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    backgroundColor: selected === "profil" ? "#E8F9F4" : "white",
                    color: selected === "profil" ? "#000" : "gray",
                    "&:hover": {
                        backgroundColor: "#E8F9F4",
                    },
                }}
            >
                <AccountCircleIcon />
                <Typography>Profil</Typography>
            </ButtonCustom>

            <ButtonCustom
                variant="contained"
                onClick={() => setSelected("confidentialite")}
                sx={{
                    width: "80%",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "10px",
                    backgroundColor: selected === "confidentialite" ? "#E8F9F4" : "white",
                    color: selected === "confidentialite" ? "#000" : "gray",
                    "&:hover": {
                        backgroundColor: "#E8F9F4",
                    },
                }}
            >
                <ShieldIcon />
                <Typography>Confidentialité</Typography>
            </ButtonCustom>
        </Box>
    );
};

const MainPage = () => {
    return (
        <Box
            sx={{
                width: "75%",
                height: "500px",
                margin: "0 auto",
                display: "flex",
            }}
        >

            <Sidebar />

            <Box
                sx={{
                    width: "60%",
                    height: "100%",
                }}
            ></Box>
        </Box>
    );
};

export default MainPage;