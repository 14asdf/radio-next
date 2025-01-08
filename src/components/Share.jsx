'use client';

import React, { useState } from 'react';
import { MdOutlineShare } from 'react-icons/md';
import { toaster } from './ui/toaster';
import { FaTelegram, FaWhatsapp, FaVk } from 'react-icons/fa';
import { Box, IconButton, Separator } from '@chakra-ui/react';
import { RiTelegram2Fill, RiWhatsappFill } from 'react-icons/ri';
import { FaLink } from 'react-icons/fa6';
import { IoShareOutline, IoCloseOutline } from 'react-icons/io5';
import { Dialog } from '@/components/ui/dialog';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from './ui/dialog';

const Share = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toaster.create({
          title: 'URL copied',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleShare = async (platform) => {
    // Use platform-specific sharing if platform is specified
    if (platform) {
      const currentUrl = encodeURIComponent(window.location.href);
      const urls = {
        telegram: `https://t.me/share/url?url=${currentUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${currentUrl}`,
        vk: `https://vk.com/share.php?url=${currentUrl}`,
      };
      window.open(urls[platform], '_blank');
      return;
    }

    // Otherwise try native sharing
    if (!platform) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  // Use native share on mobile, custom share button on desktop
  if (typeof window !== 'undefined' && navigator.share) {
    return (
      <IconButton
        aria-label="Share"
        onClick={() => handleShare()}
        variant="ghost"
        size="lg"
        rounded={'full'}
      >
        <IoShareOutline />
      </IconButton>
    );
  }

  // Original share button implementation for desktop
  return (
    <>
      <IconButton
        as="a"
        variant="subtle"
        size="lg"
        rounded={'full'}
        aria-label="Share this station"
        onClick={() => setIsOpen(true)}
      >
        <IoShareOutline />
      </IconButton>

      <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle _dark={{ color: '#fff' }} fontSize="2xl">
              Share this station
            </DialogTitle>
            <DialogCloseTrigger>
              <IoCloseOutline />
            </DialogCloseTrigger>
          </DialogHeader>
          <Separator />
          <DialogBody>
            <Box display="flex" justifyContent="center" gap={4}>
              <IconButton
                variant="ghost"
                size="lg"
                rounded={'full'}
                onClick={() => handleShare('telegram')}
              >
                <RiTelegram2Fill />
              </IconButton>
              <IconButton
                variant="ghost"
                size="lg"
                rounded={'full'}
                onClick={() => handleShare('whatsapp')}
              >
                <RiWhatsappFill />
              </IconButton>
              <IconButton
                variant="ghost"
                size="lg"
                rounded={'full'}
                onClick={() => handleShare('vk')}
              >
                <FaVk />
              </IconButton>
              <IconButton
                variant="ghost"
                size="lg"
                rounded={'full'}
                onClick={handleCopyUrl}
              >
                <FaLink />
              </IconButton>
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default Share;
