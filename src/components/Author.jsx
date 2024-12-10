import React from "react";
import { Button } from "@chakra-ui/react";

const Author = () => {
  return (
    <Button
      as='a'
      href='https://t.me/baronpw'
      target='_blank'
      variant='subtle'
      colorPalette='yellow'
      size='xl'
      rounded={"full"}
      marginLeft='16px'
    >
      Author
    </Button>
  );
};

export default Author;
