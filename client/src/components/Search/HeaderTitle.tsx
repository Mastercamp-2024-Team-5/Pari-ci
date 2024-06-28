import React from 'react';
import { Heading, Text } from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth.tsx";


export function HeaderTitle(): React.ReactElement {
    const screenWidth = useScreenWidth();

    return (
        <div>
            <Heading
                fontFamily="Karla"
                fontWeight="650"
                marginTop={screenWidth < 700 ? "10%" : "15%"}
                fontSize={screenWidth < 700 ? "5xl" : "4xl"}
            >
                Pari'ci
            </Heading>
            <Text fontSize={screenWidth < 700 ? "xl" : "lg"} marginBottom="5%">
                Trouvez votre itinéraire
            </Text>
        </div>
    );
}