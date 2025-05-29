
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Coins, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Major currencies supported by the API
  const currencies = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    SEK: 'Swedish Krona',
    NZD: 'New Zealand Dollar',
    MXN: 'Mexican Peso',
    SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar',
    NOK: 'Norwegian Krone',
    INR: 'Indian Rupee',
    RUB: 'Russian Ruble',
    ZAR: 'South African Rand',
    BRL: 'Brazilian Real',
    KRW: 'South Korean Won',
    PLN: 'Polish Złoty',
    TRY: 'Turkish Lira',
    THB: 'Thai Baht',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    ILS: 'Israeli Shekel',
    DKK: 'Danish Krone',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    EGP: 'Egyptian Pound'
  };

  const fetchExchangeRate = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://currency-converter241.p.rapidapi.com/conversion_rate?from=${fromCurrency}&to=${toCurrency}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'currency-converter241.p.rapidapi.com',
            'x-rapidapi-key': 'e57b8a99f0msh88da9f978c852c2p1df7e3jsn8ebc5e0837d9'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data && data.conversion_rate) {
        setExchangeRate(data.conversion_rate);
        
        if (inputValue) {
          const value = parseFloat(inputValue);
          if (!isNaN(value)) {
            const convertedValue = value * data.conversion_rate;
            setResult(convertedValue.toFixed(4));
          }
        }
        
        toast({
          title: "Success",
          description: "Exchange rate updated successfully!",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency, inputValue]);

  const convert = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || exchangeRate === 0) {
      setResult('');
      return;
    }

    const convertedValue = value * exchangeRate;
    setResult(convertedValue.toFixed(4));
  }, [inputValue, exchangeRate]);

  React.useEffect(() => {
    if (inputValue && exchangeRate > 0) {
      convert();
    }
  }, [inputValue, exchangeRate, convert]);

  React.useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, fetchExchangeRate]);

  const swapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }, [fromCurrency, toCurrency]);

  return (
    <ToolPageTemplate
      title="Currency Converter"
      description="Convert between major world currencies with real-time exchange rates"
    >
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
            <Coins className="inline h-4 w-4 mr-2" />
            Real-time exchange rates for accurate currency conversion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="from-currency" className="text-sm font-medium">From Currency</Label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full h-11 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-currency" className="text-sm font-medium">To Currency</Label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full h-11 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={swapCurrencies} 
            disabled={isLoading}
            className="rounded-full w-10 h-10 p-0"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="input-amount" className="text-sm font-medium">Amount</Label>
            <Input
              id="input-amount"
              type="number"
              placeholder="Enter amount"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              step="0.01"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Converted Amount</Label>
            <div className="h-11 px-3 py-2 border border-input bg-muted/50 rounded-md flex items-center text-lg font-medium">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </div>
              ) : (
                result || '0.00'
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={fetchExchangeRate} 
          disabled={isLoading || !fromCurrency || !toCurrency}
          className="w-full h-12 text-base"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Fetching Rate...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-5 w-5" /> Get Latest Exchange Rate
            </>
          )}
        </Button>

        {result && exchangeRate > 0 && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-center space-y-3">
              <p className="text-xl font-semibold">
                <span className="text-gray-700 dark:text-gray-300">{inputValue} {fromCurrency}</span>
                <span className="mx-3 text-gray-500">=</span>
                <span className="text-green-600 dark:text-green-400">{result} {toCurrency}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exchange rate: 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default CurrencyConverter;
