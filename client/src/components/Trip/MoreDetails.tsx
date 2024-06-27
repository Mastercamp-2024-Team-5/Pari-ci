import {
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import StopDetail from "./StopDetail";
import Icon from "../Shared/Icon";

const MoreDetails = (
  { ligne, arret1, arret2, depart, arrive, direction, nbrArrets, textColor }:
    {
      ligne: string;
      arret1: string;
      arret2: string;
      depart: Date;
      arrive: Date;
      direction: string;
      nbrArrets: number;
      textColor: string;
    }

) => {
  function getTimeDifference(depart: Date, arrive: Date) {
    return Math.floor((arrive.getTime() - depart.getTime()) / 60000);
  }

  return (
    <Box>
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
          depart={depart.toLocaleTimeString()}
          direction={direction}
          arrive={false}
        />
        <Flex w="100%" direction={"row"} alignItems="center" justifyContent="space-between" marginLeft={"7px"}>
          <Flex direction={"row"} alignItems="center" justifyContent={"start"}>
            <Icon item="barre" size="30px" color={ligne} />
            <Text marginLeft="3.3vw" fontSize="md" fontWeight="500" whiteSpace={"nowrap"}>
              {
                nbrArrets > 0 ? nbrArrets + " arrêts" : "Direct"
              }
            </Text>
          </Flex>
          <Text marginRight="6%" fontSize="md" fontWeight="500">
            {
              getTimeDifference(depart, arrive)
            } min
          </Text>
        </Flex>
        <StopDetail
          stop={arret2}
          line={ligne}
          textColor={textColor}
          depart={arrive.toLocaleTimeString()}
          direction={direction}
          arrive={true}
        />
      </Flex>
    </Box>
  );
};

export default MoreDetails;