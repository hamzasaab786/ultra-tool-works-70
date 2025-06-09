
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface PdfCompressionOptionsProps {
  compressionLevel: CompressionLevel;
  onCompressionLevelChange: (level: CompressionLevel) => void;
}

const PdfCompressionOptions: React.FC<PdfCompressionOptionsProps> = ({
  compressionLevel,
  onCompressionLevelChange
}) => {
  const compressionLevels: { value: CompressionLevel; label: string; description: string }[] = [
    { value: "low", label: "Low", description: "Minimal compression, preserves maximum quality" },
    { value: "medium", label: "Medium", description: "Balanced compression and quality" },
    { value: "high", label: "High", description: "Strong compression, good quality" },
    { value: "maximum", label: "Maximum", description: "Highest compression, minimum file size" }
  ];

  const getCurrentLevelIndex = () => {
    return compressionLevels.findIndex(level => level.value === compressionLevel);
  };

  const handleSliderChange = (value: number[]) => {
    const newLevel = compressionLevels[value[0]];
    if (newLevel) {
      onCompressionLevelChange(newLevel.value);
    }
  };

  const currentLevel = compressionLevels[getCurrentLevelIndex()];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Compression Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="compression-level">Compression Level</Label>
          <div className="px-2">
            <Slider
              id="compression-level"
              min={0}
              max={compressionLevels.length - 1}
              step={1}
              value={[getCurrentLevelIndex()]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-2">
            {compressionLevels.map((level) => (
              <span key={level.value}>{level.label}</span>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="font-medium text-blue-900">{currentLevel.label} Compression</div>
          <div className="text-sm text-blue-700">{currentLevel.description}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfCompressionOptions;
