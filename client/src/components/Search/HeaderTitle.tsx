import React from 'react';
import { Heading, Text, Image } from "@chakra-ui/react";
import useScreenWidth from "../Shared/useScreenWidth.tsx";
import logo from "../../assets/logo.svg";

export function HeaderTitle(): React.ReactElement {
    const screenWidth = useScreenWidth();

    return (
        <div>
            <Image
                margin={0}
                marginTop={screenWidth < 700 ? "10%" : "15%"}
                src={logo}
                alt="logo"
                width="100px"
                height="100px"
                padding={0}
            />
            <Text fontSize={screenWidth < 700 ? "xl" : "lg"} marginBottom="5%">
                Trouvez votre itinéraire
            </Text>
        </div>
    );
}