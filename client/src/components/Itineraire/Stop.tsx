import { Flex, Text } from "@chakra-ui/react";

const Stop = ({ stop, textColor }: { stop: string; textColor: string }) => {
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
            paddingY={0}
            bg={"white"}
            alignItems={"center"} // Ensure Flex container items are centered
            minHeight={"63px"}
        >
            <Text
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
