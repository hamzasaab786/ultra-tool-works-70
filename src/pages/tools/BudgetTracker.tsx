
import React, { useState, useCallback, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const BudgetTracker = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Groceries",
    "Insurance",
    "Other"
  ]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: ""
  });

  // Comprehensive currencies list (excluding Israel)
  const currencies = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    AUD: { symbol: 'A$', name: 'Australian Dollar' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar' },
    CHF: { symbol: 'Fr', name: 'Swiss Franc' },
    CNY: { symbol: '¥', name: 'Chinese Yuan' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
    BRL: { symbol: 'R$', name: 'Brazilian Real' },
    RUB: { symbol: '₽', name: 'Russian Ruble' },
    KRW: { symbol: '₩', name: 'South Korean Won' },
    MXN: { symbol: '$', name: 'Mexican Peso' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone' },
    SEK: { symbol: 'kr', name: 'Swedish Krona' },
    DKK: { symbol: 'kr', name: 'Danish Krone' },
    PLN: { symbol: 'zł', name: 'Polish Zloty' },
    CZK: { symbol: 'Kč', name: 'Czech Koruna' },
    HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
    SAR: { symbol: '﷼', name: 'Saudi Riyal' },
    EGP: { symbol: '£', name: 'Egyptian Pound' },
    ZAR: { symbol: 'R', name: 'South African Rand' },
    NGN: { symbol: '₦', name: 'Nigerian Naira' },
    KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
    TRY: { symbol: '₺', name: 'Turkish Lira' },
    PKR: { symbol: '₨', name: 'Pakistani Rupee' },
    BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
    LKR: { symbol: '₨', name: 'Sri Lankan Rupee' },
    THB: { symbol: '฿', name: 'Thai Baht' },
    VND: { symbol: '₫', name: 'Vietnamese Dong' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
    PHP: { symbol: '₱', name: 'Philippine Peso' },
    QAR: { symbol: 'ر.ق', name: 'Qatari Riyal' },
    KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    BHD: { symbol: '.د.ب', name: 'Bahraini Dinar' },
    OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
    JOD: { symbol: 'د.ا', name: 'Jordanian Dinar' },
    LBP: { symbol: 'ل.ل', name: 'Lebanese Pound' },
    MAD: { symbol: 'د.م.', name: 'Moroccan Dirham' },
    TND: { symbol: 'د.ت', name: 'Tunisian Dinar' },
    DZD: { symbol: 'د.ج', name: 'Algerian Dinar' },
    LYD: { symbol: 'ل.د', name: 'Libyan Dinar' },
    ETB: { symbol: 'Br', name: 'Ethiopian Birr' },
    GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
    UGX: { symbol: 'USh', name: 'Ugandan Shilling' },
    TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
    RWF: { symbol: 'FRw', name: 'Rwandan Franc' },
    AOA: { symbol: 'Kz', name: 'Angolan Kwanza' },
    MZN: { symbol: 'MT', name: 'Mozambican Metical' },
    BWP: { symbol: 'P', name: 'Botswana Pula' },
    SZL: { symbol: 'L', name: 'Swazi Lilangeni' },
    LSL: { symbol: 'L', name: 'Lesotho Loti' },
    NAD: { symbol: '$', name: 'Namibian Dollar' },
    ZMW: { symbol: 'ZK', name: 'Zambian Kwacha' },
    MWK: { symbol: 'MK', name: 'Malawian Kwacha' },
    AFN: { symbol: '؋', name: 'Afghan Afghani' },
    ALL: { symbol: 'L', name: 'Albanian Lek' },
    AMD: { symbol: '֏', name: 'Armenian Dram' },
    ARS: { symbol: '$', name: 'Argentine Peso' },
    AZN: { symbol: '₼', name: 'Azerbaijani Manat' },
    BAM: { symbol: 'КМ', name: 'Bosnia Convertible Mark' },
    BBD: { symbol: '$', name: 'Barbadian Dollar' },
    BGN: { symbol: 'лв', name: 'Bulgarian Lev' },
    BND: { symbol: '$', name: 'Brunei Dollar' },
    BOB: { symbol: 'Bs', name: 'Bolivian Boliviano' },
    BSD: { symbol: '$', name: 'Bahamian Dollar' },
    BTN: { symbol: 'Nu.', name: 'Bhutanese Ngultrum' },
    BYN: { symbol: 'Br', name: 'Belarusian Ruble' },
    BZD: { symbol: 'BZ$', name: 'Belize Dollar' },
    CLP: { symbol: '$', name: 'Chilean Peso' },
    COP: { symbol: '$', name: 'Colombian Peso' },
    CRC: { symbol: '₡', name: 'Costa Rican Colón' },
    CUP: { symbol: '₱', name: 'Cuban Peso' },
    CVE: { symbol: '$', name: 'Cape Verdean Escudo' },
    DJF: { symbol: 'Fdj', name: 'Djiboutian Franc' },
    DOP: { symbol: 'RD$', name: 'Dominican Peso' },
    ERN: { symbol: 'Nfk', name: 'Eritrean Nakfa' },
    FJD: { symbol: '$', name: 'Fijian Dollar' },
    GEL: { symbol: '₾', name: 'Georgian Lari' },
    GIP: { symbol: '£', name: 'Gibraltar Pound' },
    GMD: { symbol: 'D', name: 'Gambian Dalasi' },
    GNF: { symbol: 'FG', name: 'Guinean Franc' },
    GTQ: { symbol: 'Q', name: 'Guatemalan Quetzal' },
    GYD: { symbol: '$', name: 'Guyanese Dollar' },
    HNL: { symbol: 'L', name: 'Honduran Lempira' },
    HRK: { symbol: 'kn', name: 'Croatian Kuna' },
    HTG: { symbol: 'G', name: 'Haitian Gourde' },
    IQD: { symbol: 'ع.د', name: 'Iraqi Dinar' },
    IRR: { symbol: '﷼', name: 'Iranian Rial' },
    ISK: { symbol: 'kr', name: 'Icelandic Króna' },
    JMD: { symbol: 'J$', name: 'Jamaican Dollar' },
    KGS: { symbol: 'лв', name: 'Kyrgyzstani Som' },
    KHR: { symbol: '៛', name: 'Cambodian Riel' },
    KMF: { symbol: 'CF', name: 'Comorian Franc' },
    LAK: { symbol: '₭', name: 'Lao Kip' },
    MDL: { symbol: 'L', name: 'Moldovan Leu' },
    MGA: { symbol: 'Ar', name: 'Malagasy Ariary' },
    MKD: { symbol: 'ден', name: 'Macedonian Denar' },
    MMK: { symbol: 'K', name: 'Myanmar Kyat' },
    MNT: { symbol: '₮', name: 'Mongolian Tugrik' },
    MOP: { symbol: 'MOP$', name: 'Macanese Pataca' },
    MRU: { symbol: 'UM', name: 'Mauritanian Ouguiya' },
    MUR: { symbol: '₨', name: 'Mauritian Rupee' },
    MVR: { symbol: '.ރ', name: 'Maldivian Rufiyaa' },
    NPR: { symbol: '₨', name: 'Nepalese Rupee' },
    NIO: { symbol: 'C$', name: 'Nicaraguan Córdoba' },
    NZD: { symbol: '$', name: 'New Zealand Dollar' },
    PEN: { symbol: 'S/', name: 'Peruvian Sol' },
    PGK: { symbol: 'K', name: 'Papua New Guinean Kina' },
    PYG: { symbol: 'Gs', name: 'Paraguayan Guaraní' },
    RON: { symbol: 'lei', name: 'Romanian Leu' },
    RSD: { symbol: 'Дин.', name: 'Serbian Dinar' },
    SBD: { symbol: '$', name: 'Solomon Islands Dollar' },
    SCR: { symbol: '₨', name: 'Seychellois Rupee' },
    SDG: { symbol: 'ج.س.', name: 'Sudanese Pound' },
    SHP: { symbol: '£', name: 'Saint Helena Pound' },
    SLE: { symbol: 'Le', name: 'Sierra Leonean Leone' },
    SOS: { symbol: 'S', name: 'Somali Shilling' },
    SRD: { symbol: '$', name: 'Surinamese Dollar' },
    STN: { symbol: 'Db', name: 'São Tomé and Príncipe Dobra' },
    SYP: { symbol: '£', name: 'Syrian Pound' },
    TOP: { symbol: 'T$', name: 'Tongan Paʻanga' },
    TTD: { symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
    TVD: { symbol: '$', name: 'Tuvaluan Dollar' },
    TWD: { symbol: 'NT$', name: 'Taiwan Dollar' },
    UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
    UYU: { symbol: '$U', name: 'Uruguayan Peso' },
    UZS: { symbol: 'лв', name: 'Uzbekistani Som' },
    VES: { symbol: 'Bs', name: 'Venezuelan Bolívar' },
    VUV: { symbol: 'VT', name: 'Vanuatu Vatu' },
    WST: { symbol: 'WS$', name: 'Samoan Tala' },
    XAF: { symbol: 'FCFA', name: 'Central African CFA Franc' },
    XCD: { symbol: '$', name: 'East Caribbean Dollar' },
    XOF: { symbol: 'CFA', name: 'West African CFA Franc' },
    XPF: { symbol: '₣', name: 'CFP Franc' },
    YER: { symbol: '﷼', name: 'Yemeni Rial' },
    ZWL: { symbol: 'Z$', name: 'Zimbabwean Dollar' }
  };

  useEffect(() => {
    const savedIncome = localStorage.getItem('budgetTracker_income');
    const savedExpenses = localStorage.getItem('budgetTracker_expenses');
    
    if (savedIncome) {
      setMonthlyIncome(parseFloat(savedIncome));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetTracker_income', monthlyIncome.toString());
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addCategory = useCallback(() => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => [...prev, newCategory.trim()]);
    setNewCategory('');
    toast({
      title: "Success",
      description: "Category added successfully!",
    });
  }, [newCategory, categories]);

  const removeCategory = useCallback((categoryToRemove: string) => {
    if (categories.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one category",
        variant: "destructive"
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
    toast({
      title: "Removed",
      description: "Category removed successfully",
    });
  }, [categories]);

  const addExpense = useCallback(() => {
    if (!newExpense.category || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description || "No description",
      date: new Date().toLocaleDateString()
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({ category: "", amount: "", description: "" });
    
    toast({
      title: "Success",
      description: "Expense added successfully!",
    });
  }, [newExpense]);

  const removeExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Removed",
      description: "Expense removed successfully",
    });
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyIncome - totalExpenses;
  const budgetPercentage = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;
  const currencySymbol = currencies[selectedCurrency as keyof typeof currencies]?.symbol || '$';

  return (
    <ToolPageTemplate
      title="Monthly Budget Tracker"
      description="Track your monthly income and expenses with detailed analytics and custom categories"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currencies).map(([code, currency]) => (
                        <SelectItem key={code} value={code}>
                          {currency.symbol} {code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Enter your monthly income</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={monthlyIncome || ""}
                    onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button onClick={addCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{category}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCategory(category)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Expense
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Amount ({currencySymbol})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Description (Optional)</Label>
                  <Input
                    placeholder="Brief description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button onClick={addExpense} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="font-semibold text-green-600">${monthlyIncome.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="font-semibold text-red-600">${totalExpenses.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium">Remaining Budget</span>
                <span className={`font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Used</span>
                  <span>{budgetPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budgetPercentage > 100 ? 'bg-red-500' : budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.slice().reverse().map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{expense.category}</div>
                        <div className="text-sm text-muted-foreground">{expense.description}</div>
                        <div className="text-xs text-muted-foreground">{expense.date}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeExpense(expense.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No expenses recorded yet. Add your first expense to get started!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default BudgetTracker;
