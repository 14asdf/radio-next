'use client';

import { Box, Text, IconButton, Button } from '@chakra-ui/react';
import { Toaster } from './ui/toaster';

import { ColorModeButton } from './ui/color-mode';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  RiHomeLine,
  RiHomeFill,
  RiSearchFill,
  RiSearchLine,
  RiUserLine,
  RiUserFill,
  RiBarChartFill,
  RiBarChartLine,
} from 'react-icons/ri';
import Link from 'next/link';

import { decodeUrl, encodeUrl } from '../utils/stations';

import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import MiniPlayer from './MiniPlayer';
import Logo from './shared/Logo';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

const Main = ({ children }) => {
  const t = useTranslations('main.navigation');
  // Accept children prop
  const { playerState, togglePlay } = useAudioPlayer();
  const { isPlaying, currentStation } = playerState;

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const audioId = searchParams.get('id');

  return (
    <>
      <Toaster />
      <Box
        height={{ base: '100dvh', md: '100vh' }}
        display="flex"
        flexDirection="column"
        _dark={{ color: '#ffffff' }}
      >
        {/* Header */}
        <Box
          as="header"
          p={2}
          borderBottomWidth="0"
          pl={{ base: '4', md: '20' }}
          pr={{ base: '4', md: '20' }}
          bg="chakra-body-bg"
        >
          {pathname === '/' && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Logo />
            </Box>
          )}
        </Box>

        {/* Main Content Area */}
        <Box
          flex="1"
          display="flex"
          minHeight="0" // Important for nested flex scrolling
        >
          {/* Main Scrollable Content */}
          <Box
            flex="1"
            overflow="auto"
            pb={{ base: '4', xl: '4' }}
            pl={{ base: '4', md: '20' }}
            pr={{ base: '4', md: '20' }}
            pt={audioId ? 4 : 0}
            as="main"
          >
            {children}
          </Box>

          {/* Right Navigation Panel - Desktop Only */}
          <Box
            display={{ base: 'none', xl: 'flex' }}
            flexDirection="column"
            gap="6"
            pr="8"
            pt="8"
            width="240px"
            overflow="auto"
            bg="chakra-body-bg"
          >
            <Button
              as={Link}
              href="/"
              variant="ghost"
              size="lg"
              width="full"
              display="flex"
              gap="3"
              justifyContent="flex-start"
              borderRadius="full"
            >
              {pathname === '/' && !searchParams.get('id') ? (
                <RiHomeFill size={24} />
              ) : (
                <RiHomeLine size={24} />
              )}
              <Text>{t('home')}</Text>
            </Button>
            <Button
              as={Link}
              href="/search"
              variant="ghost"
              size="lg"
              width="full"
              display="flex"
              gap="3"
              justifyContent="flex-start"
              borderRadius="full"
            >
              {pathname === '/search' ? (
                <RiSearchFill size={24} />
              ) : (
                <RiSearchLine size={24} />
              )}
              <Text>{t('search')}</Text>
            </Button>
            <Button
              as={Link}
              href="/profile"
              variant="ghost"
              size="lg"
              width="full"
              display="flex"
              gap="3"
              justifyContent="flex-start"
              borderRadius="full"
            >
              {pathname === '/profile' ? (
                <RiUserFill size={24} />
              ) : (
                <RiUserLine size={24} />
              )}
              <Text>{t('favorites')}</Text>
            </Button>
            <Button
              as={Link}
              href="/trends"
              variant="ghost"
              size="lg"
              width="full"
              display="flex"
              gap="3"
              justifyContent="flex-start"
              borderRadius="full"
            >
              {pathname === '/trends' ? (
                <RiBarChartFill size={24} />
              ) : (
                <RiBarChartLine size={24} />
              )}
              <Text>{t('settings')}</Text>
            </Button>
            <ColorModeButton size="lg" width="full" borderRadius="full" />

            <LanguageSwitcher />
          </Box>
        </Box>

        {/* Footer Section */}
        <Box display="flex" flexDirection="column">
          {/* MiniPlayer */}
          <Box width="100%" display="flex" flexDirection="column">
            {currentStation && (
              <MiniPlayer audioId={encodeUrl(currentStation.streamUrl)} />
            )}
          </Box>

          {/* Mobile Navigation */}
          <Box
            display={{ base: 'flex', xl: 'none' }}
            bg="chakra-body-bg"
            borderTopWidth="1px"
            px="4"
            py="2"
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <IconButton
                as={Link}
                href="/"
                variant="ghost"
                borderRadius="full"
                aria-label={t('home')}
              >
                {pathname === '/' && !searchParams.get('id') ? (
                  <RiHomeFill size={24} />
                ) : (
                  <RiHomeLine size={24} />
                )}
              </IconButton>
              <IconButton
                as={Link}
                href="/search"
                variant="ghost"
                borderRadius="full"
                aria-label={t('search')}
              >
                {pathname === '/search' ? (
                  <RiSearchFill size={24} />
                ) : (
                  <RiSearchLine size={24} />
                )}
              </IconButton>
              <IconButton
                as={Link}
                href="/profile"
                variant="ghost"
                borderRadius="full"
                aria-label={t('favorites')}
              >
                {pathname === '/profile' ? (
                  <RiUserFill size={24} />
                ) : (
                  <RiUserLine size={24} />
                )}
              </IconButton>
              <IconButton
                as={Link}
                href="/trends"
                variant="ghost"
                borderRadius="full"
                aria-label={t('settings')}
              >
                {pathname === '/trends' ? (
                  <RiBarChartFill size={24} />
                ) : (
                  <RiBarChartLine size={24} />
                )}
              </IconButton>
              <ColorModeButton borderRadius="full" />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Main;
