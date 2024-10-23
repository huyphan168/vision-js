export interface PeopleCount {
    id: number;
    timestamp: string;
    count: number;
    confidence: number;
    image_path: string;
  }
  
  export interface StatsData {
    totalToday: number;
    averagePerHour: number;
    timeSeriesData: Array<{
      timestamp: string;
      count: number;
    }>;
  }
  
  export interface UploadResponse {
    count: number;
    confidence: number;
    timestamp: string;
    image_path: string;
  }

export interface StatsResponse {
  totalToday: number;
  averagePerHour: number;
  timeSeriesData: Array<{
    timestamp: string;
    count: number;
  }>;
}
