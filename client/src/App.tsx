import { Container } from "@chakra-ui/react";
import LeftSearch from "./components/LeftSearch";
import { ChakraProvider } from "@chakra-ui/react";
import MapScreen from "./components/MapScreen";

function App() {
  return (
    <ChakraProvider>
      <Container margin={0} padding={0} display="flex" justifyContent="space-between" maxW="100vw" h="100vh" bg="gray.100">
        <Container flex="1" bg="F6FBF9" maxW="33vw">
          <LeftSearch />
        </Container>
        <Container flex="1" bg="red.400" maxW="67vw" margin={0} padding={0}>
          <MapScreen />
        </Container>
      </Container>
    </ChakraProvider>
  );
}

export default App;
