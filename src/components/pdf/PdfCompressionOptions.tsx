
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, Zap, Shield, Gauge, Maximize } from "lucide-react";

export type CompressionLevel = "low" | "medium" | "high" | "maximum";

interface PdfCompressionOptionsProps {
  compressionLevel: CompressionLevel;
  onCompressionLevelChange: (level: CompressionLevel) => void;
}

const PdfCompressionOptions: React.FC<PdfCompressionOptionsProps> = ({
  compressionLevel,
  onCompressionLevelChange
}) => {
  const compressionLevels = [
    { 
      value: "low" as CompressionLevel, 
      label: "Low", 
      icon: Shield,
      description: "Minimal compression, best quality", 
      savings: "5-15%",
      color: "text-green-600"
    },
    { 
      value: "medium" as CompressionLevel, 
      label: "Medium", 
      icon: Gauge,
      description: "Balanced compression and quality", 
      savings: "15-30%",
      color: "text-blue-600"
    },
    { 
      value: "high" as CompressionLevel, 
      label: "High", 
      icon: Zap,
      description: "Strong compression, good quality", 
      savings: "25-45%",
      color: "text-orange-600"
    },
    { 
      value: "maximum" as CompressionLevel, 
      label: "Maximum", 
      icon: Maximize,
      description: "Highest compression, minimum size", 
      savings: "35-60%",
      color: "text-red-600"
    }
  ];

  const currentLevel = compressionLevels.find(level => level.value === compressionLevel);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Compression Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Choose compression strength:</Label>
          
          <ToggleGroup 
            type="single" 
            value={compressionLevel} 
            onValueChange={(value) => value && onCompressionLevelChange(value as CompressionLevel)}
            className="grid grid-cols-2 gap-2 w-full"
          >
            {compressionLevels.map((level) => {
              const IconComponent = level.icon;
              return (
                <ToggleGroupItem
                  key={level.value}
                  value={level.value}
                  className="flex flex-col h-auto p-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <IconComponent className={`h-4 w-4 mb-1 ${level.color}`} />
                  <span className="font-medium text-sm">{level.label}</span>
                  <span className="text-xs opacity-75">{level.savings}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
        
        {currentLevel && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <currentLevel.icon className={`h-4 w-4 ${currentLevel.color}`} />
              <span className="font-medium text-blue-900">{currentLevel.label} Compression</span>
            </div>
            <div className="text-sm text-blue-700">{currentLevel.description}</div>
            <div className="text-xs text-blue-600 mt-1">
              Expected file size reduction: {currentLevel.savings}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfCompressionOptions;
