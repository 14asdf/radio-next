'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SearchTabs({ value, onValueChange }) {
  const t = useTranslations('search');

  return (
    <Tabs value={value} onValueChange={onValueChange} className="mt-2 w-full">
      <TabsList className="h-auto w-full justify-between rounded-none bg-transparent p-0 shadow-none">
        <TabsTrigger
          value="all"
          className="flex flex-1 items-center justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          {t('tabs.all')}
        </TabsTrigger>
        <TabsTrigger
          value="name"
          className="flex flex-1 items-center justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          {t('tabs.name')}
        </TabsTrigger>
        <TabsTrigger
          value="genre"
          className="flex flex-1 items-center justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          {t('tabs.genre')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
