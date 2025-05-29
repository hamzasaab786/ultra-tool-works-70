
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
        description: "Failed to fetch real-time exchange rate. Please try again.",
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
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            <Coins className="inline h-4 w-4 mr-1" />
            Real-time exchange rates powered by RapidAPI Currency Converter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-currency" className="mb-2 block">From Currency</Label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="to-currency" className="mb-2 block">To Currency</Label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>{code} - {name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm" onClick={swapCurrencies} disabled={isLoading}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="input-amount" className="mb-2 block">Amount</Label>
            <Input
              id="input-amount"
              type="number"
              placeholder="Enter amount"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              step="0.01"
            />
          </div>

          <div>
            <Label className="mb-2 block">Converted Amount</Label>
            <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md flex items-center">
              {isLoading ? 'Loading...' : (result || '0.00')}
            </div>
          </div>
        </div>

        <Button 
          onClick={fetchExchangeRate} 
          disabled={isLoading || !fromCurrency || !toCurrency}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Fetching Rate...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" /> Get Latest Exchange Rate
            </>
          )}
        </Button>

        {result && exchangeRate > 0 && (
          <div className="p-4 bg-primary/5 rounded-md">
            <p className="text-center text-lg">
              <span className="font-semibold">{inputValue} {fromCurrency}</span>
              {' = '}
              <span className="font-semibold text-primary">{result} {toCurrency}</span>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Exchange rate: 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default CurrencyConverter;
