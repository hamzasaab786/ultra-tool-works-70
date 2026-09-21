export interface CurrencyDef {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  words: { major: string; majorPlural: string; minor: string };
}

// Note: deliberately curated list.
export const CURRENCIES: CurrencyDef[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE", words: { major: "Euro", majorPlural: "Euros", minor: "Cents" } },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", words: { major: "Pound", majorPlural: "Pounds", minor: "Pence" } },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "en-PK", words: { major: "Rupee", majorPlural: "Rupees", minor: "Paisa" } },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN", words: { major: "Rupee", majorPlural: "Rupees", minor: "Paise" } },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "en-AE", words: { major: "Dirham", majorPlural: "Dirhams", minor: "Fils" } },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "en-SA", words: { major: "Riyal", majorPlural: "Riyals", minor: "Halalas" } },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal", locale: "en-QA", words: { major: "Riyal", majorPlural: "Riyals", minor: "Dirhams" } },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", locale: "en-KW", words: { major: "Dinar", majorPlural: "Dinars", minor: "Fils" } },
  { code: "OMR", symbol: "﷼", name: "Omani Rial", locale: "en-OM", words: { major: "Rial", majorPlural: "Rials", minor: "Baisa" } },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar", locale: "en-BH", words: { major: "Dinar", majorPlural: "Dinars", minor: "Fils" } },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "en-MY", words: { major: "Ringgit", majorPlural: "Ringgit", minor: "Sen" } },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP", words: { major: "Yen", majorPlural: "Yen", minor: "Sen" } },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN", words: { major: "Yuan", majorPlural: "Yuan", minor: "Fen" } },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK", words: { major: "Dollar", majorPlural: "Dollars", minor: "Cents" } },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH", words: { major: "Franc", majorPlural: "Francs", minor: "Rappen" } },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE", words: { major: "Krona", majorPlural: "Kronor", minor: "Öre" } },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO", words: { major: "Krone", majorPlural: "Kroner", minor: "Øre" } },
  { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK", words: { major: "Krone", majorPlural: "Kroner", minor: "Øre" } },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", locale: "pl-PL", words: { major: "Zloty", majorPlural: "Zlotys", minor: "Groszy" } },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR", words: { major: "Lira", majorPlural: "Lira", minor: "Kurus" } },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA", words: { major: "Rand", majorPlural: "Rand", minor: "Cents" } },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG", words: { major: "Naira", majorPlural: "Naira", minor: "Kobo" } },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE", words: { major: "Shilling", majorPlural: "Shillings", minor: "Cents" } },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", locale: "en-EG", words: { major: "Pound", majorPlural: "Pounds", minor: "Piastres" } },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "en-BD", words: { major: "Taka", majorPlural: "Taka", minor: "Poisha" } },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", locale: "en-LK", words: { major: "Rupee", majorPlural: "Rupees", minor: "Cents" } },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID", words: { major: "Rupiah", majorPlural: "Rupiah", minor: "Sen" } },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH", words: { major: "Peso", majorPlural: "Pesos", minor: "Centavos" } },
  { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH", words: { major: "Baht", majorPlural: "Baht", minor: "Satang" } },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN", words: { major: "Dong", majorPlural: "Dong", minor: "Hao" } },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR", words: { major: "Real", majorPlural: "Reais", minor: "Centavos" } },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX", words: { major: "Peso", majorPlural: "Pesos", minor: "Centavos" } },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso", locale: "es-AR", words: { major: "Peso", majorPlural: "Pesos", minor: "Centavos" } },
  { code: "CLP", symbol: "CLP$", name: "Chilean Peso", locale: "es-CL", words: { major: "Peso", majorPlural: "Pesos", minor: "Centavos" } },
  { code: "COP", symbol: "COL$", name: "Colombian Peso", locale: "es-CO", words: { major: "Peso", majorPlural: "Pesos", minor: "Centavos" } },
];

export const getCurrency = (code: string): CurrencyDef => CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

export const formatMoney = (value: number, code: string, withCode = false) => {
  const c = getCurrency(code);
  const num = new Intl.NumberFormat(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number.isFinite(value) ? value : 0
  );
  return withCode ? `${c.symbol}${num} ${c.code}` : `${c.symbol}${num}`;
};

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const belowThousand = (n: number): string => {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${belowThousand(n % 100)}` : ""}`;
};

const WESTERN = [
  { value: 1_000_000_000, name: "Billion" },
  { value: 1_000_000, name: "Million" },
  { value: 1_000, name: "Thousand" },
];
const INDIAN = [
  { value: 10_000_000, name: "Crore" },
  { value: 100_000, name: "Lakh" },
  { value: 1_000, name: "Thousand" },
];

export const numberToWords = (value: number, system: "western" | "indian" = "western"): string => {
  let n = Math.floor(Math.abs(value));
  if (n === 0) return "Zero";
  const scales = system === "indian" ? INDIAN : WESTERN;
  const parts: string[] = [];
  for (const scale of scales) {
    if (n >= scale.value) {
      const count = Math.floor(n / scale.value);
      parts.push(`${numberToWords(count, system)} ${scale.name}`);
      n %= scale.value;
    }
  }
  if (n > 0) parts.push(belowThousand(n));
  return parts.join(" ").trim();
};

export const amountInWords = (value: number, code: string) => {
  const c = getCurrency(code);
  const system = ["INR", "PKR", "BDT", "LKR"].includes(code) ? "indian" : "western";
  const major = Math.floor(Math.abs(value));
  const minor = Math.round((Math.abs(value) - major) * 100);
  const majorWord = major === 1 ? c.words.major : c.words.majorPlural;
  let out = `${numberToWords(major, system)} ${majorWord}`;
  if (minor > 0) out += ` and ${numberToWords(minor, system)} ${c.words.minor}`;
  return `${out} Only`;
};
