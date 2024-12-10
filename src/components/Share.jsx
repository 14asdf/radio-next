'use client';

import React from 'react';
import { MdOutlineShare } from 'react-icons/md';
import { toaster } from './ui/toaster';
import { FaTelegram, FaWhatsapp, FaVk } from 'react-icons/fa';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from './ui/menu';
import { Box, IconButton } from '@chakra-ui/react';
import { RiTelegram2Fill, RiWhatsappFill } from 'react-icons/ri';
import { FaLink } from 'react-icons/fa6';

const Share = () => {
  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toaster.create({
          title: 'URL Copied.',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleShare = (platform) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const urls = {
      telegram: `https://t.me/share/url?url=${currentUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${currentUrl}`,
      vk: `https://vk.com/share.php?url=${currentUrl}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton
          as="a"
          variant="subtle"
          colorPalette="yellow"
          size="xl"
          rounded={'full'}
          style={{ marginLeft: '1em' }}
          aria-label="Share this station"
        >
          <MdOutlineShare />
        </IconButton>
      </MenuTrigger>
      <MenuContent style={{ borderRadius: '3em' }}>
        <IconButton
          as="a"
          variant="ghost"
          colorPalette="yellow"
          size="xl"
          rounded={'full'}
          onClick={() => handleShare('telegram')}
        >
          <RiTelegram2Fill />
        </IconButton>
        <IconButton
          marginLeft="1em"
          as="a"
          variant="ghost"
          colorPalette="yellow"
          size="xl"
          rounded={'full'}
          onClick={() => handleShare('whatsapp')}
        >
          <RiWhatsappFill />
        </IconButton>
        <IconButton
          marginLeft="1em"
          as="a"
          variant="ghost"
          colorPalette="yellow"
          size="xl"
          rounded={'full'}
          onClick={() => handleShare('vk')}
        >
          <FaVk />
        </IconButton>
        <IconButton
          marginLeft="1em"
          as="a"
          variant="ghost"
          colorPalette="yellow"
          size="xl"
          rounded={'full'}
          onClick={handleCopyUrl}
        >
          <FaLink />
        </IconButton>
      </MenuContent>
    </MenuRoot>
  );
};

export default Share;
