
import React, { useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, RotateCcw, DollarSign, Calendar, Percent } from "lucide-react";
import SEO from "@/components/SEO";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentBreakdown: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [result, setResult] = useState<LoanResult | null>(null);
  
  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const years = parseFloat(loanTerm);
    
    if (!principal || !annualRate || !years || principal <= 0 || annualRate < 0 || years <= 0) {
      return;
    }
    
    const monthlyRate = annualRate / 12;
    const numberOfPayments = years * 12;
    
    // Calculate monthly payment using loan formula
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    // Generate payment breakdown for first 12 months
    const paymentBreakdown = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= Math.min(12, numberOfPayments); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      paymentBreakdown.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      });
    }
    
    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentBreakdown
    });
  };
  
  const reset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setResult(null);
  };
  
  // Auto-calculate when values change
  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      calculateLoan();
    }
  }, [loanAmount, interestRate, loanTerm]);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <>
      <SEO
        title="Loan Calculator - Calculate Monthly Payments Online Free | Klipza"
        description="Calculate loan payments, total interest, and payment schedules. Perfect for mortgages, car loans, and personal loans."
        keywords="loan calculator, mortgage calculator, payment calculator, interest calculator"
        canonicalUrl="https://klipza.live/tools/loan-calculator"
      />
      
      <ToolPageTemplate
        title="Loan Calculator"
        description="Calculate monthly payments and total interest for any loan"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Loan Details
              </CardTitle>
              <CardDescription>
                Enter your loan information to calculate monthly payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Loan Amount ($)
                  </Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="4.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loanTerm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Loan Term (years)
                  </Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    placeholder="30"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={calculateLoan} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Payment
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(result.monthlyPayment)}
                      </div>
                      <p className="text-xs text-muted-foreground">Monthly Payment</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(result.totalPayment)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Payment</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(result.totalInterest)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Interest</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Breakdown (First 12 Months)</CardTitle>
                  <CardDescription>
                    Monthly breakdown of principal and interest payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Payment</th>
                          <th className="text-right p-2">Principal</th>
                          <th className="text-right p-2">Interest</th>
                          <th className="text-right p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.paymentBreakdown.map((payment) => (
                          <tr key={payment.month} className="border-b">
                            <td className="p-2 font-medium">{payment.month}</td>
                            <td className="p-2 text-right">{formatCurrency(payment.payment)}</td>
                            <td className="p-2 text-right text-green-600">{formatCurrency(payment.principal)}</td>
                            <td className="p-2 text-right text-red-600">{formatCurrency(payment.interest)}</td>
                            <td className="p-2 text-right">{formatCurrency(payment.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(loanAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span className="font-medium">{interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Term:</span>
                    <span className="font-medium">{loanTerm} years ({parseFloat(loanTerm) * 12} payments)</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Monthly Payment:</span>
                    <span>{formatCurrency(result.monthlyPayment)}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Getting Better Loan Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Improve your credit score:</strong> Higher credit scores typically qualify for lower interest rates.</p>
              <p>• <strong>Save for a larger down payment:</strong> More money down means a smaller loan amount and potentially better rates.</p>
              <p>• <strong>Shop around:</strong> Different lenders offer different rates and terms.</p>
              <p>• <strong>Consider shorter terms:</strong> Shorter loan terms usually have lower interest rates but higher monthly payments.</p>
              <p>• <strong>Pay down existing debt:</strong> Lower debt-to-income ratio can help you qualify for better terms.</p>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default LoanCalculator;
