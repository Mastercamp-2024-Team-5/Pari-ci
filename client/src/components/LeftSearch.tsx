import {
  Center,
  Stack,
  Heading,
  VStack,
  FormControl,
  Input,
  InputGroup,
  Button,
  Flex,
} from "@chakra-ui/react";
import Icon from "./Icon";
import useScreenWidth from "./useScreenWidth";
import { useState } from "react";

const LeftSearch = () => {
  const screenWidth = useScreenWidth();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  return (
    <Center>
      <Stack spacing={8} w="100%">
        <Stack align="center">
          <Heading fontFamily="Karla" marginTop="15%" fontSize="4xl">
            Citymapper
          </Heading>
          {/* <Text
            fontFamily="Karla"
            fontSize="lg"
            color="32403B"
            mb={4}
            marginBottom="15%"
          > 
            Subtitle
          </Text> */}
          <Icon item="barre" color="a" />
        </Stack>
        <VStack spacing={15} w="90%" alignSelf="center">
          <Input
            focusBorderColor="#5eaf91"
            fontFamily="Karla"
            variant="outline"
            border="2px"
            borderColor="gray.200"
            rounded="md"
            type="text"
            placeholder="Départ"
            fontSize="lg"
            p={8}
            bg="white"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          <Input
            focusBorderColor="#5eaf91"
            fontFamily="Karla"
            variant="outline"
            border="2px"
            borderColor="gray.200"
            rounded="md"
            type="text"
            placeholder="Destination"
            fontSize="lg"
            p={8}
            bg="white"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Flex maxW={"100%"} margin={0} padding={0} display={"flex"} flex={1} direction={"row"} align="center" justify="center">
            <Input
              focusBorderColor="#5eaf91"
              fontFamily="Karla"
              variant="outline"
              border="2px"
              borderColor="gray.200"
              rounded="md"
              type="text"
              placeholder="Partir à"
              fontSize="lg"
              p={8}
              bg="white"
              width="48%"
              marginRight={'5%'}
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
            />
            <Input
              focusBorderColor="#5eaf91"
              fontFamily="Karla"
              variant="outline"
              border="2px"
              borderColor="gray.200"
              rounded="md"
              type="text"
              placeholder="Partir à"
              fontSize="lg"
              p={8}
              bg="white"
              width="48%"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </Flex>
        </VStack>
        
        <Button
          fontFamily="Karla"
          bg="#84C7AE"
          color="white"
          _hover={{
            bg: "#5eaf91",
          }}
          rounded="md"
          fontSize="xl"
          width="60%"
          alignSelf="center"
          borderRadius="15"
          p={8} // Added padding
        >
          Trouver l’itinéraire
        </Button>
      </Stack>
    </Center>
  );
};

export default LeftSearch;
