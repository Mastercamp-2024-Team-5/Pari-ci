import metro_stops from "./coordinates_metro";
import RER_stops from "./coordinates_RER";
import trains from "./coordinates_train";

const coordinates: { [key: string]: string[][][] } = {
    "metro": metro_stops,
    "rer": RER_stops,
    "train": trains,
};

export default coordinates;