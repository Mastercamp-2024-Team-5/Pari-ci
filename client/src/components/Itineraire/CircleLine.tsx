import { Box, Text } from "@chakra-ui/react";
export const CircleLine = ({color, line, textColor}:
    {color: string, line: string, textColor: string}
) => {
    return (
        <Box
            display={"flex"} // Use flex display to center the content
            alignItems={"center"} // Center the content vertically
            justifyContent={"center"} // Center the content horizontally
            bgColor={color}
            borderRadius={"50%"}
            height={"40px"}
            width={"40px"}
            overflow={"hidden"} // Use hidden to prevent overflow
            flexShrink={0} // Prevent shrinking
            alignSelf={"center"}
        >
            <Text
                fontFamily={"Karla"}
                fontSize={"xl"} // Adjust font size if needed
                fontWeight={"bold"} // Font weight
                textColor={textColor}
                textAlign={"center"}
                whiteSpace={"nowrap"} // Prevent text from wrapping
                lineHeight={"40px"} // Adjust line height to fit within the circle
            >
                {line}
            </Text>
        </Box>
    );
}
export default CircleLine;