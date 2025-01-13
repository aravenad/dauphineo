import { Header, Footer } from "./components/index";
import { Routes, Route } from "react-router";
import { Home, Reglementation, FAQ } from "./pages";
import { Container } from "@mui/material";
import MonCompte from "./pages/MonCompte.tsx";

function App() {
  return (
    <>
      <Header />
      <Container sx={{ padding:"2em 6em" }} disableGutters={true}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reglementation" element={<Reglementation />} />
            <Route path="/mon-compte" element={<MonCompte />} />
            <Route path="/faq" element={<FAQ/>} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
