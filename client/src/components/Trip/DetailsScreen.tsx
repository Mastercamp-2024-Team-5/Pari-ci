import { Flex, Text, IconButton, Button } from "@chakra-ui/react";
import MoreDetails from "./MoreDetails";
import { Point, SharedTripResponse, Stop } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage } from "../Shared/enum";
import { FaShareAlt } from "react-icons/fa";
import React from "react";
import Icon from "../Shared/Icon";

const DetailsScreen = () => {
  const {
    setActiveRightPage,
    dataTrip,
    dataPath,
    departure,
    destination,
    startAt,
    endAt,
  } = useHomeContext();
  const [sharedLink, setSharedLink] = React.useState<string>("");
  const [co2Car, setCo2Car] = React.useState<number>(0);
  const [co2PublicTransport, setCo2PublicTransport] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchStops = async () => {
      // fetch by id the departure and destination stops
      const departureResponse = await fetch(
        `http://127.0.0.1:8000/stop/${departure?.id}`
      );
      const departureStop: Stop = await departureResponse.json();

      const destinationResponse = await fetch(
        `http://127.0.0.1:8000/stop/${destination?.id}`
      );
      const destinationStop: Stop = await destinationResponse.json();

      const totalTravelTime = dataTrip?.points.reduce((sum, obj) => {
        if (obj.line && obj.direction) {
          return sum + obj.travel_time;
        }
        return sum;
      }, 0);

      console.log("Total Travel Time in seconds", totalTravelTime);
      const publicTransportCo2Emission = Math.round(
        (totalTravelTime || 0) * 0.68
      );
      console.log(
        "Public Transport totalCO2 in g of CO2",
        publicTransportCo2Emission
      );

      const distanceInKm = distance(
        departureStop[0].stop_lat,
        departureStop[0].stop_lon,
        destinationStop[0].stop_lat,
        destinationStop[0].stop_lon
      );

      const carCo2Emission = Math.round(distanceInKm * 192);
      console.log("Car co2Emission in g of CO2", carCo2Emission);

      setCo2Car(carCo2Emission);
      setCo2PublicTransport(publicTransportCo2Emission);
    };

    fetchStops();
  }, [departure, destination]);

  function distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  function addTime(date: Date, time: number): Date {
    return new Date(date.getTime() + time * 1000);
  }

  async function handleShared() {
    if (sharedLink === "") {
      const requestData = {
        departure: departure,
        destination: destination,
        content: dataPath,
      } as SharedTripResponse;

      // set the start and end date if they exist
      if (startAt !== "") {
        const date = new Date(startAt);
        requestData.start_date = `${date.toISOString().slice(0, 10)} ${date
          .toISOString()
          .slice(11, 19)}.0`;
      }
      if (endAt !== "") {
        const date = new Date(endAt);
        requestData.end_date = `${date.toISOString().slice(0, 10)} ${date
          .toISOString()
          .slice(11, 19)}.0`;
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      };
      const data = await fetch(
        "http://localhost:8000/share",
        requestOptions
      ).then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Network response was not ok");
        }
        return response.json();
      });

      // make the data into a link
      const url = new URL(window.location.href);
      url.pathname = "/path/" + data.id;
      navigator.clipboard.writeText(url.href);
      setSharedLink(url.href);
    } else {
      navigator.clipboard.writeText(sharedLink);
    }
  }

  const renderMoreDetails = () => {
    if (!dataTrip) return null;
    return (
      <>
        {dataTrip.points.map((obj: Point, index: number) => {
          if (obj.line && obj.direction) {
            return (
              <>
                {index === 0 && (
                  <Text
                    fontSize="xl"
                    fontWeight="550"
                    textAlign="start"
                    marginTop="4"
                    marginLeft={"4%"}
                  >
                    Prenez la ligne {obj.line} à {obj.from}
                  </Text>
                )}
                <MoreDetails
                  key={index}
                  ligne={obj.line}
                  arret1={obj.from}
                  arret2={obj.to}
                  depart={addTime(dataTrip.departure, obj.departure_time)}
                  arrive={addTime(
                    dataTrip.departure,
                    obj.departure_time + obj.travel_time
                  )}
                  direction={obj.direction}
                  nbrArrets={obj.nbr}
                  textColor={"black"}
                />
              </>
            );
          } else {
            return (
              <Text
                fontSize="xl"
                fontWeight="550"
                textAlign="start"
                marginTop="4"
                marginLeft={"4%"}
              >
                {/* {correspondance ? "Correspondance" : "Prenez la ligne"} {ligne} à {arret1}{correspondance ? ", " + marche + " min de marche" : ""} */}
                {index === 0 || index === dataTrip.points.length - 1
                  ? "Marchez vers " + obj.to
                  : "Correspondance " +
                    dataTrip.points
                      .map((v, i) => {
                        if (i >= index && v.line) {
                          return v.line;
                        } else {
                          return null;
                        }
                      })
                      .filter((x) => x !== null)[0] +
                    " à " +
                    obj.from}
                , {(obj.travel_time / 60).toFixed(0)} min de marche
              </Text>
            );
          }
        })}
      </>
    );
  };

  return (
    <Flex
      padding={"5%"}
      paddingY={"2%"}
      direction={"column"}
      flexBasis="100%"
      flexShrink={1}
      h="100%"
      display="flex"
      bg="white"
    >
      <Text
        onClick={() => setActiveRightPage(ActiveRightPage.Trip)}
        // fontSize={"md"}
        // color={"#273DFF"}
        // textDecoration={"underline"}
        // alignSelf={"start"}
        _hover={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          style={{ width: "2rem", height: "2rem" }}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </Text>
      <Text fontSize="4xl" fontWeight="700" textAlign="start">
        Votre trajet :
      </Text>
      <div
        style={{
          overflowY: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
          borderRadius: "10px",
          padding: "5px",
          marginTop: "10px",
        }}
      >
        {renderMoreDetails()}
        <Flex
          marginTop="5%"
          marginX="4%"
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="xl" fontWeight="550" textAlign="start">
            Arrivé à {dataTrip?.arrival.toLocaleTimeString()}
          </Text>
          <IconButton
            aria-label="Share"
            icon={<FaShareAlt />}
            colorScheme="teal"
            onClick={handleShared}
          />
        </Flex>
        <Text
          fontSize="l"
          fontWeight="550"
          textAlign="start"
          border={"2px"}
          borderRadius={"10px"}
          borderColor={"gray.300"}
          padding={"5px"}
          paddingX={"10px"}
          marginTop={"2%"}
        >
          <Flex
            direction="row"
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
          >
            <Icon item="voiture" size={20} color="teal" />
            {co2Car}g
            <span
              style={{
                color: "teal",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              VS
            </span>
            {co2PublicTransport}g
            <Icon item="parici" size={20} color="teal" />
          </Flex>
          Félicitations ! En choisissant les transports en commun, vous avez
          réduit votre empreinte carbone de{" "}
          <strong>{co2Car - co2PublicTransport}g </strong>
          de CO2.
        </Text>
      </div>
    </Flex>
  );
};
export default DetailsScreen;
