import React from 'react';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { IoCloseOutline } from 'react-icons/io5';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from './ui/dialog';

const PlayerDialog = ({ isOpen, onOpenChange, station, isLoading, imgSrc }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle _dark={{ color: '#fff' }}>{station.title}</DialogTitle>
          <DialogCloseTrigger>
            <IoCloseOutline />
          </DialogCloseTrigger>
        </DialogHeader>
        <DialogBody>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="250px"
            >
              <Spinner size="md" color="gray.500" />
            </Box>
          ) : (
            <Image
              src={imgSrc}
              alt={station.title}
              width="100%"
              height="auto"
              borderRadius="lg"
              cursor="pointer"
              onClick={() => onOpenChange({ open: true })}
            />
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default PlayerDialog;
