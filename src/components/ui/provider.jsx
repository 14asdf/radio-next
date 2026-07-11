'use client';

import { ColorModeProvider } from './color-mode';
import { Toaster } from './sonner';
import { TooltipProvider } from './tooltip';

export function Provider({ children, ...props }) {
  return (
    <ColorModeProvider {...props}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ColorModeProvider>
  );
}
