
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";

interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
  addedCount: number;
  removedCount: number;
  changedLines: number;
}

const TextDiff = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  
  const calculateDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      return;
    }
    
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const added: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];
    
    // Simple diff algorithm
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        unchanged.push(line1);
      } else {
        if (line1 && !line2) {
          removed.push(line1);
        } else if (!line1 && line2) {
          added.push(line2);
        } else if (line1 !== line2) {
          if (line1) removed.push(line1);
          if (line2) added.push(line2);
        }
      }
    }
    
    setDiffResult({
      added,
      removed,
      unchanged,
      addedCount: added.length,
      removedCount: removed.length,
      changedLines: added.length + removed.length
    });
  };
  
  const reset = () => {
    setText1("");
    setText2("");
    setDiffResult(null);
  };
  
  return (
    <>
      <SEO
        title="Text Diff Checker - Compare Two Texts Online Free | ToolifyConvert"
        description="Compare two texts and highlight differences online for free. Find added, removed, and changed lines instantly."
        keywords="text diff, text compare, difference checker, text comparison tool"
        canonicalUrl="https://toolifyconvert.com/tools/text-diff"
      />
      
      <ToolPageTemplate
        title="Text Diff Checker"
        description="Compare two texts and find differences between them"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="text1">Original Text</Label>
              <Textarea
                id="text1"
                placeholder="Enter the original text here..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text2">Modified Text</Label>
              <Textarea
                id="text2"
                placeholder="Enter the modified text here..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={calculateDiff} className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Compare Texts
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {diffResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{diffResult.addedCount}</div>
                    <p className="text-xs text-muted-foreground">Lines Added</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">{diffResult.removedCount}</div>
                    <p className="text-xs text-muted-foreground">Lines Removed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">{diffResult.changedLines}</div>
                    <p className="text-xs text-muted-foreground">Total Changes</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {diffResult.addedCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          + Added Lines
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 font-mono text-sm">
                        {diffResult.added.map((line, index) => (
                          <div key={index} className="bg-green-50 p-2 rounded border-l-4 border-green-500">
                            + {line || '<empty line>'}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {diffResult.removedCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          - Removed Lines
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 font-mono text-sm">
                        {diffResult.removed.map((line, index) => (
                          <div key={index} className="bg-red-50 p-2 rounded border-l-4 border-red-500">
                            - {line || '<empty line>'}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {diffResult.unchanged.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Unchanged Lines ({diffResult.unchanged.length})
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 font-mono text-sm max-h-48 overflow-y-auto">
                      {diffResult.unchanged.map((line, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          {line || '<empty line>'}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default TextDiff;
