'use client';

import React, { useState } from 'react';
import { FaVk } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa6';
import { IoShareOutline } from 'react-icons/io5';
import { RiTelegram2Fill, RiWhatsappFill } from 'react-icons/ri';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const Share = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success('URL copied');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleShare = async (platform) => {
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

    try {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (typeof window !== 'undefined' && navigator.share) {
    return (
      <Button
        aria-label="Share"
        onClick={() => handleShare()}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <IoShareOutline />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full"
        aria-label="Share this station"
        onClick={() => setIsOpen(true)}
      >
        <IoShareOutline />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Share this station</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('telegram')}
            >
              <RiTelegram2Fill />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('whatsapp')}
            >
              <RiWhatsappFill />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('vk')}
            >
              <FaVk />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleCopyUrl}>
              <FaLink />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Share;
