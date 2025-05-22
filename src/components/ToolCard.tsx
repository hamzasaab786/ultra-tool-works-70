
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  className?: string;
  style?: React.CSSProperties; // Add style prop
}

const ToolCard = ({ title, description, icon, path, className, style }: ToolCardProps) => {
  return (
    <Card 
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20", 
        className
      )}
      style={style} // Apply style prop
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-md bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Additional content if needed */}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={path}>Use Tool</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
