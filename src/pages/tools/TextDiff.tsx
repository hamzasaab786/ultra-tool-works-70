
import React, { useState, useMemo } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RotateCcw, Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  const [showUnchanged, setShowUnchanged] = useState(false);
  
  const diffResult = useMemo((): DiffResult | null => {
    if (!text1.trim() && !text2.trim()) {
      return null;
    }
    
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const added: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];
    
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
    
    return {
      added,
      removed,
      unchanged,
      addedCount: added.length,
      removedCount: removed.length,
      changedLines: added.length + removed.length
    };
  }, [text1, text2]);
  
  const reset = () => {
    setText1("");
    setText2("");
    setShowUnchanged(false);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadReport = () => {
    if (!diffResult) return;
    
    const report = `Text Difference Report
Generated: ${new Date().toLocaleString()}

SUMMARY:
- Lines Added: ${diffResult.addedCount}
- Lines Removed: ${diffResult.removedCount}
- Total Changes: ${diffResult.changedLines}
- Unchanged Lines: ${diffResult.unchanged.length}

ADDED LINES:
${diffResult.added.map(line => `+ ${line}`).join('\n')}

REMOVED LINES:
${diffResult.removed.map(line => `- ${line}`).join('\n')}

UNCHANGED LINES:
${diffResult.unchanged.map(line => `  ${line}`).join('\n')}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `text-diff-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Difference report saved successfully",
    });
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="text1" className="text-sm font-medium">Original Text</Label>
              <Textarea
                id="text1"
                placeholder="Enter the original text here..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="min-h-[200px] font-mono text-sm resize-y"
              />
              <p className="text-xs text-gray-500">{text1.split('\n').length} lines</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text2" className="text-sm font-medium">Modified Text</Label>
              <Textarea
                id="text2"
                placeholder="Enter the modified text here..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="min-h-[200px] font-mono text-sm resize-y"
              />
              <p className="text-xs text-gray-500">{text2.split('\n').length} lines</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => {}} 
              className="flex-1 min-w-[200px]" 
              disabled={!text1.trim() && !text2.trim()}
            >
              <FileText className="mr-2 h-4 w-4" />
              Compare Texts
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            {diffResult && (
              <Button variant="outline" onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            )}
          </div>
          
          {diffResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{diffResult.addedCount}</div>
                    <p className="text-xs text-muted-foreground">Lines Added</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">{diffResult.removedCount}</div>
                    <p className="text-xs text-muted-foreground">Lines Removed</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">{diffResult.changedLines}</div>
                    <p className="text-xs text-muted-foreground">Total Changes</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {diffResult.addedCount > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            + Added ({diffResult.addedCount})
                          </Badge>
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(diffResult.added.join('\n'), 'Added lines')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 font-mono text-sm max-h-64 overflow-y-auto">
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
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            - Removed ({diffResult.removedCount})
                          </Badge>
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(diffResult.removed.join('\n'), 'Removed lines')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 font-mono text-sm max-h-64 overflow-y-auto">
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
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          Unchanged ({diffResult.unchanged.length})
                        </Badge>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowUnchanged(!showUnchanged)}
                        >
                          {showUnchanged ? 'Hide' : 'Show'}
                        </Button>
                        {showUnchanged && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(diffResult.unchanged.join('\n'), 'Unchanged lines')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {showUnchanged && (
                    <CardContent>
                      <div className="space-y-1 font-mono text-sm max-h-48 overflow-y-auto">
                        {diffResult.unchanged.map((line, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded">
                            {line || '<empty line>'}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
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
