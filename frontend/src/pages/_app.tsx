import React from 'react';
import type { AppProps } from 'next/app';
import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}

export default MyApp;