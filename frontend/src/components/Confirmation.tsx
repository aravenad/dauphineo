import type { ReactNode } from "react";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { ButtonCustom } from "./mui_custom";
import { useTextes } from "../i18n";

interface ConfirmationProps {
    open: boolean;
    titre: string;
    children: ReactNode;
    /** Libellé du bouton qui exécute l'action, toujours explicite ("Annuler la visite" plutôt que "OK") */
    confirmer: string;
    retour?: string;
    enCours?: boolean;
    erreur?: string;
    /** Champ à remplir avant de confirmer, placé sous le texte */
    champ?: ReactNode;
    desactive?: boolean;
    onConfirmer: () => void;
    onFermer: () => void;
}

/** Remplace window.confirm pour les actions destructrices : même apparence que le reste du site */
function Confirmation({ open, titre, children, confirmer, retour, enCours = false, erreur, champ, desactive = false, onConfirmer, onFermer }: ConfirmationProps) {
    const t = useTextes({ fr: { retour: "Retour" }, en: { retour: "Back" } });
    const fermer = () => {
        if (!enCours) onFermer();
    };

    return (
        <Dialog
            open={open}
            onClose={fermer}
            fullWidth
            maxWidth="xs"
            aria-labelledby="confirmation-titre"
            aria-describedby="confirmation-texte"
            slotProps={{ paper: { sx: { borderRadius: "1.5em", p: 1 } } }}
        >
            <DialogTitle id="confirmation-titre" sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 700 }}>
                <Box
                    aria-hidden
                    sx={{ flex: "0 0 auto", width: 40, height: 40, borderRadius: "0.75em", display: "grid", placeItems: "center", backgroundColor: "#FDECEA", color: "error.main" }}
                >
                    <WarningAmberRoundedIcon />
                </Box>
                {titre}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-texte" component="div" sx={{ color: "text.primary", lineHeight: 1.6 }}>
                    {children}
                </DialogContentText>
                {champ && <Box sx={{ mt: 2 }}>{champ}</Box>}
                {erreur && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {erreur}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: "wrap" }}>
                {/* Le focus va sur le bouton sans risque : Entrée par réflexe ne détruit rien */}
                <ButtonCustom onClick={fermer} disabled={enCours} autoFocus={!champ}>
                    {retour ?? t.retour}
                </ButtonCustom>
                <ButtonCustom variant="contained" color="error" onClick={onConfirmer} disabled={enCours || desactive}>
                    {confirmer}
                </ButtonCustom>
            </DialogActions>
        </Dialog>
    );
}

export default Confirmation;
