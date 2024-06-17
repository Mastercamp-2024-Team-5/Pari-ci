import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import useScreenWidth from "../Shared/useScreenWidth";
import HomeMobile from "./HomeMobile";
import HomeWeb from "./HomeWeb";
import Itineraire from "./../Itineraire/Itineraire";

const Home = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const screenWidth = useScreenWidth();

  const [ItininerairePage, setItininerairePage] = useState(false);
  return (
    <>
      {!ItininerairePage &&
        (screenWidth < 700 ? (
          <Flex flexDirection="column" w="100%" h="100%" overflow="hidden">
            <HomeMobile
              departure={departure}
              setDeparture={setDeparture}
              destination={destination}
              setDestination={setDestination}
              startAt={startAt}
              setStartAt={setStartAt}
              endAt={endAt}
              setEndAt={setEndAt}
              setItininerairePage={setItininerairePage}
            />
          </Flex>
        ) : (
          <Flex flexDirection="row" w="100%" h="100%" overflow="hidden">
            <HomeWeb
              departure={departure}
              setDeparture={setDeparture}
              destination={destination}
              setDestination={setDestination}
              startAt={startAt}
              setStartAt={setStartAt}
              endAt={endAt}
              setEndAt={setEndAt}
              setItininerairePage={setItininerairePage}
            />
          </Flex>
        ))}
      {ItininerairePage && (
        <Itineraire
          departure={departure}
          destination={destination}
          startAt={startAt}
          endAt={endAt}
          setItininerairePage={setItininerairePage}
        />
      )}
    </>
  );
};

export default Home;
