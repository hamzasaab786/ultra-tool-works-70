
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Coins, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ThreeDEffects from "@/components/ThreeDEffects";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive currencies list (excluding Israel and removing duplicates)
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
    DKK: 'Danish Krone',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    EGP: 'Egyptian Pound',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    PKR: 'Pakistani Rupee',
    BDT: 'Bangladeshi Taka',
    LKR: 'Sri Lankan Rupee',
    VND: 'Vietnamese Dong',
    IDR: 'Indonesian Rupiah',
    MYR: 'Malaysian Ringgit',
    PHP: 'Philippine Peso',
    QAR: 'Qatari Riyal',
    KWD: 'Kuwaiti Dinar',
    BHD: 'Bahraini Dinar',
    OMR: 'Omani Rial',
    JOD: 'Jordanian Dinar',
    LBP: 'Lebanese Pound',
    MAD: 'Moroccan Dirham',
    TND: 'Tunisian Dinar',
    DZD: 'Algerian Dinar',
    LYD: 'Libyan Dinar',
    ETB: 'Ethiopian Birr',
    GHS: 'Ghanaian Cedi',
    UGX: 'Ugandan Shilling',
    TZS: 'Tanzanian Shilling',
    RWF: 'Rwandan Franc',
    AOA: 'Angolan Kwanza',
    MZN: 'Mozambican Metical',
    BWP: 'Botswana Pula',
    SZL: 'Swazi Lilangeni',
    LSL: 'Lesotho Loti',
    NAD: 'Namibian Dollar',
    ZMW: 'Zambian Kwacha',
    MWK: 'Malawian Kwacha',
    AFN: 'Afghan Afghani',
    ALL: 'Albanian Lek',
    AMD: 'Armenian Dram',
    ARS: 'Argentine Peso',
    AZN: 'Azerbaijani Manat',
    BAM: 'Bosnia Convertible Mark',
    BBD: 'Barbadian Dollar',
    BGN: 'Bulgarian Lev',
    BND: 'Brunei Dollar',
    BOB: 'Bolivian Boliviano',
    BSD: 'Bahamian Dollar',
    BTN: 'Bhutanese Ngultrum',
    BYN: 'Belarusian Ruble',
    BZD: 'Belize Dollar',
    CLP: 'Chilean Peso',
    COP: 'Colombian Peso',
    CRC: 'Costa Rican Colón',
    CUP: 'Cuban Peso',
    CVE: 'Cape Verdean Escudo',
    DJF: 'Djiboutian Franc',
    DOP: 'Dominican Peso',
    ERN: 'Eritrean Nakfa',
    FJD: 'Fijian Dollar',
    GEL: 'Georgian Lari',
    GIP: 'Gibraltar Pound',
    GMD: 'Gambian Dalasi',
    GNF: 'Guinean Franc',
    GTQ: 'Guatemalan Quetzal',
    GYD: 'Guyanese Dollar',
    HNL: 'Honduran Lempira',
    HRK: 'Croatian Kuna',
    HTG: 'Haitian Gourde',
    IQD: 'Iraqi Dinar',
    IRR: 'Iranian Rial',
    ISK: 'Icelandic Króna',
    JMD: 'Jamaican Dollar',
    KGS: 'Kyrgyzstani Som',
    KHR: 'Cambodian Riel',
    KMF: 'Comorian Franc',
    LAK: 'Lao Kip',
    MDL: 'Moldovan Leu',
    MGA: 'Malagasy Ariary',
    MKD: 'Macedonian Denar',
    MMK: 'Myanmar Kyat',
    MNT: 'Mongolian Tugrik',
    MOP: 'Macanese Pataca',
    MRU: 'Mauritanian Ouguiya',
    MUR: 'Mauritian Rupee',
    MVR: 'Maldivian Rufiyaa',
    NPR: 'Nepalese Rupee',
    NIO: 'Nicaraguan Córdoba',
    PEN: 'Peruvian Sol',
    PGK: 'Papua New Guinean Kina',
    PYG: 'Paraguayan Guaraní',
    RON: 'Romanian Leu',
    RSD: 'Serbian Dinar',
    SBD: 'Solomon Islands Dollar',
    SCR: 'Seychellois Rupee',
    SDG: 'Sudanese Pound',
    SHP: 'Saint Helena Pound',
    SLE: 'Sierra Leonean Leone',
    SOS: 'Somali Shilling',
    SRD: 'Surinamese Dollar',
    STN: 'São Tomé and Príncipe Dobra',
    SYP: 'Syrian Pound',
    TOP: 'Tongan Paʻanga',
    TTD: 'Trinidad and Tobago Dollar',
    TVD: 'Tuvaluan Dollar',
    TWD: 'Taiwan Dollar',
    UAH: 'Ukrainian Hryvnia',
    UYU: 'Uruguayan Peso',
    UZS: 'Uzbekistani Som',
    VES: 'Venezuelan Bolívar',
    VUV: 'Vanuatu Vatu',
    WST: 'Samoan Tala',
    XAF: 'Central African CFA Franc',
    XCD: 'East Caribbean Dollar',
    XOF: 'West African CFA Franc',
    XPF: 'CFP Franc',
    YER: 'Yemeni Rial',
    ZWL: 'Zimbabwean Dollar'
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
      
      // Handle the correct API response format
      let rate = 0;
      if (data && typeof data.rate === 'number') {
        rate = data.rate;
      } else if (data && data.conversion_rate) {
        rate = data.conversion_rate;
      } else {
        throw new Error('Invalid response format');
      }
      
      setExchangeRate(rate);
      
      if (inputValue) {
        const value = parseFloat(inputValue);
        if (!isNaN(value)) {
          const convertedValue = value * rate;
          setResult(convertedValue.toFixed(4));
        }
      }
      
      toast({
        title: "Success",
        description: "Exchange rate updated successfully!",
      });
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
      <ThreeDEffects type="card" intensity="low" className="space-y-6">
        {/* Info Card */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-lg rounded-xl border border-white/10 animate-fade-in">
          <p className="text-white flex items-center">
            <Coins className="inline h-5 w-5 mr-3 text-cyan-400" />
            Real-time exchange rates for accurate currency conversion
          </p>
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <ThreeDEffects type="card" intensity="low" className="space-y-3">
            <Label htmlFor="from-currency" className="text-sm font-medium text-white">From Currency</Label>
            <select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full h-12 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">{code} - {name}</option>
              ))}
            </select>
          </ThreeDEffects>

          <ThreeDEffects type="card" intensity="low" className="space-y-3">
            <Label htmlFor="to-currency" className="text-sm font-medium text-white">To Currency</Label>
            <select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full h-12 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code} className="bg-slate-900 text-white">{code} - {name}</option>
              ))}
            </select>
          </ThreeDEffects>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center py-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <ThreeDEffects type="card" intensity="medium">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={swapCurrencies} 
              disabled={isLoading}
              className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white hover:scale-110 transition-all duration-300"
            >
              <ArrowUpDown className="h-6 w-6" />
            </Button>
          </ThreeDEffects>
        </div>

        {/* Amount Input and Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <ThreeDEffects type="card" intensity="low" className="space-y-3">
            <Label htmlFor="input-amount" className="text-sm font-medium text-white">Amount</Label>
            <Input
              id="input-amount"
              type="number"
              placeholder="Enter amount"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              step="0.01"
              className="h-12 bg-white/10 backdrop-blur-lg border border-white/20 text-white transition-all duration-300"
            />
          </ThreeDEffects>

          <ThreeDEffects type="card" intensity="low" className="space-y-3">
            <Label className="text-sm font-medium text-white">Converted Amount</Label>
            <div className="h-12 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-md flex items-center text-lg font-medium text-white">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full mr-3"></div>
                  <span className="text-white/70">Loading...</span>
                </div>
              ) : (
                result || '0.00'
              )}
            </div>
          </ThreeDEffects>
        </div>

        {/* Convert Button */}
        <ThreeDEffects type="card" intensity="medium" className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Button 
            onClick={fetchExchangeRate} 
            disabled={isLoading || !fromCurrency || !toCurrency}
            className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 border border-white/10 shadow-lg shadow-purple-900/30 transition-all duration-500 hover:shadow-xl hover:shadow-purple-900/50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                Fetching Rate...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" /> Get Latest Exchange Rate
              </>
            )}
          </Button>
        </ThreeDEffects>

        {/* Results Card */}
        {result && exchangeRate > 0 && (
          <ThreeDEffects type="float" intensity="low" className="animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="text-center space-y-4">
                <p className="text-2xl font-semibold">
                  <span className="text-white/80">{inputValue} {fromCurrency}</span>
                  <span className="mx-3 text-white/50">=</span>
                  <span className="text-cyan-400 font-bold">{result} {toCurrency}</span>
                </p>
                <p className="text-white/70">
                  Exchange rate: 1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </p>
                <p className="text-xs text-white/50">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </ThreeDEffects>
        )}
      </ThreeDEffects>
    </ToolPageTemplate>
  );
};

export default CurrencyConverter;
