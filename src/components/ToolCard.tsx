
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThreeDEffects from "./ThreeDEffects";
import { recordRecentTool } from "@/lib/recentTools";

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
  const handleNavigate = () => {
    recordRecentTool(path, title);
  };

  return (
    <ThreeDEffects type="card" intensity="low">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-out cursor-pointer h-full",
          "bg-card border border-border/60 shadow-sm",
          "hover:border-indigo-200/80 dark:hover:border-indigo-400/30 hover:bg-card hover:shadow-lg",
          "card-modern",
          className
        )}
        style={style}
      >
        <Link
          to={path}
          onClick={handleNavigate}
          className="block relative z-10 focus:outline-none"
          aria-label={`Open ${title}`}
        >
          <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-600 dark:text-indigo-400 group-hover:from-indigo-100 group-hover:to-purple-100/70 dark:group-hover:from-indigo-900 dark:group-hover:to-purple-900/70 group-hover:scale-105 transition-all duration-300">
                <div className="relative z-10 w-6 h-6">
                  {icon}
                </div>
              </div>
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300 leading-relaxed text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Reserved for future features */}
        </CardContent>
        </Link>
        
        <CardFooter className="relative z-10">
          <Button asChild
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 btn-modern shadow-sm"
          >
            <Link to={path} onClick={handleNavigate}>Use Tool</Link>
          </Button>
        </CardFooter>
      </Card>
    </ThreeDEffects>
  );
};

export default ToolCard;
