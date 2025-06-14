
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface CompressionSettingsProps {
  customCompressionStrength: number;
  setCustomCompressionStrength: (value: number) => void;
}

const CompressionSettings = ({ 
  customCompressionStrength, 
  setCustomCompressionStrength 
}: CompressionSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Compression Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="compression-strength">
            Compression Strength: {customCompressionStrength}%
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              id="compression-strength"
              value={[customCompressionStrength]}
              onValueChange={([value]) => setCustomCompressionStrength(value)}
              min={0}
              max={95}
              step={1}
              className="w-full"
            />
            <Badge variant="outline">{customCompressionStrength}%</Badge>
          </div>
          <p className="text-xs text-gray-500">
            Higher strength means smaller file size but lower quality.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompressionSettings;
