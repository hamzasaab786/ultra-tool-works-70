
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  className?: string;
}

const ToolCard = ({ title, description, icon, path, className = "" }: ToolCardProps) => {
  return (
    <Link to={path} className="block group h-full">
      <Card className={`h-full overflow-hidden border-0 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-700 ease-out transform hover:-translate-y-3 hover:scale-[1.02] ${className}`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <div className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                {React.cloneElement(icon as React.ReactElement, { 
                  className: "h-8 w-8" 
                })}
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <CardTitle className="text-white text-xl font-bold group-hover:text-cyan-300 transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 pt-0">
          <CardDescription className="text-white/70 text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            {description}
          </CardDescription>
          
          {/* Animated border bottom */}
          <div className="mt-6 h-1 w-0 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-500 ease-out rounded-full"></div>
        </CardContent>
        
        {/* Corner highlight */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </Link>
  );
};

export default ToolCard;
