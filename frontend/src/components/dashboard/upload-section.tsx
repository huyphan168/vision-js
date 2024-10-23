'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Toast } from "@/components/ui/toast"
import Image from 'next/image';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface UploadResponse {
    count: number;
    // Add other properties if needed
}

interface UploadSectionProps {
    count: number;
    onUploadSuccess: (data: UploadResponse) => void;
    streamUrl: string;
    onStreamUrlChange: (url: string) => void;
}

const UploadSection = ({ onUploadSuccess, streamUrl, onStreamUrlChange }: UploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://0.0.0.0:1000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      onUploadSuccess(data);
      toast({
        title: "Success",
        description: `Detected ${data.count} people in the image`,
      });

      // Clear the selection
      setSelectedFile(null);
      setPreview(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStreamUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStreamUrlChange(event.target.value);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upload Image or Set Stream URL</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
              id="image-upload"
            />
            {selectedFile && (
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
              >
                {isUploading ? 'Processing...' : 'Process Image'}
              </Button>
            )}
          </div>
          
          {/* Preview Section */}
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Selected Image Preview:</p>
              <div className="relative w-full max-w-md">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="rounded-lg border border-gray-200"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
          
          {/* Stream URL input */}
          <div className="mt-4">
            <label htmlFor="stream-url" className="block text-sm font-medium text-gray-700 mb-2">
              Video Stream URL
            </label>
            <Textarea
              id="stream-url"
              placeholder="Enter the IP address or URL of the video stream"
              value={streamUrl}
              onChange={handleStreamUrlChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
