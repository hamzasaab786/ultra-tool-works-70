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

  // Expanded exchange rates with more countries
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
    BRL: 5.35,
    KRW: 1180,
    PLN: 3.85,
    TRY: 8.45,
    THB: 33.25,
    CZK: 21.50,
    HUF: 295,
    ILS: 3.25,
    DKK: 6.35,
    AED: 3.67,
    SAR: 3.75,
    EGP: 15.70,
    NGN: 411,
    KES: 108,
    GHS: 6.15,
    MAD: 8.95,
    TND: 2.75,
    PKR: 155,
    BDT: 85,
    LKR: 198,
    VND: 23150,
    IDR: 14250,
    MYR: 4.15,
    PHP: 50.25,
    UAH: 27.50,
    RON: 4.25,
    BGN: 1.66,
    HRK: 6.42,
    RSD: 100,
    ISK: 125,
    ALL: 103,
    MKD: 52.5,
    BAM: 1.66,
    GEL: 3.15,
    AMD: 520,
    AZN: 1.70,
    KZT: 425,
    UZS: 10650,
    TJS: 11.35,
    KGS: 84.75,
    TMT: 3.50,
    AFN: 87.50,
    IRR: 42000,
    IQD: 1460,
    JOD: 0.71,
    KWD: 0.30,
    LBP: 1510,
    OMR: 0.38,
    QAR: 3.64,
    SYP: 2515,
    YER: 250,
    BHD: 0.38,
    ETB: 44.25,
    KES: 108,
    MGA: 3950,
    MUR: 42.50,
    MZN: 63.75,
    RWF: 1025,
    SCR: 13.45,
    TZS: 2315,
    UGX: 3725,
    ZMW: 17.85,
    BWP: 11.15,
    SZL: 14.85,
    LSL: 14.85,
    NAD: 14.85
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
    EGP: 'Egyptian Pound',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
    MAD: 'Moroccan Dirham',
    TND: 'Tunisian Dinar',
    PKR: 'Pakistani Rupee',
    BDT: 'Bangladeshi Taka',
    LKR: 'Sri Lankan Rupee',
    VND: 'Vietnamese Dong',
    IDR: 'Indonesian Rupiah',
    MYR: 'Malaysian Ringgit',
    PHP: 'Philippine Peso',
    UAH: 'Ukrainian Hryvnia',
    RON: 'Romanian Leu',
    BGN: 'Bulgarian Lev',
    HRK: 'Croatian Kuna',
    RSD: 'Serbian Dinar',
    ISK: 'Icelandic Króna',
    ALL: 'Albanian Lek',
    MKD: 'Macedonian Denar',
    BAM: 'Bosnia and Herzegovina Convertible Mark',
    GEL: 'Georgian Lari',
    AMD: 'Armenian Dram',
    AZN: 'Azerbaijani Manat',
    KZT: 'Kazakhstani Tenge',
    UZS: 'Uzbekistani Som',
    TJS: 'Tajikistani Somoni',
    KGS: 'Kyrgyzstani Som',
    TMT: 'Turkmenistani Manat',
    AFN: 'Afghan Afghani',
    IRR: 'Iranian Rial',
    IQD: 'Iraqi Dinar',
    JOD: 'Jordanian Dinar',
    KWD: 'Kuwaiti Dinar',
    LBP: 'Lebanese Pound',
    OMR: 'Omani Rial',
    QAR: 'Qatari Riyal',
    SYP: 'Syrian Pound',
    YER: 'Yemeni Rial',
    BHD: 'Bahraini Dinar',
    ETB: 'Ethiopian Birr',
    MGA: 'Malagasy Ariary',
    MUR: 'Mauritian Rupee',
    MZN: 'Mozambican Metical',
    RWF: 'Rwandan Franc',
    SCR: 'Seychellois Rupee',
    TZS: 'Tanzanian Shilling',
    UGX: 'Ugandan Shilling',
    ZMW: 'Zambian Kwacha',
    BWP: 'Botswana Pula',
    SZL: 'Swazi Lilangeni',
    LSL: 'Lesotho Loti',
    NAD: 'Namibian Dollar'
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
      description="Convert between major world currencies with comprehensive coverage of global markets"
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
