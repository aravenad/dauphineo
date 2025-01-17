import React from "react";
import { Box, Typography} from "@mui/material";
import CardSPR from "./CardSPR";
import {ButtonCustom} from "./mui_custom";

type ExploreSectionProps = {
    sprList: any[]; // Liste des SPR à afficher
};

const ExploreSection: React.FC<ExploreSectionProps> = ({ sprList }) => {
    // Trie par ordre alphabétique sur nom_commune et limite aux 3 premiers
    const displayedSPR = [...sprList]
        .sort((a, b) => a.nom_commune.localeCompare(b.nom_commune))
        .slice(0, 4);

    return (
        <Box sx={{ padding: "5em 0em" }}>
            {/* Titre et sous-titre */}
            <Typography variant="h4" fontWeight={700} gutterBottom align="left" marginBottom={0}>
                Explorez
            </Typography>
            <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                align="left"
                fontSize="1.2em"
            >
                Découvrez tous les sites patrimoniaux
            </Typography>

            {/* Flex des SPR */}
            <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                width="100%"
                gap={5}
                marginTop={2}
            >
                {displayedSPR.map((spr) => (
                    <Box key={spr.id} height="100%" width="100%">
                        <CardSPR id={spr.id} variante="regular" />
                    </Box>
                ))}
            </Box>

            {/* Bouton Voir tout */}
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
                <ButtonCustom variant="outlined" color="primary" size={"large"} href={"/explorer"}>
                    Voir tout
                </ButtonCustom>
            </Box>
        </Box>
    );
};

export default ExploreSection;