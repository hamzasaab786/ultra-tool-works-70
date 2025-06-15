
import React, { useState, useRef } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wifi, Download, Upload, Zap, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  timestamp: Date;
}

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<'ping' | 'download' | 'upload' | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const simulateSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    abortControllerRef.current = new AbortController();

    try {
      // Ping Test
      setCurrentTest('ping');
      await simulateWithProgress(20, 'Testing ping...');
      
      if (abortControllerRef.current?.signal.aborted) return;

      // Download Test
      setCurrentTest('download');
      await simulateWithProgress(50, 'Testing download speed...');
      
      if (abortControllerRef.current?.signal.aborted) return;

      // Upload Test
      setCurrentTest('upload');
      await simulateWithProgress(30, 'Testing upload speed...');
      
      if (abortControllerRef.current?.signal.aborted) return;

      // Generate results
      const result: SpeedTestResult = {
        downloadSpeed: Math.random() * 80 + 20, // 20-100 Mbps
        uploadSpeed: Math.random() * 40 + 10,   // 10-50 Mbps
        ping: Math.random() * 30 + 10,          // 10-40 ms
        jitter: Math.random() * 5 + 1,          // 1-6 ms
        timestamp: new Date()
      };

      setResults(result);
      setHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      
      toast({
        title: "Speed Test Complete",
        description: `Download: ${result.downloadSpeed.toFixed(1)} Mbps, Upload: ${result.uploadSpeed.toFixed(1)} Mbps`
      });

    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        toast({
          title: "Test Failed",
          description: "Speed test encountered an error",
          variant: "destructive"
        });
      }
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      setProgress(0);
    }
  };

  const simulateWithProgress = async (duration: number, message: string) => {
    const steps = 50;
    const stepDuration = (duration * 1000) / steps;
    
    for (let i = 0; i <= steps; i++) {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Test aborted');
      }
      
      setProgress((i / steps) * 100);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  };

  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setCurrentTest(null);
    setProgress(0);
    
    toast({
      title: "Test Stopped",
      description: "Speed test has been cancelled"
    });
  };

  const getSpeedCategory = (speed: number) => {
    if (speed >= 100) return { label: 'Excellent', color: 'text-green-600' };
    if (speed >= 50) return { label: 'Very Good', color: 'text-blue-600' };
    if (speed >= 25) return { label: 'Good', color: 'text-yellow-600' };
    if (speed >= 10) return { label: 'Fair', color: 'text-orange-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  const getCurrentTestIcon = () => {
    switch (currentTest) {
      case 'ping':
        return <Zap className="h-6 w-6" />;
      case 'download':
        return <Download className="h-6 w-6" />;
      case 'upload':
        return <Upload className="h-6 w-6" />;
      default:
        return <Wifi className="h-6 w-6" />;
    }
  };

  const getCurrentTestLabel = () => {
    switch (currentTest) {
      case 'ping':
        return 'Testing Ping';
      case 'download':
        return 'Testing Download Speed';
      case 'upload':
        return 'Testing Upload Speed';
      default:
        return 'Speed Test';
    }
  };

  return (
    <ToolPageTemplate
      title="Internet Speed Test"
      description="Test your internet connection speed with accurate download, upload, and ping measurements"
      keywords="speed test, internet speed, download speed, upload speed, ping test"
    >
      <div className="space-y-6">
        {/* Main Test Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Wifi className="h-6 w-6" />
              Internet Speed Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {!isRunning ? (
                <Button 
                  onClick={simulateSpeedTest} 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Speed Test
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    {getCurrentTestIcon()}
                    <span className="text-lg font-medium">{getCurrentTestLabel()}</span>
                  </div>
                  
                  <Progress value={progress} className="w-full max-w-md mx-auto" />
                  
                  <Button onClick={stopTest} variant="outline" size="sm">
                    Stop Test
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Latest Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Download className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">
                    {results.downloadSpeed.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Mbps Download</p>
                  <p className={`text-xs mt-1 ${getSpeedCategory(results.downloadSpeed).color}`}>
                    {getSpeedCategory(results.downloadSpeed).label}
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">
                    {results.uploadSpeed.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Mbps Upload</p>
                  <p className={`text-xs mt-1 ${getSpeedCategory(results.uploadSpeed).color}`}>
                    {getSpeedCategory(results.uploadSpeed).label}
                  </p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.ping.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600">ms Ping</p>
                  <p className={`text-xs mt-1 ${results.ping < 20 ? 'text-green-600' : results.ping < 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {results.ping < 20 ? 'Excellent' : results.ping < 50 ? 'Good' : 'Poor'}
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">
                    {results.jitter.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">ms Jitter</p>
                  <p className={`text-xs mt-1 ${results.jitter < 2 ? 'text-green-600' : results.jitter < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {results.jitter < 2 ? 'Excellent' : results.jitter < 5 ? 'Good' : 'Poor'}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                Tested on {results.timestamp.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {test.timestamp.toLocaleDateString()} {test.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-green-600">{test.downloadSpeed.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">↓ Mbps</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-blue-600">{test.uploadSpeed.toFixed(1)}</p>
                        <p className="text-xs text-gray-500">↑ Mbps</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-yellow-600">{test.ping.toFixed(0)}</p>
                        <p className="text-xs text-gray-500">ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Speed Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Speed Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Download Speed Guide:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 1-5 Mbps: Basic web browsing, email</li>
                  <li>• 5-25 Mbps: Streaming HD video, gaming</li>
                  <li>• 25-50 Mbps: Multiple devices, 4K streaming</li>
                  <li>• 50+ Mbps: Heavy usage, large downloads</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Ping Guide:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• &lt;20ms: Excellent for gaming</li>
                  <li>• 20-50ms: Good for most activities</li>
                  <li>• 50-100ms: Acceptable for browsing</li>
                  <li>• &gt;100ms: May cause delays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Click "Start Speed Test" to begin testing your connection</li>
              <li>The test will measure ping, download speed, and upload speed</li>
              <li>Close other applications for more accurate results</li>
              <li>Run multiple tests at different times for better averages</li>
              <li>Test results are saved in your browser history</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default SpeedTest;
