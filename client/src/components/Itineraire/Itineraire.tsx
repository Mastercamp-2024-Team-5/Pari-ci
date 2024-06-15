import {
  Center,
  Stack,
  Heading,
  Button,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import Stop from "./Stop";
import useScreenWidth from "../Shared/useScreenWidth";
import MapScreen from "../Map/MapScreen";
import StopDetail from "./StopDetail";
import { useState } from "react";
import MoreDetails from "./MoreDetails";

const Itineraire = ({
  departure,
  destination,
  startAt,
  endAt,
  setItininerairePage,
}: {
  departure: string;
  destination: string;
  startAt: string;
  endAt: string;
  setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const screenWidth = useScreenWidth();

  const [moreDetails, setMoreDetails] = useState(false);
  const stopDetail1 = {
    stop: "Gare de Lyon",
    line: "7",
    color: "#F3A4BA",
    textColor: "black",
    depart: "12:00",
    direction: "Mairie d'Ivry",
    arrive: false
  };
  const stopDetail2 = {
    stop: "Porte de Choisy",
    line: "7",
    color: "#F3A4BA",
    textColor: "black",
    depart: "12:10",
    direction: "Villejuif-Louis Aragon",
    arrive: false
  };

  const renderMoreDetails = () => (
    <div style={{
      overflowY: 'auto',
      maxHeight: screenWidth < 600 ? 'calc(100vh - 450px)' : '100%',
      maxWidth: '100%',
      borderRadius: '10px',
      padding: '10px',
      marginTop: '10px',
    }}>
      <MoreDetails ligne={stopDetail1.line} arret1={stopDetail1.stop} arret2={stopDetail2.stop} depart={stopDetail1.depart} arrive={stopDetail1.depart} direction={stopDetail1.direction} nbrArrets={10} color={stopDetail1.color} textColor={stopDetail1.textColor} correspondance={false}/>
      <MoreDetails ligne={stopDetail1.line} arret1={stopDetail1.stop} arret2={stopDetail2.stop} depart={stopDetail1.depart} arrive={stopDetail1.depart} direction={stopDetail1.direction} nbrArrets={10} color={stopDetail1.color} textColor={stopDetail1.textColor} correspondance={true}/>
      <MoreDetails ligne={stopDetail1.line} arret1={stopDetail1.stop} arret2={stopDetail2.stop} depart={stopDetail1.depart} arrive={stopDetail1.depart} direction={stopDetail1.direction} nbrArrets={10} color={stopDetail1.color} textColor={stopDetail1.textColor} correspondance={true}/>
      <Text fontSize="xl" fontWeight="550" textAlign="start" marginTop="5%" marginLeft={"4%"}>
        Arrivé à xx:xx
      </Text>
    </div>
  );

  return (
    <Flex flex={1} direction={screenWidth < 600 ? "column" : "row"} w="100%" h="100%" overflow="hidden">
      <Box bg="#F6FBF9" w={screenWidth < 600 ? "100%" : "33%"} h="100%" p={4}>
        <Center>
          <Stack spacing={0} w="100%">
            <Stack align="center" margin={0} padding={0}>
              <Heading
                fontFamily="Karla"
                fontWeight="600"
                marginTop={screenWidth < 600 ? "5%" : "15%"}
                fontSize={screenWidth < 600 ? "5xl" : "4xl"}
                marginBottom={"5%"}
              >
                CITYMAPPER
              </Heading>
            </Stack>
            <Stack spacing={5}>
              <Stack marginX={"0%"} maxW={"100%"}>
                <Stop
                  stop={departure}
                  line={"7"}
                  color={"pink.200"}
                  textColor={"black"}
                />
                <Stop
                  stop={destination}
                  line={"7"}
                  color={"pink.200"}
                  textColor={"black"}
                />
              </Stack>
              {
                screenWidth >= 600 && (
                  <>
                    <Heading
                      textDecoration="underline"
                      textAlign="start"
                      fontFamily="Karla"
                      fontWeight="600"
                      fontSize={screenWidth < 600 ? "4xl" : "3xl"}
                      marginY="0"
                      marginLeft="5%"
                    >
                      Itinéraire :
                    </Heading>
                    <Flex
                      marginY={0}
                      maxW={"100%"}
                      border={"2px solid black"}
                      marginX={"5%"}
                      bg="white"
                      borderRadius={"10px"}
                      direction={"column"}
                      padding={4}
                      paddingY={2}
                      boxShadow="0px 0px 20px rgba(0, 0, 0, 0.3)"
                    >
                      <Heading
                        fontFamily="Karla"
                        fontWeight="550"
                        fontSize="2xl"
                        marginBottom="2%"
                      >
                        Arrivé à xx:xx
                      </Heading>
                      <Stack spacing={0}>
                        <StopDetail
                          {...stopDetail1}
                        />
                        <StopDetail
                          {...stopDetail2}
                        />
                      </Stack>
                      <Text
                        onClick={() => setMoreDetails(!moreDetails)}
                        fontSize={"md"}
                        color={"#273DFF"}
                        textDecoration={"underline"}
                        alignSelf={"end"}
                        _hover={{ cursor: "pointer" }}
                      >
                        {moreDetails ? "Moins de détails" : "Plus de détails"}
                      </Text>
                    </Flex>
                  </>
                )
              }
            </Stack>
            <Button
              bg="#C78484"
              color="white"
              onClick={() => setItininerairePage(false)}
              padding={7}
              fontSize={screenWidth < 600 ? "3xl" : "2xl"}
              whiteSpace="wrap"
              width={"45%"}
              alignSelf="center"
              borderRadius="15px"
              margin={0}
              marginTop={"5%"}
            >
              Annuler
            </Button>
            {
              screenWidth < 600 && (
                <>
                  {renderMoreDetails()}
                  <Button
                    bg="#84C7AE"
                    color="white"
                    _hover={{
                      bg: "#5eaf91",
                    }}
                    onClick={() => setItininerairePage(false)}
                    padding={7}
                    fontSize={screenWidth < 600 ? "3xl" : "2xl"}
                    whiteSpace="wrap"
                    width={"90%"}
                    alignSelf="center"
                    borderRadius="15px"
                    margin={0}
                    marginTop={"5%"}
                  >
                    Voir sur la carte
                  </Button>
                </>
              )
            }
          </Stack>
        </Center>
      </Box>
      {
        screenWidth >= 600 && !moreDetails &&(
          <Box w="67%" h="100%" display="flex">
            <MapScreen />
          </Box>
        )
      }
      {
        screenWidth >= 600 && moreDetails && (
          <Flex padding={"5%"} paddingY={"2%"} direction={"column"} w="67%" h="100%" display="flex" bg="white">
            <Text
              onClick={() => setMoreDetails(!moreDetails)}
              fontSize={"md"}
              color={"#273DFF"}
              textDecoration={"underline"}
              alignSelf={"start"}
              _hover={{ cursor: "pointer" }}
            >
              Retour
            </Text>
            <Text 
              fontSize="4xl" 
              fontWeight="600" 
              textAlign="start" 
              marginTop={"2%"}
            >
              Votre trajet : 
            </Text>
            {renderMoreDetails()}
          </Flex>
        )
      }
    </Flex>
  );
};

export default Itineraire;
