'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import {
  RiBarChartFill,
  RiBarChartLine,
  RiHomeFill,
  RiHomeLine,
  RiSearchFill,
  RiSearchLine,
  RiSettings4Fill,
  RiSettings4Line,
  RiUserFill,
  RiUserLine,
} from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { encodeUrl } from '../utils/stations';
import Logo from './Logo';
import MiniPlayer from './MiniPlayer';

const NavButton = ({ href, isActive, icon, activeIcon, label, mobile }) => {
  if (mobile) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full [&_svg]:size-[18px]" asChild>
        <Link href={href} aria-label={label}>
          {isActive ? activeIcon : icon}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="h-12 w-fit justify-start gap-3 rounded-full px-6 text-base [&_svg]:size-6"
      asChild
    >
      <Link href={href}>
        {isActive ? activeIcon : icon}
        <span className="font-bold">{label}</span>
      </Link>
    </Button>
  );
};

const Main = ({ children }) => {
  const t = useTranslations('main.navigation');
  const { playerState } = useAudioPlayer();
  const { currentStation } = playerState;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const audioId = searchParams.get('id');

  const navItems = [
    {
      href: '/',
      label: t('home'),
      isActive: pathname === '/' && !searchParams.get('id'),
      icon: <RiHomeLine size={24} />,
      activeIcon: <RiHomeFill size={24} />,
    },
    {
      href: '/search',
      label: t('search'),
      isActive: pathname === '/search',
      icon: <RiSearchLine size={24} />,
      activeIcon: <RiSearchFill size={24} />,
    },
    {
      href: '/profile',
      label: t('profile'),
      isActive: pathname === '/profile',
      icon: <RiUserLine size={24} />,
      activeIcon: <RiUserFill size={24} />,
    },
    {
      href: '/trends',
      label: t('trends'),
      isActive: pathname === '/trends',
      icon: <RiBarChartLine size={24} />,
      activeIcon: <RiBarChartFill size={24} />,
    },
    {
      href: '/settings',
      label: t('settings'),
      isActive: pathname === '/settings',
      icon: <RiSettings4Line size={24} />,
      activeIcon: <RiSettings4Fill size={24} />,
    },
  ];

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(99481187, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/99481187"
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
      <div className="flex h-dvh flex-col md:h-screen dark:text-white">
        <header className="border-b-0 bg-background p-2 pl-4 pr-4 md:pl-20 md:pr-20">
          {pathname === '/' && (
            <div className="flex items-center justify-between">
              <Logo />
            </div>
          )}
        </header>

        <div className="flex min-h-0 flex-1">
          <main
            className={cn(
              'flex-1 overflow-auto pb-4 pl-4 pr-4 md:pl-20 md:pr-20',
              audioId && 'pt-4'
            )}
          >
            {children}
          </main>

          <nav className="hidden w-60 flex-col items-start gap-6 overflow-auto bg-background pr-8 pt-8 xl:flex">
            {navItems.map((item) => (
              <NavButton key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <div className="flex flex-col">
          <div className="flex w-full flex-col">
            {currentStation && <MiniPlayer audioId={encodeUrl(currentStation.streamUrl)} />}
          </div>

          <nav className="flex border-t bg-background px-4 py-2 xl:hidden">
            <div className="flex w-full items-center justify-between">
              {navItems.map((item) => (
                <NavButton key={item.href} {...item} mobile />
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Main;
