
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Fingerprint, Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PasswordGenerator = () => {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: true
  });

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O'
  };

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (options.uppercase) charset += characters.uppercase;
    if (options.lowercase) charset += characters.lowercase;
    if (options.numbers) charset += characters.numbers;
    if (options.symbols) charset += characters.symbols;
    
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characters.similar.includes(char)).join('');
    }
    
    if (charset === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }
    
    let newPassword = '';
    const randoms = new Uint32Array(length);
    crypto.getRandomValues(randoms);
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(randoms[i] % charset.length);
    }
    
    setPassword(newPassword);
  }, [length, options]);

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password to clipboard.",
        variant: "destructive"
      });
    }
  }, [password]);

  const getPasswordStrength = useCallback((pwd: string) => {
    let score = 0;
    
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (score <= 2) return { strength: 'Weak', color: 'text-red-500', width: '25%' };
    if (score <= 4) return { strength: 'Medium', color: 'text-yellow-500', width: '50%' };
    if (score <= 5) return { strength: 'Strong', color: 'text-green-500', width: '75%' };
    return { strength: 'Very Strong', color: 'text-green-600', width: '100%' };
  }, []);

  const strength = getPasswordStrength(password);

  return (
    <ToolPageTemplate
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Generated Password</Label>
            <div className="relative">
              <Input
                value={password}
                readOnly
                className="pr-20 font-mono text-lg"
                placeholder="Generated password will appear here"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={generatePassword}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {password && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Password Strength:</span>
                <span className={`text-sm font-medium ${strength.color}`}>
                  {strength.strength}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength.strength === 'Weak' ? 'bg-red-500' :
                    strength.strength === 'Medium' ? 'bg-yellow-500' :
                    strength.strength === 'Strong' ? 'bg-green-500' :
                    'bg-green-600'
                  }`}
                  style={{ width: strength.width }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Password Length: {length}</Label>
            <Slider
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              min={4}
              max={128}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="block">Character Types</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={options.uppercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, uppercase: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="uppercase" className="cursor-pointer">
                  Uppercase letters (A-Z)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={options.lowercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, lowercase: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="lowercase" className="cursor-pointer">
                  Lowercase letters (a-z)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={options.numbers}
                  onChange={(e) => setOptions(prev => ({ ...prev, numbers: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="numbers" className="cursor-pointer">
                  Numbers (0-9)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={options.symbols}
                  onChange={(e) => setOptions(prev => ({ ...prev, symbols: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="symbols" className="cursor-pointer">
                  Symbols (!@#$%^&*)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exclude-similar"
                  checked={options.excludeSimilar}
                  onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="exclude-similar" className="cursor-pointer">
                  Exclude similar characters (i, l, 1, L, o, 0, O)
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            <Fingerprint className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </div>

        <div className="p-4 bg-primary/5 rounded-md">
          <h4 className="font-medium mb-2">Password Security Tips</h4>
          <ul className="text-sm space-y-1">
            <li>• Use at least 12 characters for better security</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid using personal information or common words</li>
            <li>• Use a unique password for each account</li>
            <li>• Consider using a password manager to store your passwords</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PasswordGenerator;
