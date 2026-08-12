
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! The page you are looking for doesn't exist or has been moved.</p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
