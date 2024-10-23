import Dashboard from '@/components/dashboard/dashboard';
import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
