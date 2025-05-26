
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Label } from "@/components/ui/label";
import { AlignLeft, FileText } from "lucide-react";

const WordCounter = () => {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0
  });

  const calculateStats = useCallback((inputText: string) => {
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    
    // Words: split by whitespace and filter out empty strings
    const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    
    // Sentences: count by periods, exclamation marks, question marks
    const sentences = inputText.trim() === '' ? 0 : inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraphs: split by double newlines
    const paragraphs = inputText.trim() === '' ? 0 : inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Lines: split by single newlines
    const lines = inputText === '' ? 0 : inputText.split(/\n/).length;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    };
  }, []);

  React.useEffect(() => {
    setStats(calculateStats(text));
  }, [text, calculateStats]);

  const readingTime = Math.ceil(stats.words / 200); // Average reading speed: 200 words per minute

  return (
    <ToolPageTemplate
      title="Word & Character Counter"
      description="Count words, characters, sentences, and paragraphs in your text"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="text-input" className="mb-2 block">
            Enter your text
          </Label>
          <textarea
            id="text-input"
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-3 py-2 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.characters}</div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </div>
          
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.charactersNoSpaces}</div>
            <div className="text-sm text-muted-foreground">Characters (no spaces)</div>
          </div>
          
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.words}</div>
            <div className="text-sm text-muted-foreground">Words</div>
          </div>
          
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.sentences}</div>
            <div className="text-sm text-muted-foreground">Sentences</div>
          </div>
          
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.paragraphs}</div>
            <div className="text-sm text-muted-foreground">Paragraphs</div>
          </div>
          
          <div className="p-4 border rounded-md text-center">
            <div className="text-2xl font-bold text-primary">{stats.lines}</div>
            <div className="text-sm text-muted-foreground">Lines</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded-md">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 mr-2" />
              <span className="font-medium">Reading Time</span>
            </div>
            <p className="text-sm">
              Approximately <span className="font-semibold">{readingTime} minute{readingTime !== 1 ? 's' : ''}</span> to read
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on average reading speed of 200 words per minute
            </p>
          </div>

          <div className="p-4 bg-primary/5 rounded-md">
            <div className="flex items-center mb-2">
              <AlignLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Text Density</span>
            </div>
            <p className="text-sm">
              Average <span className="font-semibold">{stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words</span> per sentence
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.words / stats.sentences < 15 ? 'Easy to read' : 
               stats.words / stats.sentences < 20 ? 'Moderate complexity' : 
               'Complex text'}
            </p>
          </div>
        </div>

        {text && (
          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">Text Analysis</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Average word length:</span>
                <span className="ml-2 font-medium">
                  {stats.words > 0 ? (stats.charactersNoSpaces / stats.words).toFixed(1) : 0} characters
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Average sentence length:</span>
                <span className="ml-2 font-medium">
                  {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default WordCounter;
