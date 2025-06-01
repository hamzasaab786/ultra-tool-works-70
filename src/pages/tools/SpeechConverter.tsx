
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, ArrowRight, Copy, RotateCcw, BookOpen } from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';

interface ConversionExample {
  direct: string;
  indirect: string;
}

const SpeechConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [conversionType, setConversionType] = useState<'direct-to-indirect' | 'indirect-to-direct'>('direct-to-indirect');
  const [isConverting, setIsConverting] = useState(false);

  const examples: ConversionExample[] = [
    {
      direct: 'He said, "I am going to the market."',
      indirect: 'He said that he was going to the market.'
    },
    {
      direct: 'She asked, "Where are you going?"',
      indirect: 'She asked where I was going.'
    },
    {
      direct: 'They said, "We will come tomorrow."',
      indirect: 'They said that they would come the next day.'
    },
    {
      direct: 'He exclaimed, "What a beautiful day it is!"',
      indirect: 'He exclaimed that it was a very beautiful day.'
    }
  ];

  const convertDirectToIndirect = (text: string): string => {
    let result = text;

    // Handle reporting verbs
    const reportingVerbs = ['said', 'told', 'asked', 'replied', 'exclaimed', 'shouted', 'whispered', 'declared', 'announced'];
    
    // Convert direct speech patterns
    const directSpeechPatterns = [
      // Pattern: He said, "I am..."
      {
        pattern: /(\w+)\s+(said|told|asked|replied|exclaimed|shouted|whispered|declared|announced),?\s*["']([^"']+)["']/gi,
        replacement: (match: string, subject: string, verb: string, speech: string) => {
          let convertedSpeech = speech;
          
          // Convert pronouns
          convertedSpeech = convertedSpeech.replace(/\bI\b/g, 'he/she');
          convertedSpeech = convertedSpeech.replace(/\bme\b/g, 'him/her');
          convertedSpeech = convertedSpeech.replace(/\bmy\b/g, 'his/her');
          convertedSpeech = convertedSpeech.replace(/\bmine\b/g, 'his/hers');
          convertedSpeech = convertedSpeech.replace(/\byou\b/g, 'I');
          convertedSpeech = convertedSpeech.replace(/\byour\b/g, 'my');
          convertedSpeech = convertedSpeech.replace(/\byours\b/g, 'mine');
          
          // Convert tenses
          convertedSpeech = convertedSpeech.replace(/\bam\b/g, 'was');
          convertedSpeech = convertedSpeech.replace(/\bis\b/g, 'was');
          convertedSpeech = convertedSpeech.replace(/\bare\b/g, 'were');
          convertedSpeech = convertedSpeech.replace(/\bwill\b/g, 'would');
          convertedSpeech = convertedSpeech.replace(/\bcan\b/g, 'could');
          convertedSpeech = convertedSpeech.replace(/\bmay\b/g, 'might');
          
          // Convert time expressions
          convertedSpeech = convertedSpeech.replace(/\btoday\b/g, 'that day');
          convertedSpeech = convertedSpeech.replace(/\btomorrow\b/g, 'the next day');
          convertedSpeech = convertedSpeech.replace(/\byesterday\b/g, 'the previous day');
          convertedSpeech = convertedSpeech.replace(/\bnow\b/g, 'then');
          convertedSpeech = convertedSpeech.replace(/\bhere\b/g, 'there');
          convertedSpeech = convertedSpeech.replace(/\bthis\b/g, 'that');
          convertedSpeech = convertedSpeech.replace(/\bthese\b/g, 'those');
          
          // Handle questions
          if (verb.toLowerCase() === 'asked' || speech.includes('?')) {
            convertedSpeech = convertedSpeech.replace(/\?/g, '');
            return `${subject} ${verb} ${convertedSpeech}`;
          }
          
          // Handle exclamations
          if (verb.toLowerCase() === 'exclaimed' || speech.includes('!')) {
            convertedSpeech = convertedSpeech.replace(/!/g, '');
            return `${subject} ${verb} that ${convertedSpeech}`;
          }
          
          return `${subject} ${verb} that ${convertedSpeech}`;
        }
      }
    ];

    directSpeechPatterns.forEach(({ pattern, replacement }) => {
      result = result.replace(pattern, replacement as any);
    });

    return result;
  };

  const convertIndirectToDirect = (text: string): string => {
    let result = text;

    // Convert indirect speech patterns back to direct
    const indirectSpeechPatterns = [
      // Pattern: He said that he was...
      {
        pattern: /(\w+)\s+(said|told|asked|replied|exclaimed|shouted|whispered|declared|announced)\s+that\s+([^.!?]+)/gi,
        replacement: (match: string, subject: string, verb: string, speech: string) => {
          let convertedSpeech = speech;
          
          // Convert pronouns back
          convertedSpeech = convertedSpeech.replace(/\bhe\/she\b/g, 'I');
          convertedSpeech = convertedSpeech.replace(/\bhim\/her\b/g, 'me');
          convertedSpeech = convertedSpeech.replace(/\bhis\/her\b/g, 'my');
          convertedSpeech = convertedSpeech.replace(/\bhis\/hers\b/g, 'mine');
          
          // Convert tenses back
          convertedSpeech = convertedSpeech.replace(/\bwas\b/g, 'am');
          convertedSpeech = convertedSpeech.replace(/\bwere\b/g, 'are');
          convertedSpeech = convertedSpeech.replace(/\bwould\b/g, 'will');
          convertedSpeech = convertedSpeech.replace(/\bcould\b/g, 'can');
          convertedSpeech = convertedSpeech.replace(/\bmight\b/g, 'may');
          
          // Convert time expressions back
          convertedSpeech = convertedSpeech.replace(/\bthat day\b/g, 'today');
          convertedSpeech = convertedSpeech.replace(/\bthe next day\b/g, 'tomorrow');
          convertedSpeech = convertedSpeech.replace(/\bthe previous day\b/g, 'yesterday');
          convertedSpeech = convertedSpeech.replace(/\bthen\b/g, 'now');
          convertedSpeech = convertedSpeech.replace(/\bthere\b/g, 'here');
          convertedSpeech = convertedSpeech.replace(/\bthat\b/g, 'this');
          convertedSpeech = convertedSpeech.replace(/\bthose\b/g, 'these');
          
          return `${subject} ${verb}, "${convertedSpeech}."`;
        }
      }
    ];

    indirectSpeechPatterns.forEach(({ pattern, replacement }) => {
      result = result.replace(pattern, replacement as any);
    });

    return result;
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please enter some text to convert',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    
    setTimeout(() => {
      let result = '';
      
      if (conversionType === 'direct-to-indirect') {
        result = convertDirectToIndirect(inputText);
      } else {
        result = convertIndirectToDirect(inputText);
      }
      
      setOutputText(result);
      setIsConverting(false);
      
      toast({
        title: 'Conversion completed',
        description: 'Speech has been successfully converted',
      });
    }, 1000);
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: 'Copied to clipboard',
        description: 'The converted text has been copied to your clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the text manually',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  const loadExample = (example: ConversionExample) => {
    if (conversionType === 'direct-to-indirect') {
      setInputText(example.direct);
      setOutputText('');
    } else {
      setInputText(example.indirect);
      setOutputText('');
    }
  };

  return (
    <ToolPageTemplate
      title="Direct to Indirect Speech Converter"
      description="Convert between direct and indirect speech easily with our advanced converter tool"
      keywords="direct speech, indirect speech, reported speech, grammar converter, speech conversion"
    >
      <div className="space-y-6">
        {/* Conversion Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversion Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={conversionType}
              onValueChange={(value: 'direct-to-indirect' | 'indirect-to-direct') => {
                setConversionType(value);
                setInputText('');
                setOutputText('');
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct-to-indirect">Direct to Indirect Speech</SelectItem>
                <SelectItem value="indirect-to-direct">Indirect to Direct Speech</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              {conversionType === 'direct-to-indirect' ? 'Direct Speech' : 'Indirect Speech'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder={
                  conversionType === 'direct-to-indirect'
                    ? 'Enter direct speech here... e.g., He said, "I am going to school."'
                    : 'Enter indirect speech here... e.g., He said that he was going to school.'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32"
              />
              
              <div className="flex gap-2">
                <Button onClick={handleConvert} disabled={isConverting || !inputText.trim()}>
                  {isConverting ? (
                    <>Converting...</>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Convert
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        {outputText && (
          <Card>
            <CardHeader>
              <CardTitle>
                {conversionType === 'direct-to-indirect' ? 'Indirect Speech' : 'Direct Speech'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={outputText}
                  readOnly
                  className="min-h-32 bg-gray-50"
                />
                
                <Button onClick={handleCopyOutput} variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2">Direct Speech</Badge>
                      <p className="text-sm">{example.direct}</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Indirect Speech</Badge>
                      <p className="text-sm">{example.indirect}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => loadExample(example)}
                      className="mt-2"
                    >
                      Try this example
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Direct to Indirect Speech:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Remove quotation marks and add 'that'</li>
                  <li>Change pronouns (I → he/she, you → I, etc.)</li>
                  <li>Change tenses (present → past, will → would, etc.)</li>
                  <li>Change time expressions (today → that day, tomorrow → next day)</li>
                  <li>Change place expressions (here → there, this → that)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Indirect to Direct Speech:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Add quotation marks and remove 'that'</li>
                  <li>Reverse pronoun changes</li>
                  <li>Reverse tense changes</li>
                  <li>Reverse time and place expression changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default SpeechConverter;
