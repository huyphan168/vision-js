'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UploadSection from '@/components/dashboard/upload-section';
import { Toaster } from "@/components/ui/toaster";

interface StatsData {
  timestamp: string;
  count: number;
}

interface StatsResponse {
  totalToday: number;
  averagePerHour: number;
  timeSeriesData: Array<{
    timestamp: string;
    count: number;
  }>;
}

const Dashboard = () => {
  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [averagePeople, setAveragePeople] = useState(0);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/stats');
      const data: StatsResponse = await response.json();
      setStatsData(data.timeSeriesData);
      setTotalPeople(data.totalToday);
      setAveragePeople(Math.round(data.averagePerHour));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleUploadSuccess = async () => {
    // Refresh stats after successful upload
    await fetchStats();
  };

  const handleStreamUrlChange = (url: string) => {
    setStreamUrl(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Venue Dashboard</h1>
      
      <UploadSection 
        onUploadSuccess={handleUploadSuccess} 
        count={totalPeople} 
        streamUrl={streamUrl}
        onStreamUrlChange={handleStreamUrlChange}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total People Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPeople}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Per Hour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePeople}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>People Count Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Toaster />
    </div>
  );
};

export default Dashboard;
