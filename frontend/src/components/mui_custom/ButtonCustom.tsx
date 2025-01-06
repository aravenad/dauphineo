import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';


const ButtonCustom = styled(Button)<ButtonProps>(({ theme }) =>({
    boxShadow:'none',
    textTransform:'none',
    borderRadius:'2em',
    fontWeight:500,
    '&:hover': {
        backgroundColor: 'none',
        boxShadow: 'none',
    },
  }));

export default ButtonCustom;