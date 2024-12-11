'use client';

import { Avatar as ChakraAvatar, Group } from '@chakra-ui/react';
import * as React from 'react';

export const Avatar = React.forwardRef(function Avatar(props, ref) {
  const { name, src, srcSet, loading, icon, fallback, children, ...rest } =
    props;
  return (
    <ChakraAvatar.Root ref={ref} {...rest} boxShadow="sm">
      <AvatarFallback name={name} icon={icon}>
        {fallback}
      </AvatarFallback>
      <ChakraAvatar.Image src={src} srcSet={srcSet} loading={loading} />
      {children}
    </ChakraAvatar.Root>
  );
});

const AvatarFallback = React.forwardRef(function AvatarFallback(props, ref) {
  const { name, icon, children, ...rest } = props;
  return (
    <ChakraAvatar.Fallback ref={ref} {...rest} fontSize="5xl" fontWeight="bold">
      {children}
      {name != null && children == null && <>{getInitials(name)}</>}
      {name == null && children == null && (
        <ChakraAvatar.Icon asChild={!!icon}>{icon}</ChakraAvatar.Icon>
      )}
    </ChakraAvatar.Fallback>
  );
});

function getInitials(name) {
  const names = name.trim().split(' ');
  const firstWord = names[0] != null ? names[0] : '';
  const secondWord = names.length > 1 ? names[1] : '';
  return firstWord && secondWord
    ? `${firstWord.charAt(0)}${secondWord.charAt(0)}`
    : firstWord.charAt(0);
}

export const AvatarGroup = React.forwardRef(function AvatarGroup(props, ref) {
  const { size, variant, borderless, ...rest } = props;
  return (
    <ChakraAvatar.PropsProvider value={{ size, variant, borderless }}>
      <Group gap="0" spaceX="-3" ref={ref} {...rest} />
    </ChakraAvatar.PropsProvider>
  );
});
