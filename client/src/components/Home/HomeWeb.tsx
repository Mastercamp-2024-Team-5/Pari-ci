import { Box} from "@chakra-ui/react";
import MapScreen from "../MapScreen";
import LeftSearch from "./../LeftSearch";

const HomeWeb = ({
    departure,
    setDeparture,
    destination,
    setDestination,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    setItininerairePage
  }: {
    departure: string,
    setDeparture: React.Dispatch<React.SetStateAction<string>>,
    destination: string,
    setDestination: React.Dispatch<React.SetStateAction<string>>,
    startAt: string,
    setStartAt: React.Dispatch<React.SetStateAction<string>>,
    endAt: string,
    setEndAt: React.Dispatch<React.SetStateAction<string>>,
    setItininerairePage: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    return (
        <>
          <Box
            bg="F6FBF9"
            w="33%"
            h="100%"
            p={4}
            >
            <LeftSearch
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
            </Box>
            <Box
              w="67%"
              h="100%"
              display="flex"
            >
            <MapScreen />
            </Box>
        </>
    );
}

export default HomeWeb;