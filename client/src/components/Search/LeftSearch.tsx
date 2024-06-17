import {
  Center,
  Stack,
  Heading,
  VStack,
  Input,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import InstantMeiliSearchApp from "./InstantMeiliSearch";
import { start } from "repl";
import { HomeProvider, useHomeContext } from './../Home/HomeContext';


const LeftSearch = () => {
  const { departure, setDeparture, destination, setDestination, startAt, setStartAt, endAt, setEndAt, ItininerairePage, setItininerairePage } = useHomeContext();
  const screenWidth = useScreenWidth();
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  const handleClickItineraire = () => {
    if (
      departure !== "" &&
      destination !== "" &&
      ((startAt !== "" && dateRegex.test(startAt)) || (endAt !== "" && dateRegex.test(endAt)))
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
            fontWeight="650"
            marginTop={screenWidth < 700 ? "10%" : "15%"}
            fontSize={screenWidth < 700 ? "5xl" : "4xl"}
          >
            CITYMAPPER
          </Heading>
          <Text fontSize={screenWidth < 700 ? "xl" : "lg"} marginBottom="5%">
            Trouvez votre itinéraire
          </Text>
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
            fontSize={screenWidth < 700 ? "xl" : "lg"}
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
            fontSize={screenWidth < 700 ? "xl" : "lg"}
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
            align="space-between"
            justify="space-between"
            width="100%"
          >
            <div style={{minWidth: "48%", marginRight: "2%"}}>
              <Input
                color={dateRegex.test(startAt) ? "black" : "gray.400"}
                focusBorderColor="#5eaf91"
                fontFamily="Karla"
                variant="outline"
                border="2px"
                borderColor="gray.200"
                rounded="md"
                type="datetime-local"
                fontSize={screenWidth < 700 ? "xl" : "xs"}
                bg="white"
                width="100%" // Ensuring constant width
                paddingTop={6}
                paddingBottom={8}
                textAlign="center"
                borderRadius="15"
                margin={"0%"}
                value={startAt}
                whiteSpace="nowrap"
                overflow={"hidden"}
                onChange={(e) => {
                  setEndAt("");
                  setStartAt(e.target.value);
                }}
              />
            </div>
            <div style={{ minWidth: "48%" }}>
              <Input
                color={dateRegex.test(endAt) ? "black" : "gray.400"}
                focusBorderColor="#5eaf91"
                fontFamily="Karla"
                variant="outline"
                border="2px"
                borderColor="gray.200"
                rounded="md"
                type="datetime-local"
                fontSize={screenWidth < 700 ? "xl" : "xs"}
                bg="white"
                width="100%" // Ensuring constant width
                paddingTop={6}
                paddingBottom={8}
                textAlign="center"
                borderRadius="15"
                margin={"0%"}
                value={endAt}
                whiteSpace="nowrap"
                overflow={"hidden"}
                onChange={(e) => {
                  setStartAt("");
                  setEndAt(e.target.value);
                }}
              />
            </div>
          </Flex>
          <Button
            fontFamily="Karla"
            bg="#84C7AE"
            color="white"
            _hover={{
              bg: "#5eaf91",
            }}
            rounded="md"
            marginBottom={screenWidth < 700 ? "5%" : "0%"}
            fontSize={screenWidth < 700 ? "2xl" : "xl"}
            whiteSpace="wrap"
            width={screenWidth < 700 ? "80%" : "80%"}
            alignSelf="center"
            borderRadius="15"
            p={screenWidth < 700 ? 10 : 8} // Added padding
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
