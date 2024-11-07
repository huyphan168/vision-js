'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UploadSection from '@/components/dashboard/upload-section';
import { Toaster } from "@/components/ui/toaster";

const Dashboard = () => {

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Venue Dashboard</h1>
      
    </div>
  );
};

export default Dashboard;
