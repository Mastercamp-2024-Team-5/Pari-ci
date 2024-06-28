import {
  Center,
  Stack,
  VStack,
  Input,
  Button,
  Flex,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import { useHomeContext } from "./../Home/HomeContext";
import { HeaderTitle } from "./HeaderTitle.tsx";
import { ActiveRightPage } from "../Shared/enum.tsx";
import { ActiveSearchInput } from "../Shared/types.tsx";
import { useEffect, useState, useRef, useCallback } from "react";
import { Icon } from "@chakra-ui/react";
import { MdExpandMore } from "react-icons/md";
import { getCookie } from "../../manageCookies.tsx";
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
  const [selectedDateType, setSelectedDateType] = useState("startAt");
  const { isOpen, onToggle, onClose } = useDisclosure();
  const selectRef = useRef(null);

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
      const date_string = startAt === "" ? endAt : startAt;
      // parse date
      console.log(date_string);
      const date = new Date(date_string);
      // remove timezone offset
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      // custom format YYYYMMDD and HH:MM:SS
      fetch(
        `http://localhost:8000/path?start_stop=${departure.id}&end_stop=${destination.id}&date=${date.toISOString().slice(0, 10)}&time=${date.toISOString().slice(11, 19)}${endAt === "" ? "" : "&reverse"}${getCookie("AccessibleStationOnly") === "true" ? "&pmr" : ""}`
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

  const handleSelectDateType = (value: string) => {
    setSelectedDateType(value);
    onClose();
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (selectRef.current && !(selectRef.current as HTMLElement).contains((event.target as Node))) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

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
            <Box minWidth="48%" marginRight="2%" position="relative" ref={selectRef}>
              <Input
                as="button"
                onClick={onToggle}
                focusBorderColor="#5eaf91"
                fontFamily="Karla"
                variant="outline"
                border="2px"
                borderColor="gray.200"
                rounded="md"
                fontSize={screenWidth < 700 ? "xl" : "lg"}
                lineHeight={0.5}
                bg="white"
                width="100%"
                paddingTop={6}
                paddingBottom={8}
                textAlign="center"
                borderRadius="15"
                margin={"0%"}
                whiteSpace="nowrap"
                overflow={"hidden"}
              >
                <>
                  {selectedDateType === "startAt" ? "Départ" : "Arrivée"}
                </>
                <Icon as={MdExpandMore} />
              </Input>
              {isOpen && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  border="2px"
                  borderColor="gray.200"
                  borderRadius="15"
                  zIndex={1}
                >
                  <Box
                    p={2}
                    onClick={() => handleSelectDateType("startAt")}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                  >
                    Départ
                  </Box>
                  <Box
                    p={2}
                    onClick={() => handleSelectDateType("endAt")}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                  >
                    Arrivée
                  </Box>
                </Box>
              )}
            </Box>
            <Box minWidth="48%">
              <Input
                color={dateRegex.test(selectedDateType === "startAt" ? startAt : endAt) ? "black" : "gray.400"}
                focusBorderColor="#5eaf91"
                fontFamily="Karla"
                variant="outline"
                border="2px"
                borderColor="gray.200"
                rounded="md"
                type="datetime-local"
                fontSize={screenWidth < 700 ? "xl" : "xs"}
                bg="white"
                width="100%"
                paddingTop={6}
                paddingBottom={8}
                textAlign="center"
                borderRadius="15"
                margin={"0%"}
                value={selectedDateType === "startAt" ? startAt : endAt}
                whiteSpace="nowrap"
                overflow={"hidden"}
                onChange={(e) => {
                  if (selectedDateType === "startAt") {
                    setEndAt("");
                    setStartAt(e.target.value);
                  } else {
                    setStartAt("");
                    setEndAt(e.target.value);
                  }
                }}
                onFocus={(e) => {
                  // set default value to current date and time
                  if (selectedDateType === "startAt" && startAt === "") {
                    setEndAt("");
                    setStartAt(new Date((new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
                  } else if (selectedDateType === "endAt" && endAt === "") {
                    setStartAt("");
                    setEndAt(new Date((new Date().getTime() - new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
                  } else {
                    e.target.select();
                  }
                }}
              />
            </Box>
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
            Rechercher
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
