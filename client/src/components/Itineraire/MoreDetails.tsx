import {
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import StopDetail from "./StopDetail";
import Icon from "../Shared/Icon";

const MoreDetails = (
    { ligne, arret1, arret2, depart, arrive, direction, nbrArrets, textColor, correspondance}:
    { 
        ligne: string;
        arret1: string;
        arret2: string;
        depart: string;
        arrive: string;
        direction: string;
        nbrArrets: number;
        textColor: string;
        correspondance: boolean;
    }

) => {
  function getTimeDifference(depart: string, arrive: string) {
    // Helper function to convert HH:mm:ss to total seconds
    function timeStringToSeconds(time: string) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
  
    const departSeconds = timeStringToSeconds(depart);
    const arriveSeconds = timeStringToSeconds(arrive);
    const diffSeconds = Math.abs(arriveSeconds - departSeconds);
    const minutes = Math.floor(diffSeconds / 60);
  
    return minutes;
  }
  return (
    <Box>
      <Text fontSize="xl" fontWeight="550" textAlign="start" marginTop="4" marginLeft={"4%"}>
        {correspondance?"Correspondance":"Prenez la ligne"} {ligne} à {arret1}
      </Text>
      <Flex 
        flex={1} 
        direction={"column"} 
        w="100%" 
        h="100%" 
        bg={"white"} 
        padding={"1%"} 
        marginTop={5} 
        border={"2px solid"}
        borderColor={"black"}
        borderRadius={"10px"}
        >
        <StopDetail 
          stop={arret1} 
          line={ligne} 
          textColor={textColor} 
          depart={depart} 
          direction={direction}
          arrive={false}
        />
        <Flex w="100%" direction={"row"} alignItems="center" justifyContent="space-between" marginLeft={"7px"}>
          <Flex direction={"row"} alignItems="center" justifyContent={"start"}>
            <Icon item="barre" size="30px" color={ligne} />
            <Text marginLeft="6%" fontSize="md" fontWeight="500" whiteSpace={"nowrap"}>
              {nbrArrets} arrêt{nbrArrets>1?"s":""}
            </Text>
          </Flex>
          <Text marginRight="6%" fontSize="md" fontWeight="500">
              {getTimeDifference(depart, arrive)} min
          </Text>
        </Flex>
        <StopDetail 
          stop={arret2}
          line={ligne}
          textColor={textColor}
          depart={arrive}
          direction={direction}
          arrive={true}
        />
    </Flex>
    </Box>
  );
};

export default MoreDetails;