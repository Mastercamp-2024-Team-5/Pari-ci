import AccessibleScreen from "./WheelchairConvenientPage";
import Home from "./../Home/Home";
import { useHomeContext } from './../Home/HomeContext';
const HomeOrAccessible = () => {
    const { accessibleScreen} = useHomeContext();
    return (
        <>
            {
                !accessibleScreen ? (
                    <Home />
                ) : (
                    <AccessibleScreen/>
                )
            }
        </>
    )};

export default HomeOrAccessible;