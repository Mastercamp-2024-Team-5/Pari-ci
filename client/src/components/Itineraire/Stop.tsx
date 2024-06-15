import { Flex, Text } from "@chakra-ui/react";
import CircleLine from "./CircleLine";

const Stop = ({ stop, line, color, textColor }: { stop: string; line: string; textColor: string; color: string }) => {
    return (
        <Flex
            flex={1}
            maxW={"100%"}
            direction={"row"}
            marginX={"5%"}
            border={"2px solid"}
            borderColor={"#273DFF"}
            borderRadius={"10px"}
            paddingX={6}
            paddingY={3}
            bg={"white"}
            alignItems={"center"} // Ensure Flex container items are centered
        >
            <CircleLine line={line} color={color} textColor={textColor} />
            <Text
                marginLeft={"5%"}
                width={"85%"}
                alignContent={"center"}
                justifyContent={"center"}
                textColor={textColor}
                fontSize={"lg"} // Increased font size
                fontWeight={"500"} // Added font weight
            >
                {stop}
            </Text>
        </Flex>
    );
}

export default Stop;
