import {
    Center,
    Stack,
    Heading,
    Button,
    Flex,
    Text,
    Image
} from "@chakra-ui/react";
import Stop from "./Stop";
import StopDetail from "./StopDetail";
import { useEffect, useState } from "react";
import { Point, Trip } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage, RatingStatus } from "../Shared/enum";
import Rating from "./Rating.tsx";
import logo from "../../assets/logo.svg";
import { BASE_API_LINK } from "../Shared/links.ts";


const LeftTrip = () => {
    const { departure, destination, dataPath, activeRightPage, setActiveRightPage, startAt, endAt, dataTrip, setDataTrip } = useHomeContext();
    const [ratingStatus, setRatingStatus] = useState<RatingStatus>(RatingStatus.Closed);

    useEffect(() => {
        async function refreshData() {
            // fill dataTrip with the dataPath
            if (dataPath) {
                let startDate = new Date(dataPath[0]);
                let endDate = new Date(dataPath[0]);
                if (startAt === "") {
                    endDate = new Date(endAt);
                }
                else {
                    startDate = new Date(startAt);
                }
                const points = await translateTrip2Points(dataPath[1]);
                setDataTrip({ departure: startDate, arrival: endDate, points });
            }
        }
        refreshData();
    }, [dataPath, startAt, endAt, setDataTrip]);


    const translateTrip2Points = async (tripList: Trip[]): Promise<Point[]> => {
        const lst: Point[] = [];
        const hash: { [key: string]: string } = {};
        let lastTime = tripList[0].wait_time;
        let currentPoint = {
            from: tripList[0].from_stop_id,
            to: tripList[0].to_stop_id,
            line: tripList[0].route_short_name,
            direction: tripList[0].trip_id,
            nbr: 1,
            travel_time: tripList[0].travel_time,
            departure_time: tripList[0].wait_time,
        } as Point;

        for (const trip of tripList.slice(1)) {
            // check if the trip is on the same line and direction as the previous one
            if (trip.route_short_name === currentPoint.line) {
                currentPoint.to = trip.to_stop_id;
                currentPoint.travel_time += trip.travel_time + trip.wait_time;
                currentPoint.nbr += 1;
            } else {
                // add the current point to the list
                currentPoint.departure_time = lastTime;
                lst.push(currentPoint);
                // update the last time
                lastTime += currentPoint.travel_time + trip.wait_time;
                // create a new point
                currentPoint = {
                    from: trip.from_stop_id,
                    to: trip.to_stop_id,
                    line: trip.route_short_name,
                    direction: trip.trip_id,
                    nbr: 1,
                    travel_time: trip.travel_time,
                    departure_time: lastTime,
                } as Point;
            }
        }

        // add the last point
        currentPoint.departure_time = lastTime;
        lst.push(currentPoint);

        const fetchStopName = async (stopId: string) => {
            if (hash[stopId]) {
                return hash[stopId];
            }
            try {
                const response = await fetch(`${BASE_API_LINK}/stop/${stopId}`);
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
                const response = await fetch(`${BASE_API_LINK}/trip/${tripIp}`);
                const data = await response.json();
                hash[tripIp] = data[0].headsign;
                return hash[tripIp];
            } catch (error) {
                console.error(error);
                return tripIp; // Fallback to stopId in case of error
            }
        };

        for (let i = 0; i < lst.length; i++) {
            lst[i].from = await fetchStopName(lst[i].from);
            lst[i].to = await fetchStopName(lst[i].to);
            if (lst[i].direction !== null) {
                lst[i].direction = await fetchDirection(lst[i].direction as string);
            }
        }

        return lst;
    };

    function addTime(date: Date, time: number): Date {
        return new Date(date.getTime() + time * 1000);
    }

    function toggleMoreDetails() {
        // toggle moreDetails
        if (activeRightPage === ActiveRightPage.Trip) {
            setActiveRightPage(ActiveRightPage.TripDetails);
        }
        else {
            setActiveRightPage(ActiveRightPage.Trip);
        }
    }

    if (dataTrip === null) {
        return (
            null
        );
    }

    return (
        <Center style={{ justifyContent: "center", alignItems: "center" }}>
            <Stack spacing={0} w="100%">

                <Stack align="center" margin={0} padding={0}>
                    <Image
                        margin={0}
                        marginY={"5%"}
                        src={logo}
                        alt="logo"
                        width="100px"
                        height="100px"
                        padding={0}
                    />
                </Stack>
                <Stack spacing={5}>
                    <Stack marginX={"0%"} maxW={"100%"}>
                        <Stop name={departure?.name || 'error'} textColor={"black"} />
                        <Stop name={destination?.name || 'error'} textColor={"black"} />
                    </Stack>
                    <Heading
                        textDecoration="underline"
                        textAlign="start"
                        fontFamily="Karla"
                        fontWeight="700"
                        fontSize={"3xl"}
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
                            Arrivé à {
                                addTime(
                                    dataTrip.departure,
                                    dataTrip.points[dataTrip.points.length - 1].departure_time +
                                    dataTrip.points[dataTrip.points.length - 1].travel_time
                                ).toLocaleTimeString()
                            }{" "}
                        </Heading>
                        <Stack spacing={0}>
                            <StopDetail
                                stop={dataTrip.points[0].from}
                                line={dataTrip.points[0].line}
                                textColor="black"
                                depart={addTime(
                                    dataTrip.departure,
                                    dataTrip.points[0].departure_time
                                ).toLocaleTimeString()}
                                arrive={false}
                                direction={dataTrip.points[0].direction}
                            />
                            <StopDetail
                                stop={dataTrip.points[dataTrip.points.length - 1].to}
                                line={dataTrip.points[dataTrip.points.length - 1].line}
                                textColor="black"
                                depart={addTime(
                                    dataTrip.departure,
                                    dataTrip.points[dataTrip.points.length - 1].departure_time +
                                    dataTrip.points[dataTrip.points.length - 1].travel_time
                                ).toLocaleTimeString()}
                                arrive={true}
                                direction={
                                    dataTrip.points[dataTrip.points.length - 1].direction
                                }
                            />
                        </Stack>
                        <Text
                            onClick={toggleMoreDetails}
                            fontSize={"md"}
                            color={"#273DFF"}
                            textDecoration={"underline"}
                            alignSelf={"end"}
                            _hover={{ cursor: "pointer" }}
                        >
                            {activeRightPage === ActiveRightPage.TripDetails ? "Moins de détails" : "Plus de détails"}
                        </Text>
                    </Flex>
                </Stack>

                <Button
                    bg="#84C7AE"
                    color="white"
                    onClick={() => {
                        setActiveRightPage(ActiveRightPage.Map);
                    }}
                    padding={7}
                    fontSize={"2xl"}
                    whiteSpace="wrap"
                    width={"45%"}
                    alignSelf="center"
                    borderRadius="15px"
                    margin={0}
                    marginTop={"5%"}
                    marginBottom={
                        "2%"
                    }
                >
                    Retour
                </Button>

                <>
                    {ratingStatus === RatingStatus.Closed &&
                        <Text
                            onClick={() => setRatingStatus(RatingStatus.Opened)}
                            fontSize={"md"}
                            color={"#273DFF"}
                            textDecoration={"underline"}
                            alignSelf={"center"}
                            _hover={{ cursor: "pointer" }}
                        >
                            Notez votre trajet
                        </Text>
                    }
                    <Rating isOpen={ratingStatus === RatingStatus.Opened} setRatingStatus={setRatingStatus} />
                </>
            </Stack>
        </Center >
    )
}

export default LeftTrip;