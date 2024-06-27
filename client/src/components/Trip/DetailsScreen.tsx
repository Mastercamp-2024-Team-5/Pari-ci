import { Flex, Text, IconButton } from "@chakra-ui/react";
import MoreDetails from "./MoreDetails";
import { Point } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage } from "../Shared/enum";
import { FaShareAlt } from "react-icons/fa";
import React from "react";

const DetailsScreen = () => {
  const { setActiveRightPage, dataTrip, dataPath } = useHomeContext();
  const [shared, setShared] = React.useState(false);

  function addTime(date: Date, time: number): Date {
    return new Date(date.getTime() + time * 1000);
  }

  async function handleShared() {
    if (!shared) {
      setShared(true);

      console.log(dataPath);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPath),
      };
      fetch("http://localhost:8000/share", requestOptions)
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => console.log(data));
    }
  }

  const renderMoreDetails = () => {
    if (!dataTrip) return null;
    return (
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
        <Flex
          marginTop="5%"
          marginX="4%"
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize="xl" fontWeight="550" textAlign="start">
            Arrivé à {dataTrip.arrival.toLocaleTimeString()}
          </Text>
          <IconButton
            aria-label="Share"
            icon={<FaShareAlt />}
            colorScheme="teal"
            onClick={handleShared}
          />
        </Flex>
      </div>
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
      {renderMoreDetails()}
    </Flex>
  );
};

export default DetailsScreen;
