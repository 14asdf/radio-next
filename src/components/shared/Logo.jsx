'use client';
import { Box } from '@chakra-ui/react';
import { Link } from 'next/router';

const Logo = () => {
  return (
    <Box display="inline-flex" as={Link} href="/" cursor="pointer">
      <svg
        width="130"
        height="32"
        viewBox="0 0 130 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 22C27.3137 22 30 19.3137 30 16C30 12.6863 27.3137 10 24 10C23.3425 10 22.7078 10.1094 22.1159 10.3127C21.0359 7.84819 18.6843 6 16 6C13.3157 6 10.9641 7.84819 9.88406 10.3127C9.29225 10.1094 8.65754 10 8 10C4.68629 10 2 12.6863 2 16C2 19.3137 4.68629 22 8 22H24Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 14V18M13 16H19M11 13C11 13 12.5 15 16 15C19.5 15 21 13 21 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="38"
          y="20"
          fill="currentColor"
          fontFamily="system-ui"
          fontSize="16"
          fontWeight="600"
        >
          Radio cloud
        </text>
      </svg>
    </Box>
  );
};

export default Logo;
