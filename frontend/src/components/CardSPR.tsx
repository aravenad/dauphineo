import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from "@mui/material";

function CardSPR() {
  return (
    <>
      <Card sx={{ maxWidth: 200, boxShadow:"none" }}>
        <CardActionArea>
          <CardMedia
            sx={{ height: 200, borderRadius:"1em" }}
            image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1531804055935-76f44d7c3621%3Fixlib%3Drb-1.2.1%26q%3D80%26fm%3Djpg%26crop%3Dentropy%26cs%3Dtinysrgb%26w%3D1080%26fit%3Dmax%26ixid%3DeyJhcHBfaWQiOjEyMDd9&f=1&nofb=1&ipt=22bc51d9b28789d6288416ee638981124d8cf950f03d3d255c32351e1952884d&ipo=images"
            title=""
          />
          <CardContent sx={{padding:'1em 0 0 0'}}>
            <Typography variant="body1" fontWeight={700}>
              Saint-Antoine-l'Abbaye
            </Typography>
            <Typography variant="body1">Village médiéval</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default CardSPR;
