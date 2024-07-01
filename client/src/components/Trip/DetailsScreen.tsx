import { Flex, Text, IconButton, useToast } from "@chakra-ui/react";
import MoreDetails from "./MoreDetails";
import { Point, SharedTripResponse } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage } from "../Shared/enum";
import { FaShareAlt } from "react-icons/fa";
import { useState } from "react";

enum AnimationState {
  Idle,
  Loading,
}

const DetailsScreen = () => {
  const { setActiveRightPage, dataTrip, dataPath, departure, destination, startAt, endAt } = useHomeContext();
  const [sharedLink, setSharedLink] = useState<string>("");
  const [animateShare, setAnimateShare] = useState(AnimationState.Idle);
  const toast = useToast();

  function addTime(date: Date, time: number): Date {
    return new Date(date.getTime() + time * 1000);
  }

  async function handleShared() {
    if (sharedLink === "") {
      setAnimateShare(AnimationState.Loading);
      const requestData = {
        departure: departure,
        destination: destination,
        content: dataPath,
      } as SharedTripResponse;

      // set the start and end date if they exist
      if (startAt !== "") {
        const date = new Date(startAt);
        requestData.start_date = `${date.toISOString().slice(0, 10)} ${date.toISOString().slice(11, 19)}.0`
      }
      if (endAt !== "") {
        const date = new Date(endAt);
        requestData.end_date = `${date.toISOString().slice(0, 10)} ${date.toISOString().slice(11, 19)}.0`
      }

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      };

      fetch("http://localhost:8000/share", requestOptions)
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(async (data) => {
          // make the data into a link
          const url = new URL(window.location.href);
          url.pathname = "/path/" + data.id;
          await navigator.clipboard.writeText(url.href);
          setSharedLink(url.href);
          toast({
            title: `Lien copié dans le presse-papier`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          toast({
            title: `Erreur lors de la création du lien`,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        })
        .finally(async () => {
          setAnimateShare(AnimationState.Idle);
        });
    } else {
      navigator.clipboard.writeText(sharedLink).then(() => {
        setAnimateShare(AnimationState.Idle);
        toast({
          title: `Lien copié dans le presse-papier`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      });
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
            isLoading={animateShare === AnimationState.Loading}
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
