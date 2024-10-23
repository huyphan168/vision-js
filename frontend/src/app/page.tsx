import Dashboard from '@/components/dashboard/dashboard';
import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import OccupancyPieChart from '../components/OccupancyPieChart';
import useOccupancyData from '../hooks/useOccupancyData';

export default function Home() {
  const { occupancyData, isLoading, error, refetch } = useOccupancyData();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <h1 className="text-4xl font-bold mb-8">Mall Occupancy Monitor</h1>
          <Dashboard />
          <div className="mt-8">
            {isLoading ? (
              <p aria-live="polite">Loading occupancy data...</p>
            ) : error ? (
              <div>
                <p className="text-red-500" aria-live="assertive">Error: {error}</p>
                <button 
                  onClick={refetch}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <OccupancyPieChart
                currentOccupancy={occupancyData.currentOccupancy}
                maxCapacity={occupancyData.maxCapacity}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Create a new file: frontend/src/hooks/useOccupancyData.ts
import { useState, useEffect, useCallback } from 'react';

interface OccupancyData {
  currentOccupancy: number;
  maxCapacity: number;
}

const useOccupancyData = () => {
  const [occupancyData, setOccupancyData] = useState<OccupancyData>({ currentOccupancy: 0, maxCapacity: 1000 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOccupancyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/occupancy');
      if (!response.ok) {
        throw new Error('Failed to fetch occupancy data');
      }
      const data = await response.json();
      setOccupancyData({
        currentOccupancy: data.current_occupancy,
        maxCapacity: data.max_capacity
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching occupancy data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOccupancyData();
    const interval = setInterval(fetchOccupancyData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [fetchOccupancyData]);

  return { occupancyData, isLoading, error, refetch: fetchOccupancyData };
};

export default useOccupancyData;

