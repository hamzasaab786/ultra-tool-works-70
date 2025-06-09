
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import SEO from "@/components/SEO";

const CreditCardValidator = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [cardType, setCardType] = useState("");
  const { toast } = useToast();

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cleanNumber)) return "JCB";
    
    return "Unknown";
  };

  const luhnCheck = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let alternate = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  };

  const validateCard = () => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!cleanNumber) {
      toast({
        title: "Card number required",
        description: "Please enter a credit card number to validate.",
        variant: "destructive",
      });
      return;
    }

    const type = detectCardType(cleanNumber);
    const valid = luhnCheck(cleanNumber) && cleanNumber.length >= 13 && cleanNumber.length <= 19;
    
    setCardType(type);
    setIsValid(valid);
    
    toast({
      title: valid ? "Valid card number" : "Invalid card number",
      description: valid 
        ? `This appears to be a valid ${type} card number.`
        : "The card number format is incorrect.",
      variant: valid ? "default" : "destructive",
    });
  };

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    const formatted = cleanValue.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  return (
    <>
      <SEO
        title="Credit Card Validator - Validate Card Numbers Online Free"
        description="Validate credit card numbers using Luhn algorithm. Check Visa, Mastercard, American Express, and other card formats for free."
        keywords="credit card validator, card number checker, Luhn algorithm, validate credit card, card verification"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Credit Card Validator
            </h1>
            <p className="text-lg text-gray-600">
              Validate credit card numbers using the Luhn algorithm and detect card types
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Card Number
                </CardTitle>
                <CardDescription>
                  Enter a credit card number to validate its format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => formatCardNumber(e.target.value)}
                    className="font-mono text-lg"
                    maxLength={23} // 16 digits + 3 spaces
                  />
                  
                  <Button onClick={validateCard} disabled={!cardNumber.trim()}>
                    Validate Card Number
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isValid !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Validation Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Card Type:</span>
                      <span className="font-medium">{cardType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="font-medium">{cardNumber.replace(/\s/g, '').length} digits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Supported Card Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">💳 Visa</h4>
                    <p className="text-sm text-gray-600">Starts with 4, 13-19 digits</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">💳 Mastercard</h4>
                    <p className="text-sm text-gray-600">Starts with 51-55, 16 digits</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">💳 American Express</h4>
                    <p className="text-sm text-gray-600">Starts with 34 or 37, 15 digits</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">💳 Discover</h4>
                    <p className="text-sm text-gray-600">Starts with 6011 or 65, 16 digits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚠️ Important Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This tool only validates the format and checksum of credit card numbers using the Luhn algorithm. 
                  It does not verify if the card is active, has sufficient funds, or belongs to a real account. 
                  Never enter real credit card information on untrusted websites.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditCardValidator;
