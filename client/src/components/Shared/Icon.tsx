import React from "react";
import { Box, Text } from "@chakra-ui/react";
import "./../../assets/font/fontello/css/fontello.css";
import data from "./../../assets/font/fontello/config.json";

interface IconProps {
  item: string; // Icon name (can be found in the config.json file in the glyphs[].css field)
  size?: string | number; // Icon size (optional)
  style?: React.CSSProperties; // Icon style (optional)
  color?: string; // Icon color (if specifies a metro or RER number, color is set to the metro or RER color) (optional)
  onMouseEnter?: () => void; // Function to call when the mouse enters the icon (optional)
  onMouseLeave?: () => void; // Function to call when the mouse leaves the icon (optional)
}

const Icon: React.FC<IconProps> = ({ item, size = "30px", style, color="", onMouseEnter, onMouseLeave }) => {
  item = item.toLowerCase();
  //Check if icon is in the css component of config.json data in the glyphs[].css
  if (!data.glyphs.some(glyph => glyph.css === item)) {
    return <Text style={{ color: "red"}}>Icon {item} not found</Text>;
  }

  const colors_metro: { [key: string]: string[] } = {
    "1": ["rgb(255,206,0)", "rgb(37,48,59)"],
    "2": ["rgb(0,100,176)", "white"],
    "3": ["rgb(159,152,37)", "white"],
    "3bis": ["rgb(152,212,226)", "rgb(37,48,59)"],
    "4": ["rgb(192,65,145)", "white"],
    "5": ["rgb(242,142,66)", "rgb(37,48,59)"],
    "6": ["rgb(131,196,145)", "rgb(37,48,59)"],
    "7": ["rgb(243,164,186)", "rgb(37,48,59)"],
    "7bis": ["rgb(131,196,145)", "rgb(37,48,59)"],
    "8": ["rgb(206,173,210)", "rgb(37,48,59)"],
    "9": ["rgb(213,201,0)", "rgb(37,48,59)"],
    "10": ["rgb(227,179,42)", "rgb(37,48,59)"],
    "11": ["rgb(141,94,42)", "white"],
    "12": ["rgb(0,129,79)", "white"],
    "13": ["rgb(152,212,226)", "rgb(37,48,59)"],
    "14": ["rgb(102,36,131)", "white"],
    "15": ["rgb(185,8,69)", "white"],
    "16": ["rgb(243,164,186)", "rgb(37,48,59)"],
    "17": ["rgb(213,201,0)", "rgb(37,48,59)"],
    "18": ["rgb(0,168,143)", "white"],
    "19": ["rgb(198,198,198)", "rgb(37,48,59)"],
  };

  if (item in colors_metro) {
    return (
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style}>
        <i className="icon-rond" style={{ fontSize: size, color: colors_metro[item][0] }}></i>
        <Box position="absolute">
          <i className={`icon-${item}`} style={{ color: colors_metro[item][1], fontSize: size }}></i>
        </Box>
      </Box>
    );
  }

  const colors_rer: { [key: string]: string[] } = {
    "a": ["rgb(227,5,28)", "white"],
    "b": ["rgb(82,145,206)", "white"],
    "c": ["rgb(255,206,0)", "rgb(37,48,59)"],
    "d": ["rgb(0,129,79)", "white"],
    "e": ["rgb(192,65,145)", "white"],
    "h": ["rgb(141,94,42)", "white"],
    "j": ["rgb(213,201,0)", "rgb(37,48,59)"],
    "k": ["rgb(159,152,37)", "white"],
    "l": ["rgb(206,173,210)", "rgb(37,48,59)"],
    "n": ["rgb(0,168,143)", "white"],
    "r": ["rgb(243,164,186)", "rgb(37,48,59)"],
    "p": ["rgb(242,142,66)", "rgb(37,48,59)"],
    "u": ["rgb(185,8,69)", "white"],
    "v": ["rgb(159,152,37)", "white"],
  };

  if (item in colors_rer === true) {
    return (
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style}>
        <i className="icon-carre" style={{ fontSize: size, color: colors_rer[item][0] }}></i>
        <Box position="absolute">
          <i className={`icon-${item}`} style={{ color: colors_rer[item][1], fontSize: size }}></i>
        </Box>
      </Box>
    );
  }

  const colors_tram: { [key: string]: string } = {
    "t1": "#0064B0",
    "t2": "#C04191",
    "t3a": "#F28E42",
    "t3b": "#00814F",
    "t4": "#E3B32A",
    "t5": "#662483",
    "t6": "#E3051C",
    "t7": "#8D5E2A",
    "t8": "#9F9825",
    "t9": "#5291CE",
    "t10": "#9F9825",
    "t11": "#F28E42",
    "t12": "#B90845",
    "t13": "#8D5E2A",
    "t14": "#00A88F",
  };

  if (item in colors_tram === true) {
    return (
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style}>
        <i className="icon-traits" style={{ fontSize: size, color: colors_tram[item] }}></i>
        <Box position="absolute">
          <i className={`icon-${item}`} style={{ color: "#25303B", fontSize: size }}></i>
        </Box>
      </Box>
    );
  }

  let color_chosen = color;
  if (color in colors_rer === true) {
    color_chosen = colors_rer[color][0];
  }
  if (color in colors_metro === true) {
    color_chosen = colors_metro[color][0];
  }

  return (
    <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <i className={`icon-${item}`} style={{ fontSize: size, color: color_chosen }}></i>
    </Box>
  );
};

export default Icon;
