# Klipza — Free Online Tools

131 free online tools in one place: PDF tools, image tools, calculators, text tools and everyday utilities. No sign-up, no watermarks — open a tool and use it.

## What you get

- **131 tools** across 5 categories:
  - **PDF** — Merge, Split, Compress, Watermark, Add Page Numbers, Extract Text (OCR), PDF to JPG/Word/Excel, Unlock, Redact and more
  - **Image** — Compressor, Resizer, Format Converter, Crop, Watermark, Image to Text (OCR), Metadata Extractor and more
  - **Calculators** — BMI, Age, Calorie, Compound Interest, Fuel Cost, GPA, Currency Converter, Discount and more
  - **Text** — Case Converter, Word Counter, Base64, Hash Generator, QR & Barcode Generator, Emoji Picker and more
  - **Utilities** — File Hash Checker, DNS Lookup, Cron Expression Generator, Credit Card Validator, Unit Converters and more
- **Privacy-first** — tools process your files right in the browser whenever possible; your documents stay on your device
- **Guides blog** — step-by-step how-to articles for every tool
- **SEO-ready** — every tool page is prerendered with its own URL, meta tags and FAQ content
- **Dark mode, mobile-friendly, fast** — built with modern web tech, no page reloads

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Supabase (edge functions power the AI-assisted tools)
- Deployed as a static site (Netlify-ready)

## Run it locally

Requirements: Node.js 18+ and npm.

```sh
# 1. Clone the repo
git clone https://github.com/hamzasaab786/ultra-tool-works-70.git
cd ultra-tool-works-70

# 2. Install dependencies
npm install

# 3. Add your environment variables
cp .env.example .env
# then fill in your Supabase + analytics keys in .env

# 4. Start the dev server
npm run dev
```

Build for production:

```sh
npm run build
```

## Project structure

```
src/
  pages/          # Home, blog, legal pages…
  pages/tools/    # One component per tool (131 tools)
  components/     # Shared UI (layout, nav, cards, dialogs…)
  data/           # Tool catalog, SEO content, blog metadata
  integrations/   # Supabase client
supabase/
  functions/      # Edge functions for AI-assisted tools
scripts/          # Sitemap + blog metadata generators
```

## Contributing

Found a bug or want a new tool? Issues and pull requests are welcome — open one and describe what the tool should do.

## License

MIT — see [LICENSE](LICENSE). Free for personal and commercial use.
