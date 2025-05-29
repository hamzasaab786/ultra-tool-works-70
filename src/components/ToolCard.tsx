
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThreeDEffects from "./ThreeDEffects";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  className?: string;
  style?: React.CSSProperties;
}

const ToolCard = ({
  title,
  description,
  icon,
  path,
  className,
  style
}: ToolCardProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <ThreeDEffects type="card" intensity="medium">
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-500 ease-out cursor-pointer h-full",
          "bg-white/90 backdrop-blur-sm border border-white/30",
          "hover:border-purple-300/50 hover:bg-white/95",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/5 before:to-blue-500/5 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          className
        )} 
        style={style} 
        onClick={handleNavigate}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 group-hover:from-purple-200 group-hover:to-blue-200 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                <div className="relative z-10">
                  {icon}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 pb-4">
          {/* Additional content space if needed */}
        </CardContent>
        
        <CardFooter className="relative z-10">
          <Button 
            onClick={handleNavigate} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 transform"
          >
            <span className="relative z-10">Use Tool</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </Button>
        </CardFooter>
      </Card>
    </ThreeDEffects>
  );
};

export default ToolCard;
