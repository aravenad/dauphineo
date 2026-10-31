import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const ButtonCustom = styled(Button)(({ theme }) => ({
    boxShadow: 'none',
    textTransform: 'none',
    borderRadius: '2em',
    fontWeight: 500,
    // Le bouton s'enfonce légèrement sous le doigt ou la souris
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color', 'transform'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        boxShadow: 'none',
    },
    '&:active': {
        transform: 'scale(0.97)',
    },
}));

// styled() perd la prop polymorphe `component` : on garde le typage de Button
// pour pouvoir écrire <ButtonCustom component={RouterLink} to="…">.
export default ButtonCustom as typeof Button;
