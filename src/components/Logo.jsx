'use client';
import { Box } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Logo = () => {
  const t = useTranslations('main');

  return (
    <Box display="inline-flex" cursor="pointer" as={Link} href="/">
      <svg
        width="140"
        height="32"
        viewBox="0 0 140 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12c4 0 8 0 12 2M14 16c3 0 5 0 8 2M16 20c2 0 2 0 4 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="38"
          y="20"
          fill="currentColor"
          style={{
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'uppercase',
          }}
        >
          Radio Baron
        </text>
      </svg>
    </Box>
  );
};

export default Logo;
