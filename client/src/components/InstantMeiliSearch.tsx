import {
  Center,
  Stack,
  Heading,
  VStack,
  // FormControl,
  Input,
  // InputGroup,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import Icon from "./Icon";
import useScreenWidth from "./useScreenWidth";
import InstantMeiliSearchApp from "./InstantMeiliSearch";

const LeftSearch = ({
  departure,
  setDeparture,
  destination,
  setDestination,
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  setItininerairePage,
}: {
  departure: string;
  setDeparture: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  startAt: string;
  setStartAt: React.Dispatch<React.SetStateAction<string>>;
  endAt: string;
  setEndAt: React.Dispatch<React.SetStateAction<string>>;
  setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const screenWidth = useScreenWidth();

  const handleClickItineraire = () => {
    if (
      departure !== "" &&
      destination !== "" &&
      startAt !== "" &&
      endAt !== ""
    ) {
      setItininerairePage(true);
    }
  };

  return (
    <Center>
      <Stack spacing={8} w="100%">
        <Stack align="center">
          <Heading
            fontFamily="Karla"
            fontWeight="600"
            marginTop="15%"
            fontSize={screenWidth < 600 ? "5xl" : "4xl"}
            marginBottom="5%"
          >
            CITYMAPPER
          </Heading>
          <Text fontSize={screenWidth < 600 ? "xl" : "lg"} marginBottom="5%">
            Trouvez votre itinéraire
          </Text>
          <Icon item="barre" color="a" />
        </Stack>
        <InstantMeiliSearchApp />
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
            fontSize={screenWidth < 600 ? "xl" : "lg"}
            p={8}
            bg="white"
            borderRadius="15"
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
            fontSize={screenWidth < 600 ? "xl" : "lg"}
            p={8}
            bg="white"
            borderRadius="15"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Flex
            maxW={"100%"}
            margin={0}
            padding={0}
            display={"flex"}
            flex={1}
            direction={"row"}
            align="center"
            justify="center"
          >
            <Input
              focusBorderColor="#5eaf91"
              fontFamily="Karla"
              variant="outline"
              border="2px"
              borderColor="gray.200"
              rounded="md"
              type="text"
              placeholder="Partir à"
              fontSize={screenWidth < 600 ? "xl" : "lg"}
              p={8}
              bg="white"
              width="48%"
              borderRadius="15"
              marginRight={"5%"}
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
              placeholder="Arriver à"
              fontSize={screenWidth < 600 ? "xl" : "lg"}
              p={8}
              bg="white"
              width="48%"
              borderRadius="15"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
            />
          </Flex>
          <Button
            fontFamily="Karla"
            bg="#84C7AE"
            color="white"
            _hover={{
              bg: "#5eaf91",
            }}
            rounded="md"
            marginBottom={screenWidth < 600 ? "5%" : "0%"}
            fontSize={screenWidth < 600 ? "3xl" : "xl"}
            whiteSpace="wrap"
            width={screenWidth < 600 ? "80%" : "80%"}
            alignSelf="center"
            borderRadius="15"
            marginTop="10%"
            p={screenWidth < 600 ? 10 : 8} // Added padding
            onClick={handleClickItineraire}
          >
            Trouver l’itinéraire
          </Button>
        </VStack>
      </Stack>
    </Center>
  );
};

export default LeftSearch;
