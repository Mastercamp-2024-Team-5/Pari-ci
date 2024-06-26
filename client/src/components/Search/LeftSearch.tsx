import { Center, Stack, VStack, Input, Button, Flex } from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import { useHomeContext } from "./../Home/HomeContext";
import { HeaderTitle } from "./HeaderTitle.tsx";
import { ActiveRightPage } from "../Shared/enum.tsx";
import { ActiveSearchInput } from "../Shared/types.tsx";
import { useEffect, useState } from "react";

type Props = {
  fetchMeilisearchResults: (textQuery: string) => void;
  setSelectedSearch: (selectedSearch: ActiveSearchInput) => void;
};

const LeftSearch = ({ fetchMeilisearchResults, setSelectedSearch }: Props) => {
  const {
    departure,
    destination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    setDataPath,
    setActiveRightPage: setRightactiveRightPage,
  } = useHomeContext();

  const [departureInput, setDepartureInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  useEffect(() => {
    if (departure === null) {
      setDepartureInput("");
    } else {
      setDepartureInput(departure.name);
    }
  }, [departure]);

  useEffect(() => {
    if (destination === null) {
      setDestinationInput("");
    } else {
      setDestinationInput(destination.name);
    }
  }, [destination]);

  const screenWidth = useScreenWidth();
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  const handleClickItineraire = async () => {
    try {
      if (startAt === "" && endAt === "") {
        throw new Error("Please select a date and time");
      }
      if (departure === null) {
        throw new Error("Please select a departure stop");
      }
      if (destination === null) {
        throw new Error("Please select a destination stop");
      }
      setDataPath(["", []]);
      const date_string = startAt === "" ? endAt : startAt;
      // parse date
      console.log(date_string);
      const date = new Date(date_string);
      // remove timezone offset
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      // custom format YYYYMMDD and HH:MM:SS
      fetch(
        `http://127.0.0.1:8000/path?start_stop=${departure.id}&end_stop=${destination.id}&date=${date.toISOString().slice(0, 10)}&time=${date.toISOString().slice(11, 19)}${endAt === "" ? "" : "&reverse"}`
      )
        .then((response) => {
          if (response.status === 404) {
            throw new Error(
              "No path has been found between these two stops at this time"
            );
          } else if (!response.ok) {
            throw new Error("An error occurred while fetching the data");
          } else {
            return response.json();
          }
        })
        .then((data) => {
          setDataPath(data);
          setRightactiveRightPage(ActiveRightPage.Trip);
        })
        .catch((error) => {
          setErrorMessages(error.message);
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessages(error.message);
      }
    }
  };

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
            onChange={(e) => {
              fetchMeilisearchResults(e.target.value);
              setDepartureInput(e.target.value);
            }}
            onFocus={(e) => {
              setRightactiveRightPage(ActiveRightPage.MeilisearchResults);
              setSelectedSearch(ActiveSearchInput.Departure);
              fetchMeilisearchResults(e.target.value);
              e.target.select();
            }}
            onBlur={() => {
              setRightactiveRightPage(ActiveRightPage.Map);
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
            value={departureInput}
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
            onChange={(e) => {
              fetchMeilisearchResults(e.target.value);
              setDestinationInput(e.target.value);
            }}
            onFocus={(e) => {
              setRightactiveRightPage(ActiveRightPage.MeilisearchResults);
              setSelectedSearch(ActiveSearchInput.Destination);
              fetchMeilisearchResults(e.target.value);
              e.target.select();
            }}
            onBlur={() => {
              setRightactiveRightPage(ActiveRightPage.Map);
            }}
            value={destinationInput}
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
            <div style={{ minWidth: "48%", marginRight: "2%" }}>
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
                onFocus={(e) => {
                  // set default value to current date and time
                  if (startAt === "") {
                    setEndAt("");
                    setStartAt(new Date().toISOString().slice(0, 16));
                  } else {
                    e.target.select();
                  }
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
                onFocus={(e) => {
                  // set default value to current date and time
                  if (endAt === "") {
                    setStartAt("");
                    setEndAt(new Date().toISOString().slice(0, 16));
                  } else {
                    e.target.select();
                  }
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
          {errorMessages && (
            <Flex
              w="100%"
              bg="red.200"
              color="red.900"
              p={4}
              borderRadius="15"
              justifyContent="center"
            >
              {errorMessages}
            </Flex>
          )}
        </VStack>
      </Stack>
    </Center>
  );
};

export default LeftSearch;
