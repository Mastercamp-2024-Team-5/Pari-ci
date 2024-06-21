import {
  Center,
  Stack,
  VStack,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useRef } from "react";
import useScreenWidth from "../Shared/useScreenWidth";
import { useHomeContext } from './../Home/HomeContext';
import { HeaderTitle } from "../Shared/HeaderTitle.tsx";

type Props = {
  fetchDepartureResults: (textQuery: string) => void;
  fetchDestinationResults: (textQuery: string) => void;
  setIsDepartureFocus: (value: boolean) => void;
  setIsDestinationFocus: (value: boolean) => void;
}

type Stop = {
  stop_name: string;
  parent_station: string;
}

const LeftSearch = ({
  fetchDepartureResults,
  fetchDestinationResults,
  setIsDepartureFocus,
  setIsDestinationFocus,
}: Props) => {
  const { departure, setDeparture, destination, setDestination, startAt, setStartAt, endAt, setEndAt, setItinerairePage, setDataPath } = useHomeContext();
  const screenWidth = useScreenWidth();
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  const handleClickItineraire = async () => {
    try {
      if (startAt === "" && endAt === "") {
        throw new Error("Please fill in the date and time");
      }
      const response = await fetch("http://127.0.0.1:8000/stops?metro&rer&tram");
      const data: Stop[] = await response.json();
      const departure_parent = data.find((stop) => stop.stop_name === departure)?.parent_station;
      if (!departure_parent) {
        throw new Error("Departure not found");
      }
      const destination_parent = data.find((stop) => stop.stop_name === destination)?.parent_station;
      if (!destination_parent) {
        throw new Error("Destination not found");
      }
      setItinerairePage(true);
      setDataPath({});
      const date = "2024-06-17";
      const time = "08:00:00";
      fetch("http://127.0.0.1:8000/path?start_stop="+departure_parent+"&end_stop="+destination_parent+"&date="+date+"&time="+time)
        .then(response => response.json())
        .then((data ) => {
          setDataPath(data);
        })
        .catch(error => console.error(error));
    } catch (error) {
      alert(error);
    }
  };

  const changeDeparture = (value: string) => {
    setDeparture(value);
    fetchDepartureResults(value);
  }

  const changeDestination = (value: string) => {
    setDestination(value);
    fetchDestinationResults(value);
  }

  // Refs to handle the focus
  const departureBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destinationBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <Center>
      <Stack spacing={8} w="100%">
        <Stack align="center">
          <HeaderTitle />
        </Stack>
        <VStack spacing={15} w="90%" alignSelf="center">
          <Input
            type="text"
            placeholder="Départ"
            onChange={(e) => changeDeparture(e.target.value)}
            onFocus={() => setIsDepartureFocus(true)}
            onBlur={() => {
              departureBlurTimeout.current = setTimeout(() => {
                setIsDepartureFocus(false);
              }, 200);
            }}
            focusBorderColor="#5eaf91"
            fontFamily="Karla"
            variant="outline"
            border="2px"
            borderColor="gray.200"
            rounded="md"
            fontSize={screenWidth < 700 ? "xl" : "lg"}
            p={8}
            bg="white"
            borderRadius="15"
            value={departure}
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
            onChange={(e) => changeDestination(e.target.value)}
            onFocus={() => setIsDestinationFocus(true)}
            onBlur={() => {
              destinationBlurTimeout.current = setTimeout(() => {
                setIsDestinationFocus(false);
              }, 200);
            }}
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
