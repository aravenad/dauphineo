import { Header, Footer } from "./components/index";
import { Routes, Route } from "react-router";
import { Home, Reglementation, FAQ, MentionsLeg, CGU} from "./pages";
import { Container } from "@mui/material";
import SPR from "./pages/SPR.tsx";

function App() {
  return (
    <>
      <Header />
      <Container sx={{ padding:"2em 2em" }} disableGutters={true}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reglementation" element={<Reglementation />} />
            <Route path="/faq" element={<FAQ/>} />
            <Route path="/spr" element={<SPR />} />
            <Route path="/MentionsLeg" element={<MentionsLeg />} />
            <Route path="/CGU" element={<CGU />} />

        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
