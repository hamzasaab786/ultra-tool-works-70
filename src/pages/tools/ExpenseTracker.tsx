
import React, { useState, useEffect } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('expense-tracker-data');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved expenses:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expense-tracker-data', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount || !description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [newExpense, ...prev]);
    setAmount('');
    setDescription('');
    setCategory('');

    toast({
      title: type === 'income' ? "Income Added" : "Expense Added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of $${amount} added successfully`
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Deleted",
      description: "Entry has been removed"
    });
  };

  const getTotalIncome = () => {
    return expenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalExpenses = () => {
    return expenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    expenses
      .filter(e => e.type === 'expense')
      .forEach(expense => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      });
    return Object.entries(totals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  return (
    <ToolPageTemplate
      title="Expense Tracker"
      description="Track your income and expenses, manage your budget, and monitor your spending habits"
      keywords="expense tracker, budget tracker, income expenses, money management"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${getTotalIncome().toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${getTotalExpenses().toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${getBalance().toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={addExpense} className="w-full">
                Add Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        {expenses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Top Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getCategoryTotals().map(([category, total]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No transactions yet. Add your first income or expense above.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          expense.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {expense.type}
                        </span>
                        <span className="font-medium">{expense.description}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.category} • {expense.date}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${
                        expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                      </span>
                      
                      <Button
                        onClick={() => deleteExpense(expense.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Add your income and expenses using the form above</li>
              <li>Choose between "Income" or "Expense" type</li>
              <li>Enter the amount, description, and select a category</li>
              <li>View your balance and spending breakdown in real-time</li>
              <li>All data is saved locally in your browser</li>
              <li>Delete entries by clicking the trash icon</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExpenseTracker;
