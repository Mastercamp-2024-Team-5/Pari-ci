import {
  Container,
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Center,
  InputGroup,
  Grid,
  GridItem,
  Text
} from '@chakra-ui/react';
import LeftSearch from './components/LeftSearch';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Container margin={0} padding={0} display="flex" justifyContent="space-between" maxW="100vw" h="100vh" bg="gray.100">
        <Container flex="1" bg="F6FBF9" maxW="33vw">
          <LeftSearch />
        </Container>
        <Container flex="1" bg="red.400" maxW="67vw"></Container>
      </Container>
    </ChakraProvider>
  );
}

export default App;
