'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';

interface SWRProviderProps {
  children: ReactNode;
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}
