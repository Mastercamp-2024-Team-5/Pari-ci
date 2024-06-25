import { ActiveSearchInput, Data, Hit } from "../Shared/types";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useHomeContext } from "../Home/HomeContext";
import Icon from "../Shared/Icon";
import { ActivePage } from "../Shared/enum";
import { useCallback, useEffect } from "react";

type Props = {
  results: Data | null;
  selected: ActiveSearchInput;
};

export function AutocompleteResults({
  results,
  selected,
}: Props) {
  const { setDeparture, setDestination, setActivePage } = useHomeContext();

  // Handle selection of a stop
  const handleSelect = useCallback((hit: Hit) => {
    if (selected === ActiveSearchInput.Departure) {
      setDeparture({ id: hit.stop_id, name: hit.stop_name });
    } else {
      setDestination({ id: hit.stop_id, name: hit.stop_name });
    }
    setActivePage(ActivePage.Map);
  }, [setDeparture, setDestination, setActivePage, selected]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (results && results.hits.length > 0) {
          handleSelect(results.hits[0]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [results, handleSelect]);

  return (
    <Box px={12} py={10} height="100vh" width="100%" overflowY="scroll">
      <Heading as="h2" size="lg" color="gray.800" fontWeight="bold">
        Résultats :
      </Heading>
      <Text fontSize="md" fontWeight="medium" color="gray.500">
        {selected == ActiveSearchInput.Departure ? "Départ" : "Arrivée"}
      </Text>
      <VStack spacing={2} py={8} align="stretch">
        {results?.hits.map((hit) => (
          <Button
            key={hit.id}
            width="full"
            border="1px"
            borderColor="gray.300"
            py={1.5}
            px={2}
            borderRadius="md"
            textAlign="left"
            justifyContent="flex-start"
            display="flex"
            alignItems="center"
            variant="outline"
            onMouseDown={() => handleSelect(hit)}
          >
            {hit.route_short_names.split(",").map((route, index) => (
              <Icon
                key={route.trim()}
                item={route.trim()}
                size="24px"
                style={{
                  marginRight:
                    index !== hit.route_short_names.split(",").length - 1
                      ? "-4px"
                      : "8px",
                }}
              />
            ))}
            {hit.stop_name}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}
