import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const ButtonCustom = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    borderRadius: '2em',
    fontWeight: 500,
    '&:hover': {
        boxShadow: 'none',
    },
});

// styled() perd la prop polymorphe `component` : on garde le typage de Button
// pour pouvoir écrire <ButtonCustom component={RouterLink} to="…">.
export default ButtonCustom as typeof Button;
