
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const InfoSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Professional PDF Compression
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Compression Features</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Pages become JPEG images inside a PDF</li>
              <li>• Text is no longer searchable or selectable</li>
              <li>• Links and editable forms are not retained</li>
              <li>• Original page dimensions are preserved</li>
              <li>• Original file kept if output is larger</li>
              <li>• Batch processing support</li>
              <li>• Real-time compression analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Compression Control</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• <strong>Low (0-20%):</strong> Minimal compression, preserves quality</li>
              <li>• <strong>Medium (20-50%):</strong> Balanced compression and quality</li>
              <li>• <strong>High (50-80%):</strong> Strong compression, good for web</li>
              <li>• <strong>Maximum (80-95%):</strong> Aggressive compression for storage</li>
              <li>• <strong>Custom:</strong> Full control over compression strength</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSection;
