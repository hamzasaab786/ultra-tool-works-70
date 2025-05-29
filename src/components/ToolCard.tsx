
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
    <ThreeDEffects type="card" intensity="low">
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer h-full",
          "bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-sm",
          "hover:border-indigo-200/80 hover:bg-white hover:shadow-lg",
          "card-modern",
          className
        )} 
        style={style} 
        onClick={handleNavigate}
      >
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50/50 text-indigo-600 group-hover:from-indigo-100 group-hover:to-purple-100/70 group-hover:scale-105 transition-all duration-300">
                <div className="relative z-10 w-6 h-6">
                  {icon}
                </div>
              </div>
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 pb-4">
          {/* Reserved for future features */}
        </CardContent>
        
        <CardFooter className="relative z-10">
          <Button 
            onClick={handleNavigate} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 btn-modern shadow-sm"
          >
            Use Tool
          </Button>
        </CardFooter>
      </Card>
    </ThreeDEffects>
  );
};

export default ToolCard;
