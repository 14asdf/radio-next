'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';
import { cn } from '@/lib/utils';

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    />
  );
}

function AvatarGroup({ className, children, max, ...props }) {
  const childArray = React.Children.toArray(children);
  const visible = max ? childArray.slice(0, max) : childArray;
  const overflow = max && childArray.length > max ? childArray.length - max : 0;

  return (
    <div className={cn('flex -space-x-3', className)} {...props}>
      {visible}
      {overflow > 0 && (
        <Avatar className="border-2 border-background">
          <AvatarFallback>+{overflow}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage };
