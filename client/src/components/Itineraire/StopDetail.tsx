import { Flex, Text } from "@chakra-ui/react";
import Icon from "../Shared/Icon";
const StopDetail = ({ stop, line, textColor, depart, direction, arrive }: { stop: string; line: string; textColor: string; depart: string, direction: string, arrive: boolean }) => {
    return (
        <Flex 
            flex={1} 
            maxW={"100%"} 
            direction={"row"} 
            borderRadius={"10px"}
            paddingY={0}
            bg={"white"}
            margin={0}
        >
            <Icon item={line} size={"40px"}/>
            <Flex
                direction={"row"}
                paddingX={2}
                paddingY={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                flex={1} 
            >
                <Flex 
                    marginLeft={"5%"} 
                    maxW={"100%"} 
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontWeight={"500"}
                    direction={"column"}
                >
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"ls"} 
                        fontWeight={"600"}
                    >
                        {stop}
                    </Text>
                    <Text 
                        margin={"0"} 
                        textColor={textColor} 
                        fontSize={"sm"}
                        fontWeight={"500"}
                        whiteSpace={"wrap"}
                    >
                        Vers {direction}
                    </Text>
                </Flex>
                <Text
                    margin={"0"} 
                    marginLeft={"5%"}
                    textColor={textColor} 
                    borderRadius={"50%"}
                    fontSize={"xs"} 
                    fontWeight={"500"}
                    whiteSpace={"nowrap"}
                >
                    {arrive ? "Arrivé à":"Départ à"} {depart}
                </Text>
            </Flex>
        </Flex>
    );

}

export default StopDetail;
