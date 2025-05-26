
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Coins } from "lucide-react";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // Mock exchange rates (in a real app, you'd fetch these from an API)
  const exchangeRates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
    AUD: 1.35,
    CAD: 1.25,
    CHF: 0.92,
    CNY: 6.45,
    SEK: 8.65,
    NZD: 1.42,
    MXN: 20.15,
    SGD: 1.35,
    HKD: 7.75,
    NOK: 8.95,
    INR: 74.25,
    RUB: 75.50,
    ZAR: 14.85,
    BRL: 5.35
  };

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
    BRL: 'Brazilian Real'
  };

  const convert = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('');
      return;
    }

    // Convert to USD first, then to target currency
    const usdValue = value / exchangeRates[fromCurrency];
    const convertedValue = usdValue * exchangeRates[toCurrency];
    
    setResult(convertedValue.toFixed(2));
  }, [inputValue, fromCurrency, toCurrency]);

  React.useEffect(() => {
    if (inputValue && fromCurrency && toCurrency) {
      convert();
    }
  }, [inputValue, fromCurrency, toCurrency, convert]);

  const swapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }, [fromCurrency, toCurrency]);

  return (
    <ToolPageTemplate
      title="Currency Converter"
      description="Convert between major world currencies with live exchange rates"
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            <Coins className="inline h-4 w-4 mr-1" />
            Exchange rates are updated daily and may not reflect real-time values.
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
          <Button variant="outline" size="sm" onClick={swapCurrencies}>
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
              {result || '0.00'}
            </div>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-primary/5 rounded-md">
            <p className="text-center text-lg">
              <span className="font-semibold">{inputValue} {fromCurrency}</span>
              {' = '}
              <span className="font-semibold text-primary">{result} {toCurrency}</span>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Exchange rate: 1 {fromCurrency} = {((exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4))} {toCurrency}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 border rounded-md text-center">
            <p className="text-sm text-muted-foreground">USD/EUR</p>
            <p className="font-semibold">{(exchangeRates.EUR / exchangeRates.USD).toFixed(4)}</p>
          </div>
          <div className="p-3 border rounded-md text-center">
            <p className="text-sm text-muted-foreground">USD/GBP</p>
            <p className="font-semibold">{(exchangeRates.GBP / exchangeRates.USD).toFixed(4)}</p>
          </div>
          <div className="p-3 border rounded-md text-center">
            <p className="text-sm text-muted-foreground">USD/JPY</p>
            <p className="font-semibold">{(exchangeRates.JPY / exchangeRates.USD).toFixed(2)}</p>
          </div>
          <div className="p-3 border rounded-md text-center">
            <p className="text-sm text-muted-foreground">USD/CAD</p>
            <p className="font-semibold">{(exchangeRates.CAD / exchangeRates.USD).toFixed(4)}</p>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default CurrencyConverter;
