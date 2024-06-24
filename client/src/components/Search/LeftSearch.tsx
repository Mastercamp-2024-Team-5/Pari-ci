import React, { useRef } from "react";
import { Center, Stack, VStack, Input, Button, Flex } from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth";
import { useHomeContext } from "./../Home/HomeContext";
import { HeaderTitle } from "../Shared/HeaderTitle.tsx";
import { useNavigate } from "react-router-dom";

type Props = {
  fetchDepartureResults: (textQuery: string) => void;
  fetchDestinationResults: (textQuery: string) => void;
  setIsDepartureFocus: (value: boolean) => void;
  setIsDestinationFocus: (value: boolean) => void;
};

const LeftSearch = ({
  fetchDepartureResults,
  fetchDestinationResults,
  setIsDepartureFocus,
  setIsDestinationFocus,
}: Props) => {
  const {
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    setDataPath,
    setErrorWhileFetching,
  } = useHomeContext();
  const screenWidth = useScreenWidth();
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  // Refs to handle the focus
  const departureBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const destinationBlurTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/path/"); // Replace 'someData' with the actual data you want to pass
  };

  const handleClickItineraire = async () => {
    try {
      if (startAt === "" && endAt === "") {
        throw new Error("Please fill in the date and time");
      }
      handleNavigate();
      setDataPath(["", []]);
      setErrorWhileFetching(false);
      if (endAt === "") {
        fetch(
          `http://127.0.0.1:8000/path?start_stop=${departure}&end_stop=${destination}&date=${
            startAt.split("T")[0]
          }&time=${startAt.split("T")[1].split(":")[0]}:${
            startAt.split("T")[1].split(":")[1]
          }:00`
        )
          .then((response) => response.json())
          .then((data) => {
            setDataPath(data);
          })
          .catch((error) => {
            setErrorWhileFetching(true);
            console.error(error);
          });
      }
      if (startAt === "") {
        fetch(
          `http://127.0.0.1:8000/path?start_stop=${departure}&end_stop=${destination}&date=${
            endAt.split("T")[0]
          }&time=${endAt.split("T")[1].split(":")[0]}:${
            endAt.split("T")[1].split(":")[1]
          }:00`
        )
          .then((response) => response.json())
          .then((data) => {
            setDataPath(data);
          })
          .catch((error) => {
            setErrorWhileFetching(true);
            console.error(error);
          });
      }
    } catch (error) {
      alert(error);
    }
  };

  const changeDeparture = (value: string) => {
    setDeparture(value);
    fetchDepartureResults(value);
    if (value) {
      setIsDepartureFocus(true);
    } else {
      setIsDepartureFocus(false);
    }
  };

  const changeDestination = (value: string) => {
    setDestination(value);
    fetchDestinationResults(value);
    if (value) {
      setIsDestinationFocus(true);
    } else {
      setIsDestinationFocus(false);
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
            onChange={(e) => changeDeparture(e.target.value)}
            onFocus={() => {
              if (departureBlurTimeout.current) {
                clearTimeout(departureBlurTimeout.current);
                departureBlurTimeout.current = null;
              }
              if (departure) {
                setIsDepartureFocus(true);
              }
            }}
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
            onFocus={() => {
              if (destinationBlurTimeout.current) {
                clearTimeout(destinationBlurTimeout.current);
                destinationBlurTimeout.current = null;
              }
              if (destination) {
                setIsDestinationFocus(true);
              }
            }}
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
