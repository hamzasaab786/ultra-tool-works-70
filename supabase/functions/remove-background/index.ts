import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'RAPIDAPI_KEY not configured on the server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const incoming = await req.formData();
    const image = incoming.get('image');
    const bgcolor = (incoming.get('bgcolor') as string) || '(255,255,255,0)';
    if (!(image instanceof File)) {
      return new Response(JSON.stringify({ error: 'image file required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (image.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image exceeds 10MB' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const forward = new FormData();
    forward.append('image', image, 'image.jpg');
    forward.append('bgcolor', bgcolor);

    const upstream = await fetch('https://ai-background-remover.p.rapidapi.com/image/color/v1', {
      method: 'POST',
      headers: {
        'x-rapidapi-host': 'ai-background-remover.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
      body: forward,
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: 'Upstream failed', status: upstream.status, detail: text.slice(0, 300) }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const buf = await upstream.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': upstream.headers.get('content-type') || 'image/png' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
