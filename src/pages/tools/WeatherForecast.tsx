
import React, { useState, useEffect } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
}

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock weather data generator
  const generateMockWeather = (locationName: string): WeatherData => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Snow'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const forecast: ForecastDay[] = [];
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecast.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        high: Math.floor(Math.random() * 30) + 60,
        low: Math.floor(Math.random() * 20) + 40,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 40) + 40
      });
    }

    return {
      location: locationName,
      temperature: Math.floor(Math.random() * 40) + 50,
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      pressure: Math.floor(Math.random() * 100) + 1000,
      visibility: Math.floor(Math.random() * 10) + 5,
      uvIndex: Math.floor(Math.random() * 10) + 1,
      forecast
    };
  };

  const getCurrentLocationWeather = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use the coordinates to fetch weather
          const mockLocation = 'Current Location';
          setWeatherData(generateMockWeather(mockLocation));
          setLoading(false);
          
          toast({
            title: "Location Found",
            description: "Weather data for your current location loaded"
          });
        },
        (error) => {
          setLoading(false);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter a location manually",
        variant: "destructive"
      });
    }
  };

  const searchWeather = () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setWeatherData(generateMockWeather(location));
      setLoading(false);
      
      toast({
        title: "Weather Updated",
        description: `Weather data for ${location} loaded successfully`
      });
    }, 1000);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'light rain':
      case 'heavy rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getConditionClass = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'partly cloudy':
        return 'from-blue-400 to-gray-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'light rain':
      case 'heavy rain':
        return 'from-blue-500 to-blue-700';
      case 'snow':
        return 'from-blue-200 to-gray-400';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <ToolPageTemplate
      title="Weather Forecast"
      description="Get current weather conditions and 5-day forecast for any location worldwide"
      keywords="weather forecast, current weather, temperature, humidity, weather conditions"
    >
      <div className="space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Weather Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter city name (e.g., New York, London, Tokyo)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
                className="flex-1"
              />
              
              <div className="flex gap-2">
                <Button onClick={searchWeather} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                
                <Button onClick={getCurrentLocationWeather} variant="outline" disabled={loading}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Location
                </Button>
              </div>
            </div>
            
            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Loading weather data...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Weather */}
        {weatherData && (
          <Card className={`bg-gradient-to-br ${getConditionClass(weatherData.condition)} text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{weatherData.location}</h2>
                  <p className="text-lg opacity-90">{weatherData.condition}</p>
                </div>
                {getWeatherIcon(weatherData.condition)}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{weatherData.temperature}°F</p>
                  <p className="text-sm opacity-75">Temperature</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold">{weatherData.humidity}%</p>
                  <p className="text-sm opacity-75">Humidity</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold">{weatherData.windSpeed} mph</p>
                  <p className="text-sm opacity-75">Wind Speed</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold">{weatherData.uvIndex}</p>
                  <p className="text-sm opacity-75">UV Index</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Details */}
        {weatherData && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold">{weatherData.pressure} mb</p>
                  <p className="text-sm text-gray-600">Pressure</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold">{weatherData.visibility} mi</p>
                  <p className="text-sm text-gray-600">Visibility</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Wind className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5-Day Forecast */}
        {weatherData && (
          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <p className="font-medium mb-2">{day.date}</p>
                    {getWeatherIcon(day.condition)}
                    <p className="text-sm text-gray-600 mt-2">{day.condition}</p>
                    <div className="mt-2">
                      <p className="font-semibold">{day.high}°</p>
                      <p className="text-sm text-gray-500">{day.low}°</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{day.humidity}% humidity</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Enter a city name in the search box and click "Search"</li>
              <li>Or click "Use Location" to get weather for your current location</li>
              <li>View current weather conditions, temperature, and humidity</li>
              <li>Check the 5-day forecast for planning ahead</li>
              <li>Additional details include pressure, visibility, and UV index</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default WeatherForecast;
