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
import { useState, useEffect } from "react";
import MoreDetails from "./MoreDetails";
import { useHomeContext } from './../Home/HomeContext';
import { TripInfo, Point, Trip } from "../Shared/types";

const Itineraire = () => {
  const defaultPoint: Point = {
    line: "",
    from: "",
    to: "",
    depart: 0,
    travel_time: 0,
    direction: "",
    nbr: 0
  };

  const { departure, destination, setItinerairePage, DataPath } = useHomeContext();
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [data, setData] = useState<TripInfo>({ departure: "", points: [defaultPoint], arrival: "" });
  // const [data, setData] = useState<TripData>({});
  const screenWidth = useScreenWidth();
    //http://localhost:8000/path?start_stop=IDFM:70143&end_stop=IDFM:71264&date=2024-06-14&time=08:00:00

  const [moreDetails, setMoreDetails] = useState(false);

  const getInfosFromData = async (pointList: Trip[]) => {
    const lst = [];
    let lastline = pointList[0].route_short_name;
    let first = pointList[0];
    let last = pointList[0];
    let cpt = 0;
    let travel_time = 0;
    let depart = 0;
    const hash: { [key: string]: string } = {};
  
    for (let i = 0; i < pointList.length; i++) {
      travel_time += pointList[i].travel_time;
      travel_time += pointList[i].wait_time;
      if (pointList[i].route_short_name) {
        if (pointList[i].route_short_name === lastline) {
          last = pointList[i];
          cpt += 1;
        } else {
          lst.push({
            line: lastline,
            from: first.from_stop_id,
            direction: last.trip_id,
            to: last.from_stop_id,
            nbr: cpt - 2,
            travel_time: travel_time,
            depart: depart
          });
          lastline = pointList[i].route_short_name;
          first = last;
          last = pointList[i];
          cpt = 2;
          depart = travel_time + depart;
          travel_time = 0;
        }
      }
    }

    lst.push({
      line: lastline,
      from: first.from_stop_id,
      direction: last.trip_id,
      to: pointList[pointList.length - 1].from_stop_id,
      nbr: cpt - 2,
      travel_time: travel_time,
      depart: depart
    });
  
    const fetchStopName = async (stopId: string) => {
      if (hash[stopId]) {
        return hash[stopId];
      }
      try {
        const response = await fetch(`http://localhost:8000/stop/${stopId}`);
        const data = await response.json();
        hash[stopId] = data[0].stop_name;
        return hash[stopId];
      } catch (error) {
        console.error(error);
        return stopId; // Fallback to stopId in case of error
      }
    };

    const fetchDirection = async (tripIp: string) => {
      if (hash[tripIp]) {
        return hash[tripIp];
      }
      try {
        const response = await fetch(`http://localhost:8000/trip/${tripIp}`);
        const dataTrip = await response.json();
        hash[tripIp] = dataTrip[0].headsign;
        return hash[tripIp];
      } catch (error) {
        console.error(error);
        return tripIp; // Fallback to stopId in case of error
      }
    };
  
    for (let i = 0; i < lst.length; i++) {
      lst[i].from = await fetchStopName(lst[i].from);
      lst[i].to = await fetchStopName(lst[i].to);
      lst[i].direction = await fetchDirection(lst[i].direction);
    }
  
    return lst;
  };

  const additionSecondTime = (time: string, addition: number) => {
    const d = new Date(time);
    d.setSeconds(d.getSeconds() + addition);
    const str = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return str;
  }

  const renderMoreDetails = () => (
    <div style={{
      overflowY: 'auto',
      maxHeight: screenWidth < 700 ? 'calc(100vh - 450px)' : '100%',
      maxWidth: '100%',
      borderRadius: '10px',
      padding: '5px',
      marginTop: '10px',
    }}>
      {
        !isEmpty(data) && data.points.map((obj: Point, index: number) => (
          <MoreDetails key={index} ligne={obj.line} arret1={obj.from} arret2={obj.to} depart={additionSecondTime(data.departure, obj.depart)} arrive={additionSecondTime(data.departure, obj.depart+obj.travel_time)} direction={obj.direction} nbrArrets={obj.nbr} textColor={"black"} correspondance={index>0}/>
        ))
      }
      {!isEmpty(data) && <Text fontSize="xl" fontWeight="550" textAlign="start" marginTop="5%" marginLeft={"4%"}>
        Arrivé à {data.arrival}
      </Text>}
    </div>
  );

  const isEmpty = (obj: TripInfo) => {
    return obj.departure === '' && obj.points.length === 1 && obj.points[0].line === '' && obj.arrival === '';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (DataPath[1][0] != undefined && DataPath.length > 0) {
        const points = await getInfosFromData(DataPath[1]);
        let dt = 0;
        for (let i = 0; i < points.length; i++) {
          dt += points[i].travel_time;
        }
        setData({
          departure: DataPath[0],
          points: points,
          arrival: additionSecondTime(DataPath[0], dt)
        });
      }
    };

    fetchData();
  }, [DataPath]);

  return (
    <Flex flex={1} direction={screenWidth < 700 ? "column" : "row"} w="100%" h="100%" overflow="hidden">
      <Box bg="#F6FBF9" w={screenWidth < 700 ? "100%" : ""} minWidth={screenWidth<700?"0":"400px"} flexBasis={screenWidth<700?"0":"40%"} h="100%" p={4}>
        <Center>
          <Stack spacing={0} w="100%">
            <Stack align="center" margin={0} padding={0}>
              <Heading
                fontFamily="Karla"
                fontWeight="700"
                marginTop={screenWidth <450 ? "5%" : screenWidth < 700 ? "3%" :  screenWidth < 1300 ? "10%" : "15%"}
                fontSize={screenWidth < 700 ? "5xl" : "4xl"}
                marginBottom={screenWidth <450 ? "5%" : screenWidth < 700 ? "3%" : "5%"}
              >
                CITYMAPPER
              </Heading>
            </Stack>
            <Stack spacing={5}>
              <Stack marginX={"0%"} maxW={"100%"}>
                <Stop
                  stop={departure}
                  line={"7"}
                  textColor={"black"}
                />
                <Stop
                  stop={destination}
                  line={"7"}
                  textColor={"black"}
                />
              </Stack>
              {
                screenWidth >= 700 && !isEmpty(data) && (
                  <>
                    <Heading
                      textDecoration="underline"
                      textAlign="start"
                      fontFamily="Karla"
                      fontWeight="700"
                      fontSize={screenWidth < 700 ? "4xl" : "3xl"}
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
                        Arrivé à {data.arrival}
                      </Heading>
                      <Stack spacing={0}>
                        <StopDetail
                          stop={data.points[0].from}
                          line={data.points[0].line}
                          textColor="black"
                          depart={additionSecondTime(data.departure, data.points[0].depart)} 
                          arrive={false}
                          direction={data.points[0].direction}
                        />
                        <StopDetail
                          stop={data.points[data.points.length-1].to}
                          line={data.points[data.points.length-1].line}
                          textColor="black"
                          depart={additionSecondTime(data.departure, data.points[data.points.length-1].depart+data.points[data.points.length-1].travel_time)}
                          arrive={true}
                          direction={data.points[data.points.length-1].direction}
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
              onClick={() => setItinerairePage(false)}
              padding={7}
              fontSize={screenWidth < 700 ? "3xl" : "2xl"}
              whiteSpace="wrap"
              width={"45%"}
              alignSelf="center"
              borderRadius="15px"
              margin={0}
              marginTop={"5%"}
              marginBottom={screenWidth <450 ? "5%" : screenWidth < 700 ? "0%" : "5%"}
            >
              Annuler
            </Button>
            {
              screenWidth < 700 && !showMapMobile && (
                <>
                  {renderMoreDetails()}
                  <Button
                    bg="#84C7AE"
                    color="white"
                    _hover={{
                      bg: "#5eaf91",
                    }}
                    onClick={() => setShowMapMobile(true)}
                    padding={7}
                    fontSize={screenWidth < 700 ? "3xl" : "2xl"}
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
            {
              screenWidth < 700 && showMapMobile && (
                <>
                 <Flex h="55vh" width="92vw" direction="column">
                  <MapScreen />
                  <Button
                    bg="#84C7AE"
                    color="white"
                    _hover={{
                      bg: "#5eaf91",
                    }}
                    onClick={() => setShowMapMobile(false)}
                    padding={7}
                    fontSize={screenWidth < 700 ? "3xl" : "2xl"}
                    whiteSpace="wrap"
                    width={"90%"}
                    alignSelf="center"
                    borderRadius="15px"
                    margin={0}
                    marginTop={"5%"}
                  >
                    Come back
                  </Button>
                </Flex>
                </>
              )
            }
          </Stack>
        </Center>
      </Box>
      {
        screenWidth >= 700 && !moreDetails &&(
          <Box flexBasis="60%" flexShrink={1} h="100%" display="flex">
            <MapScreen />
          </Box>
        )
      }
      {
        screenWidth >= 700 && moreDetails && (
          <Flex padding={"5%"} paddingY={"2%"} direction={"column"} flexBasis="60%" flexShrink={1} h="100%" display="flex" bg="white">
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
              fontWeight="700" 
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
