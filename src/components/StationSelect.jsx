import React, { useState, useRef, useEffect } from "react";
import { Box, Image, Text, Input, Badge, IconButton } from "@chakra-ui/react";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { generateUUID, encodeUrl, decodeUrl } from "../utils"; // Import necessary utilities
import s from "../stations.json";
import _ from "lodash";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { IoCloseOutline } from "react-icons/io5";
import { Avatar, AvatarGroup } from "./ui/avatar";

const stations = _.uniqBy(s, "title");

// Add this color mapping function outside the component
const getTagColor = (() => {
  const tagColorMap = new Map();
  const colors = ["red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"];
  let colorIndex = 0;

  return tag => {
    if (!tagColorMap.has(tag)) {
      tagColorMap.set(tag, colors[colorIndex % colors.length]);
      colorIndex++;
    }
    return tagColorMap.get(tag);
  };
})();

const StationSelect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);

  // Add effect to calculate available height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const searchInputHeight = 45; // Height of input + margin
        const availableHeight = window.innerHeight - containerRef.current.offsetTop - searchInputHeight;
        setContainerHeight(Math.max(300, availableHeight)); // Min height of 300px
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(updateHeight);
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const filteredStations = stations.filter(
    s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.tags && s.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const Row = ({ index, style }) => {
    const isMobile = window.innerWidth < 768;
    const itemsPerRow = isMobile ? 1 : 3;
    const startIdx = index * itemsPerRow;
    const rowStations = filteredStations.slice(startIdx, startIdx + itemsPerRow);

    const getBadges = React.useCallback(tags => {
      if (!tags) return [];
      return tags.split(",").map(tag => {
        const trimmedTag = tag.trim();
        return (
          <Badge key={trimmedTag} colorPalette={getTagColor(trimmedTag)}>
            {trimmedTag}
          </Badge>
        );
      });
    }, []);

    return (
      <Box display='flex' gap='6' style={style}>
        {rowStations.map(station => {
          const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

          const pickPalette = name => {
            const index = name.charCodeAt(0) % colorPalette.length;
            return colorPalette[index];
          };

          const badges = getBadges(station.tags);

          return (
            <Box
              as='a'
              key={station.streamUrl}
              href={`/?id=${encodeUrl(station.streamUrl)}`}
              display='flex'
              flexDirection='column'
              alignItems='center'
              gap='2'
              p='2'
              width={{ base: "100%", md: "calc(33.33% - 16px)" }}
              _hover={{
                cursor: "pointer",
              }}
            >
              <Avatar
                colorPalette={pickPalette(station.title)}
                src={station.img}
                name={station.title}
                shape='rounded'
                boxSize='120px'
                alt={station.title}
              />
              <Text overflow='hidden' textOverflow='ellipsis' textWrap='nowrap' maxW='100%'>
                {station.title}
              </Text>
              <Box display='flex' gap='2' overflow='hidden' whiteSpace='nowrap' maxW='100%'>
                {badges}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box mx='auto' ref={containerRef}>
      <InputGroup>
        <Input
          fontSize='xl'
          placeholder='Search...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          mb={2}
          colorPalette='yellow'
        />
        {searchTerm && (
          <InputRightElement>
            <IconButton variant='ghost' colorPalette='yellow' rounded={"full"} onClick={() => setSearchTerm("")} aria-label='Clear search'>
              <IoCloseOutline />
            </IconButton>
          </InputRightElement>
        )}
      </InputGroup>
      <Box overflow='hidden' height='calc(100dvh - 200px)'>
        {filteredStations.length === 0 ? (
          <Text fontSize={25} textAlign='center' mt={4}>
            No stations found for "{searchTerm}"
          </Text>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={Math.max(height - 10, 0)}
                width={width}
                itemCount={Math.ceil(filteredStations.length / (window.innerWidth < 768 ? 1 : 3))}
                itemSize={200}
              >
                {Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </Box>
    </Box>
  );
};

export default StationSelect;
