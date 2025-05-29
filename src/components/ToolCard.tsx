
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
          "bg-white/95 backdrop-blur-sm border border-indigo-100/40",
          "hover:border-purple-200/60 hover:bg-white/98",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/3 before:to-purple-500/3 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
          className
        )} 
        style={style} 
        onClick={handleNavigate}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                <div className="relative z-10">
                  {icon}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 pb-4">
          {/* Additional content space if needed */}
        </CardContent>
        
        <CardFooter className="relative z-10">
          <Button 
            onClick={handleNavigate} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 transform"
          >
            <span className="relative z-10">Use Tool</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </Button>
        </CardFooter>
      </Card>
    </ThreeDEffects>
  );
};

export default ToolCard;
