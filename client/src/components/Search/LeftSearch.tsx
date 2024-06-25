import { Center, Stack, VStack, Input, Button, Flex } from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import { useHomeContext } from "./../Home/HomeContext";
import { HeaderTitle } from "./HeaderTitle.tsx";
import { ActivePage } from "../Shared/enum.tsx";
import { ActiveSearchInput } from "../Shared/types.tsx";
import { useEffect, useState } from "react";

type Props = {
  fetchMeilisearchResults: (textQuery: string) => void;
  setSelectedSearch: (selectedSearch: ActiveSearchInput) => void;
};

const LeftSearch = ({
  fetchMeilisearchResults,
  setSelectedSearch,
}: Props) => {
  const {
    departure,
    destination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    setDataPath,
    setActivePage,
  } = useHomeContext();

  const [departureInput, setDepartureInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  useEffect(() => {
    setDepartureInput(departure.name);
  }, [departure]);

  useEffect(() => {
    setDestinationInput(destination.name);
  }, [destination]);

  const screenWidth = useScreenWidth();
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  const handleClickItineraire = async () => {
    try {
      if (startAt === "" && endAt === "") {
        throw new Error("Please fill in the date and time"); //TODO: Make it more user-friendly
      }
      setDataPath(["", []]);
      const date_string = startAt === "" ? endAt : startAt;
      // parse date
      const date = new Date(date_string);
      // custom format YYYYMMDD and HH:MM:SS
      fetch(
        `http://127.0.0.1:8000/path?start_stop=${departure.id}&end_stop=${destination.id}&date=${date.toISOString().slice(0, 10)}&time=${date.toLocaleTimeString()}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDataPath(data);
          setActivePage(ActivePage.Itineraire);
        })
        .catch((error) => {
          if (error.status === 404) {
            throw new Error("An error occurred while fetching the data");
          }
        });
    } catch (error) {
      alert(error);
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
              fetchMeilisearchResults(e.target.value)
              setDepartureInput(e.target.value)
            }}
            onFocus={(e) => {
              setActivePage(ActivePage.MeilisearchResults)
              setSelectedSearch(ActiveSearchInput.Departure)
              e.target.select()
            }}
            onBlur={() => {
              setActivePage(ActivePage.Map)
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
              fetchMeilisearchResults(e.target.value)
              setDestinationInput(e.target.value)
            }}
            onFocus={(e) => {
              setActivePage(ActivePage.MeilisearchResults)
              setSelectedSearch(ActiveSearchInput.Destination)
              e.target.select()
            }}
            onBlur={() => {
              setActivePage(ActivePage.Map)
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
        </VStack>
      </Stack>
    </Center>
  );
};

export default LeftSearch;
