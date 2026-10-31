import { useState } from "react";
import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

/** Champ de mot de passe avec un bouton pour afficher ou masquer la saisie. */
function ChampMotDePasse(props: TextFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={visible ? "text" : "password"}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                onClick={() => setVisible((v) => !v)}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                            >
                                {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}

export default ChampMotDePasse;
