import { ChakraProvider, Container } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Itineraire from "./components/Itineraire/Itineraire";
import {  HomeProvider } from './components/Home/HomeContext';
import HomeOrAccessible from "./components/Pages/HomeOrAccessible";
function App() {
  return (
    <ChakraProvider>
      <Container
        margin={0}
        padding={0}
        display="flex"
        justifyContent="center"
        maxW="100vw"
        maxH="100vh"
        height="100vh"
        bg="gray.100"
      >
        <HomeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomeOrAccessible />} />
              <Route path="/path/:id?" element={<Itineraire />} />
              <Route path="*" element={<HomeOrAccessible />} />
            </Routes>
          </Router>
        </HomeProvider>
      </Container>
    </ChakraProvider>
  );
}

export default App;
