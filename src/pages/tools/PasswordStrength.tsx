
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Eye, EyeOff } from "lucide-react";
import SEO from "@/components/SEO";

const PasswordStrength = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  const checkStrength = (pwd: string) => {
    let score = 0;
    const checks = [];

    if (pwd.length >= 8) {
      score += 1;
    } else {
      checks.push("Use at least 8 characters");
    }

    if (/[a-z]/.test(pwd)) {
      score += 1;
    } else {
      checks.push("Include lowercase letters");
    }

    if (/[A-Z]/.test(pwd)) {
      score += 1;
    } else {
      checks.push("Include uppercase letters");
    }

    if (/[0-9]/.test(pwd)) {
      score += 1;
    } else {
      checks.push("Include numbers");
    }

    if (/[^A-Za-z0-9]/.test(pwd)) {
      score += 1;
    } else {
      checks.push("Include special characters");
    }

    if (pwd.length >= 12) {
      score += 1;
    }

    setStrength(Math.min((score / 6) * 100, 100));
    setFeedback(checks);
  };

  useEffect(() => {
    checkStrength(password);
  }, [password]);

  const getStrengthLabel = () => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <>
      <SEO
        title="Password Strength Checker - Test Password Security Online"
        description="Check your password strength and get security recommendations. Free online password strength analyzer with detailed feedback."
        keywords="password strength, password checker, password security, strong password, password analyzer"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Password Strength Checker
            </h1>
            <p className="text-lg text-gray-600">
              Test your password strength and get recommendations for better security
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Enter Your Password
                </CardTitle>
                <CardDescription>
                  Your password is never stored or transmitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password to check strength..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {password && (
              <Card>
                <CardHeader>
                  <CardTitle>Password Strength Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strength: {getStrengthLabel()}</span>
                      <span>{Math.round(strength)}%</span>
                    </div>
                    <Progress value={strength} className="w-full" />
                  </div>

                  {feedback.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommendations:</h4>
                      <ul className="text-sm space-y-1">
                        {feedback.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-4">
                    Password length: {password.length} characters
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Password Security Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">🔒 Strong Password Guidelines</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Use at least 12 characters</li>
                      <li>• Mix uppercase and lowercase letters</li>
                      <li>• Include numbers and special characters</li>
                      <li>• Avoid dictionary words and personal info</li>
                      <li>• Use unique passwords for each account</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordStrength;
