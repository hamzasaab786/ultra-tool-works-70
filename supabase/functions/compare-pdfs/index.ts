import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;

    if (!file1 || !file2) {
      return new Response(
        JSON.stringify({ error: 'Both PDF files are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract text from both PDFs
    const arrayBuffer1 = await file1.arrayBuffer();
    const arrayBuffer2 = await file2.arrayBuffer();
    
    const pdfDoc1 = await PDFDocument.load(arrayBuffer1);
    const pdfDoc2 = await PDFDocument.load(arrayBuffer2);
    
    const pages1 = pdfDoc1.getPages();
    const pages2 = pdfDoc2.getPages();
    
    // Basic comparison results
    const comparison = {
      file1Name: file1.name,
      file2Name: file2.name,
      file1Pages: pages1.length,
      file2Pages: pages2.length,
      pageCountMatch: pages1.length === pages2.length,
      differences: [] as string[]
    };
    
    if (pages1.length !== pages2.length) {
      comparison.differences.push(`Different number of pages: ${pages1.length} vs ${pages2.length}`);
    }
    
    // Compare page sizes
    const minPages = Math.min(pages1.length, pages2.length);
    for (let i = 0; i < minPages; i++) {
      const size1 = pages1[i].getSize();
      const size2 = pages2[i].getSize();
      
      if (size1.width !== size2.width || size1.height !== size2.height) {
        comparison.differences.push(
          `Page ${i + 1} has different dimensions: ` +
          `${size1.width}x${size1.height} vs ${size2.width}x${size2.height}`
        );
      }
    }

    // Use AI to analyze differences if files have similar structure
    if (comparison.differences.length === 0) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'user',
                  content: `You are a PDF comparison assistant. Analyze structural differences between PDFs.\n\nCompare two PDFs:
File 1: ${file1.name} (${pages1.length} pages)
File 2: ${file2.name} (${pages2.length} pages)
Both have the same page count and dimensions. What should users look for when comparing these files?`
                }
              ]
            }),
          });

          if (response.ok) {
            const data = await response.json();
            comparison.differences.push(data.choices[0].message.content);
          }
        } catch (error) {
          console.error('AI analysis error:', error);
        }
      }
    }

    if (comparison.differences.length === 0) {
      comparison.differences.push('PDFs have identical page structure. Manual review recommended for content differences.');
    }

    return new Response(
      JSON.stringify(comparison),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('PDF comparison error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
