
import React, { useState, useCallback, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface BudgetData {
  income: number;
  expenses: Expense[];
}

const BudgetTracker = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: ""
  });

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Housing",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Travel",
    "Insurance",
    "Savings",
    "Other"
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('budgetTracker');
    if (savedData) {
      try {
        const data: BudgetData = JSON.parse(savedData);
        setMonthlyIncome(data.income || 0);
        setExpenses(data.expenses || []);
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((income: number, expenseList: Expense[]) => {
    const data: BudgetData = {
      income,
      expenses: expenseList
    };
    localStorage.setItem('budgetTracker', JSON.stringify(data));
  }, []);

  // Add new expense
  const addExpense = useCallback(() => {
    if (!newExpense.category || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid amounts",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description || "",
      date: new Date().toISOString().split('T')[0]
    };

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveData(monthlyIncome, updatedExpenses);
    
    setNewExpense({ category: "", amount: "", description: "" });
    
    toast({
      title: "Success",
      description: "Expense added successfully!",
    });
  }, [newExpense, expenses, monthlyIncome, saveData]);

  // Remove expense
  const removeExpense = useCallback((id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveData(monthlyIncome, updatedExpenses);
    
    toast({
      title: "Success",
      description: "Expense removed successfully!",
    });
  }, [expenses, monthlyIncome, saveData]);

  // Update income
  const updateIncome = useCallback((income: number) => {
    setMonthlyIncome(income);
    saveData(income, expenses);
  }, [expenses, saveData]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyIncome - totalExpenses;
  const spentPercentage = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Get category colors
  const getCategoryColor = (index: number): string => {
    const colors = [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
      "#8b5cf6", "#06b6d4", "#84cc16", "#f97316",
      "#ec4899", "#6366f1", "#14b8a6", "#64748b"
    ];
    return colors[index % colors.length];
  };

  // Clear all data
  const clearAllData = useCallback(() => {
    setMonthlyIncome(0);
    setExpenses([]);
    localStorage.removeItem('budgetTracker');
    
    toast({
      title: "Success",
      description: "All budget data cleared!",
    });
  }, []);

  return (
    <ToolPageTemplate
      title="Monthly Budget Tracker"
      description="Smart personal finance management tool - Track your monthly income, expenses, and savings goals. Visual budget analysis with category breakdowns and spending insights. Free budget planner with data persistence."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            💰 Take control of your finances with our comprehensive budget tracker. Set your income, track expenses by category, and visualize your spending patterns.
          </p>
        </div>

        {/* Income Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Enter your monthly income</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={monthlyIncome || ""}
                  onChange={(e) => updateIncome(parseFloat(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={clearAllData}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Budget</p>
                  <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remainingBudget.toFixed(2)}
                  </p>
                </div>
                <DollarSign className={`h-8 w-8 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Progress */}
        {monthlyIncome > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Budget Usage</h3>
                <span className="text-sm text-muted-foreground">
                  {spentPercentage.toFixed(1)}% spent
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-300 ${
                    spentPercentage > 100 ? 'bg-red-500' : 
                    spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Expense */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add New Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Category</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Coffee, Groceries, etc."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense List */}
        {expenses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenses.slice().reverse().map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{expense.category}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{expense.date}</span>
                      </div>
                      {expense.description && (
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExpense(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown */}
        {Object.keys(expensesByCategory).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expensesByCategory)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount], index) => {
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">
                            ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: getCategoryColor(index)
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default BudgetTracker;
