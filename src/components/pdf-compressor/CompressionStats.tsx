
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CompressionSummary } from '@/types/pdfCompressor';

interface CompressionStatsProps {
  savings: CompressionSummary;
  formatFileSize: (bytes: number) => string;
}

const CompressionStats = ({ savings, formatFileSize }: CompressionStatsProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-700">
              {formatFileSize(savings.totalSaved)}
            </div>
            <div className="text-sm text-green-600">Space Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {savings.avgCompression.toFixed(1)}%
            </div>
            <div className="text-sm text-green-600">Avg Compression</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {formatFileSize(savings.totalOriginal)}
            </div>
            <div className="text-sm text-green-600">Original Size</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">
              {formatFileSize(savings.totalCompressed)}
            </div>
            <div className="text-sm text-green-600">Compressed Size</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompressionStats;
