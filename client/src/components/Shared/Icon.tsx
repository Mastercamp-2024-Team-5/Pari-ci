import React from "react";
import { Box, Text } from "@chakra-ui/react";
import "./../../assets/font/fontello/css/fontello.css";
import data from "./../../assets/font/fontello/config.json";
import {colors_metro} from "./colors_metro";

interface IconProps {
  item: string; // Icon name (can be found in the config.json file in the glyphs[].css field)
  size?: string; // Icon size (optional)
  style?: React.CSSProperties; // Icon style (optional)
  color?: string; // Icon color (if specifies a metro or RER number, color is set to the metro or RER color) (optional)
  onMouseEnter?: () => void; // Function to call when the mouse enters the icon (optional)
  onMouseLeave?: () => void; // Function to call when the mouse leaves the icon (optional)
}

const Icon: React.FC<IconProps> = ({ item, size = "30px", style, color="", onMouseEnter, onMouseLeave }) => {
  //Check if icon is in the css component of config.json data in the glyphs[].css
  if (!data.glyphs.some(glyph => glyph.css === item)) {
    return <Text style={{ color: "red"}}>Icon {item} not found</Text>;
  }

  if (item in colors_metro === true) {
    return (
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style}>
        <i className="icon-rond" style={{ fontSize: size, color: colors_metro[item][0] }}></i>
        <Box position="absolute">
          <i className={`icon-${item}`} style={{ color: colors_metro[item][1], fontSize: size }}></i>
        </Box>
      </Box>
    );
  }

  const colors_others: { [key: string]: string[] } = {
    "a": ["rgb(227,5,28)", "white"],
    "b": ["rgb(82,145,206)", "white"],
    "c": ["rgb(255,206,0)", "rgb(37,48,59)"],
    "d": ["rgb(0,129,79)", "white"],
    "e": ["rgb(192,65,145)", "white"],
    "h": ["rgb(141,94,42)", "white"],
    "j": ["rgb(213,201,0)", "rgb(37,48,59)"],
    "k": ["rgb(159,152,37)", "white"],
    "l": ["rgb(206,173,210)", "rgb(37,48,59)"],
  };

  if (item in colors_others === true) {
    return (
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" style={style}>
        <i className="icon-carre" style={{ fontSize: size, color: colors_others[item][0] }}></i>
        <Box position="absolute">
          <i className={`icon-${item}`} style={{ color: colors_others[item][1], fontSize: size }}></i>
        </Box>
      </Box>
    );
  }

  let color_chosen = color;
  if (color in colors_others === true) {
    color_chosen = colors_others[color][0];
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
