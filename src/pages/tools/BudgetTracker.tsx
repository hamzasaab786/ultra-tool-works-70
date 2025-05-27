
import React, { useState, useCallback, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: ""
  });

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other"
  ];

  // Load data from localStorage on component mount
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

  // Save data to localStorage whenever income or expenses change
  useEffect(() => {
    localStorage.setItem('budgetTracker_income', monthlyIncome.toString());
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('budgetTracker_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

  const clearAllData = useCallback(() => {
    setMonthlyIncome(0);
    setExpenses([]);
    localStorage.removeItem('budgetTracker_income');
    localStorage.removeItem('budgetTracker_expenses');
    toast({
      title: "Cleared",
      description: "All budget data has been cleared",
    });
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyIncome - totalExpenses;
  const budgetPercentage = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter(item => item.total > 0);

  return (
    <ToolPageTemplate
      title="Monthly Budget Tracker"
      description="Track your monthly income and expenses with detailed analytics - Personal finance tool for budget planning, expense tracking, and financial management with visual charts and reports."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            💰 Track your monthly income and expenses to stay on top of your finances. Add expenses by category and monitor your spending patterns with detailed analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income & Add Expense Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                  <Label>Amount</Label>
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

          {/* Budget Overview */}
          <div className="space-y-6">
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
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expensesByCategory.length > 0 ? (
                  <div className="space-y-3">
                    {expensesByCategory.map(item => (
                      <div key={item.category} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.count} items)</span>
                        </div>
                        <span className="font-semibold">${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No expenses recorded yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Expenses */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Expenses</CardTitle>
                {expenses.length > 0 && (
                  <Button onClick={clearAllData} variant="outline" size="sm">
                    Clear All
                  </Button>
                )}
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
      </div>
    </ToolPageTemplate>
  );
};

export default BudgetTracker;
