import {
    Flex,
    Text,
} from "@chakra-ui/react";
import MoreDetails from "./MoreDetails";
import { Point } from "../Shared/types";
import { useHomeContext } from "../Home/HomeContext";
import { ActiveRightPage } from "../Shared/enum";

const DetailsScreen = () => {
    const { setActiveRightPage, dataTrip } = useHomeContext();

    function addTime(date: Date, time: number): Date {
        return new Date(date.getTime() + time * 1000);
    }

    const renderMoreDetails = () => {
        if (!dataTrip) return null;
        return (
            <div
                style={{
                    overflowY: "auto",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    padding: "5px",
                    marginTop: "10px",
                }}
            >
                {
                    dataTrip.points.map((obj: Point, index: number) => (
                        <MoreDetails
                            key={index}
                            ligne={obj.line}
                            arret1={obj.from}
                            arret2={obj.to}
                            depart={addTime(dataTrip.departure, obj.depart)}
                            arrive={addTime(
                                dataTrip.departure,
                                obj.depart + obj.travel_time
                            )}
                            direction={obj.direction}
                            nbrArrets={obj.nbr}
                            textColor={"black"}
                            correspondance={index > 0}
                            marche={obj.marche}
                        />
                    ))}
                <Text
                    fontSize="xl"
                    fontWeight="550"
                    textAlign="start"
                    marginTop="5%"
                    marginLeft={"4%"}
                >
                    Arrivé à {dataTrip.arrival.toLocaleTimeString()}
                </Text>
            </div>
        )
    }

    return (
        <Flex
            padding={"5%"}
            paddingY={"2%"}
            direction={"column"}
            flexBasis="100%"
            flexShrink={1}
            h="100%"
            display="flex"
            bg="white"
        >
            <Text
                onClick={() => setActiveRightPage(ActiveRightPage.Trip)}
                fontSize={"md"}
                color={"#273DFF"}
                textDecoration={"underline"}
                alignSelf={"start"}
                _hover={{ cursor: "pointer" }}
            >
                Retour
            </Text>
            <Text
                fontSize="4xl"
                fontWeight="700"
                textAlign="start"
                marginTop={"2%"}
            >
                Votre trajet :
            </Text>
            {renderMoreDetails()}
        </Flex>
    );
};

export default DetailsScreen;
