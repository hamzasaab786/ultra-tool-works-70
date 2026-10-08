import type { ToolContentMap } from "./types";

export const chunk7: ToolContentMap = {
  "/tools/yaml-to-json": {
    intro: [
      "The YAML to JSON Converter turns YAML files into valid JSON, and JSON back into clean YAML, while you type. Developers use it for Kubernetes manifests, Docker Compose files, GitHub Actions workflows, OpenAPI specs and app config files. YAML is easy for people to read, but many APIs, scripts and tools only accept JSON. This tool lets you switch between the two formats in one click.",
      "Everything runs in your browser, so private config files, API keys and server settings never leave your computer. If your YAML has a mistake, such as a wrong indent or a missing colon, you get the exact line and column so you can fix it fast. It works as a YAML validator and as a JSON to YAML converter in one place.",
    ],
    steps: [
      "Choose YAML → JSON or JSON → YAML at the top.",
      "Paste your YAML or JSON into the left box.",
      "Read the converted result on the right. It updates as you type.",
      "If an error box appears, fix the line it points to.",
      "Copy the result or download it as a .json or .yaml file.",
    ],
    benefits: [
      { title: "Two-way conversion", body: "Convert YAML to JSON and JSON to YAML with the same tool. The Swap button moves the result back into the input so you can round-trip a file." },
      { title: "Exact error locations", body: "Bad indentation, tabs, duplicate keys and missing quotes are reported with a line and column number, so it doubles as a YAML syntax checker." },
      { title: "Multi-document YAML", body: "Files with several documents separated by --- become a JSON array, one item per document, which is how Kubernetes files with many resources are usually handled." },
    ],
    useCases: [
      "Converting a Kubernetes or Helm values.yaml to JSON for kubectl or an API call.",
      "Turning a docker-compose.yml into JSON to read it in a script.",
      "Changing an OpenAPI or Swagger spec between YAML and JSON.",
      "Checking a GitHub Actions workflow for indentation mistakes before you push.",
      "Converting a JSON API response into readable YAML for documentation.",
    ],
    sections: [
      { heading: "YAML vs JSON: what is the difference?", body: "Both store the same kinds of data: objects (maps), lists, strings, numbers, true/false and null. JSON uses braces, brackets and quotes. YAML uses indentation and dashes, supports comments and is shorter to write. Every JSON file is also valid YAML 1.2, but not every YAML file maps cleanly to JSON — comments, anchors and custom tags have no JSON equivalent." },
      { heading: "What changes during conversion", body: "Keys, values, nesting and list order stay the same. Comments are removed because JSON cannot hold them. Anchors and aliases (& and *) are expanded into full copies. Dates written without quotes become ISO date strings. If you need a value to stay text, such as a version like 1.10, wrap it in quotes in the YAML." },
      { heading: "Common YAML errors and fixes", body: "Tabs: YAML only allows spaces for indentation — replace tabs with spaces. Uneven indent: keep children at the same number of spaces. Missing space after a colon: write key: value, not key:value. Special characters: quote strings that start with *, &, @, ! or contain ': '." },
    ],
  },

  "/tools/slug-generator": {
    intro: [
      "The URL Slug Generator turns any page title, blog headline or product name into a clean, SEO-friendly URL slug. It removes accents, emojis and symbols, puts hyphens between words, converts to lowercase and trims the slug to a sensible length. The result is a permalink that people can read and search engines can understand.",
      "Bloggers, WordPress and Shopify store owners, developers and SEO writers use slugs every day. Paste one title or a whole list — one per line — and get every slug at once. You can choose the separator, remove common stop words and set a maximum length that never cuts a word in half.",
    ],
    steps: [
      "Paste one title per line into the box.",
      "Pick a separator. Hyphen (-) is best for SEO.",
      "Turn on Remove stop words if you want shorter slugs.",
      "Set a maximum length, for example 60 characters.",
      "Copy a single slug or click Copy all.",
    ],
    benefits: [
      { title: "Handles accents and foreign letters", body: "Café becomes cafe, Ünïcödé becomes unicode and ß becomes ss, so your URLs stay plain ASCII and never break when shared." },
      { title: "Smart length limit", body: "When a slug is too long, it is cut at the last full word, so you never get half a word at the end of a URL." },
      { title: "Bulk mode", body: "Create slugs for a whole content calendar or product catalogue in one go instead of one title at a time." },
    ],
    useCases: [
      "Writing permalinks for blog posts in WordPress, Ghost or Webflow.",
      "Creating product URLs for Shopify or WooCommerce stores.",
      "Generating route names or file names in code.",
      "Cleaning up long auto-generated URLs before publishing.",
      "Making consistent anchor IDs for headings in documentation.",
    ],
    sections: [
      { heading: "What makes a good SEO slug?", body: "Short, descriptive and readable. Include the main keyword, use lowercase letters, separate words with hyphens and remove filler words where the meaning stays clear. Example: 'How to Merge PDF Files for Free in 2026' becomes merge-pdf-files-free. Avoid dates in slugs for content you plan to update." },
      { heading: "Hyphens vs underscores", body: "Google's own guidance recommends hyphens because they are read as spaces between words. Underscores can join words together, so free_pdf_tools may be read as one word. Use hyphens unless your system requires something else." },
      { heading: "Changing slugs on live pages", body: "Changing a slug changes the URL. If the page is already indexed or linked, add a 301 redirect from the old URL to the new one so you keep traffic and backlinks." },
    ],
  },

  "/tools/remove-duplicate-lines": {
    intro: [
      "Remove Duplicate Lines deletes repeated lines from any list and keeps only unique entries. Paste email lists, keyword lists, product SKUs, URLs, names or log lines, and the tool removes every repeat instantly while keeping the first copy in its original place. You can also sort the result alphabetically, by length or by number.",
      "Small details often create hidden duplicates: extra spaces, different capital letters or blank lines. Options to trim spaces, ignore case and remove empty lines catch those too. It all runs in your browser, so customer emails and private data are never uploaded, and even very long lists are processed in a moment.",
    ],
    steps: [
      "Paste your list into the left box, one item per line.",
      "Choose options: ignore case, trim spaces, remove empty lines.",
      "Pick a sort order or keep the original order.",
      "Check the counter to see how many duplicates were removed.",
      "Copy the unique list from the right box.",
    ],
    benefits: [
      { title: "Keeps your original order", body: "Only later repeats are removed, so a ranked or time-ordered list keeps its order unless you choose to sort." },
      { title: "Catches hidden duplicates", body: "'apple', ' apple' and 'Apple' can be treated as the same line with trim and ignore case, which plain spreadsheet filters often miss." },
      { title: "Natural sorting", body: "A–Z sorting understands numbers, so item2 comes before item10 instead of after it." },
    ],
    useCases: [
      "Cleaning an email or newsletter list before importing it.",
      "Removing repeated keywords from SEO keyword research exports.",
      "Deduplicating URLs before submitting a sitemap or disavow file.",
      "Finding unique values in a column copied from Excel or Google Sheets.",
      "Cleaning log files, hashtags or tag lists.",
    ],
    sections: [
      { heading: "How to remove duplicates from an Excel column", body: "Select the column in Excel or Google Sheets and copy it. Paste it here, set the options you need, then copy the unique result and paste it back into a new column. This avoids changing the rest of your sheet." },
      { heading: "Exact match vs ignore case", body: "With exact match, 'Paris' and 'paris' are different lines. Turn on Ignore case for emails, domains and keywords, where capital letters do not change the meaning." },
      { heading: "Privacy for customer data", body: "Lists of emails or phone numbers are personal data. Because this tool runs entirely on your device, nothing is sent to a server or stored after you close the page." },
    ],
  },

  "/tools/word-frequency-counter": {
    intro: [
      "The Word Frequency Counter shows how many times each word appears in your text and what percentage of the total it makes up. Switch to 2-word or 3-word phrases to find repeated phrases too. Writers use it to spot overused words, students use it to check essays, and SEO writers use it as a keyword density checker.",
      "Paste an article, essay, transcript or product description and the table updates instantly, sorted from most used to least used. Common words like 'the' and 'and' can be hidden so the important terms stand out. Export the full list to CSV for Excel or Google Sheets. Your text never leaves your browser.",
    ],
    steps: [
      "Paste your text into the box.",
      "Choose single words, 2-word or 3-word phrases.",
      "Turn Ignore common words on or off.",
      "Read the table: count and density for every word.",
      "Click CSV to download the full list.",
    ],
    benefits: [
      { title: "Phrases, not just words", body: "N-gram mode finds repeated phrases like 'online pdf tools', which is how people actually search and how repetition really shows up in writing." },
      { title: "Density in percent", body: "Each row shows its share of the total word count, so you can compare your main keyword with the rest of the text at a glance." },
      { title: "Works in many languages", body: "Words are detected using Unicode letters, so Urdu, Arabic, Hindi, Spanish and other languages are counted correctly." },
    ],
    useCases: [
      "Checking keyword density in a blog post before publishing.",
      "Finding overused words in an essay or cover letter.",
      "Analysing customer reviews or survey answers for common themes.",
      "Studying vocabulary in a book chapter or speech.",
      "Comparing your article with a competitor's to see missing topics.",
    ],
    sections: [
      { heading: "How keyword density is calculated", body: "Density = (times the word or phrase appears ÷ total words) × 100. If 'invoice' appears 8 times in an 800-word article, its density is 1%. Phrase density uses the same total word count, so results are easy to compare." },
      { heading: "Is there an ideal keyword density?", body: "Google does not use a fixed target. Use your main topic naturally in the title, headings and body, and cover related terms. If one keyword is many times more frequent than any other meaningful word, rewrite some sentences with synonyms." },
      { heading: "Word frequency vs word count", body: "A word counter tells you how long your text is. A word frequency counter tells you what the text is about and where it repeats itself. Use both together when editing." },
    ],
  },

  "/tools/cron-expression-generator": {
    intro: [
      "The Cron Expression Generator helps you write, read and test cron schedules. Type an expression like 0 9 * * 1-5 and see it explained in plain English — 'At 09:00 on Monday to Friday' — along with the next five times it will run. You can also edit each of the five fields separately or start from a preset such as every 5 minutes, daily at midnight or the first day of the month.",
      "Cron is used by Linux crontab, Kubernetes CronJobs, GitHub Actions, GitLab CI, AWS EventBridge, Vercel and many job schedulers. A small mistake can make a job run every minute instead of once a day. This tool checks every field, shows clear errors and helps you be sure before you deploy.",
    ],
    steps: [
      "Type or paste a cron expression, or click a preset.",
      "Adjust minute, hour, day, month or weekday in the five boxes.",
      "Read the plain-English description to confirm the schedule.",
      "Check the next 5 run times in your local time.",
      "Copy the expression into your crontab or CI config.",
    ],
    benefits: [
      { title: "Plain-English explanation", body: "Every valid expression is translated into a readable sentence, so teammates can review schedules without memorising cron syntax." },
      { title: "Real next run times", body: "The next five runs are calculated from the current time, including the standard rule that day-of-month and day-of-week are combined with OR when both are set." },
      { title: "Names and ranges supported", body: "Use lists (1,15), ranges (1-5), steps (*/10) and names like MON-FRI or JAN, just like standard crontab." },
    ],
    useCases: [
      "Scheduling a nightly database backup on a Linux server.",
      "Setting a Kubernetes CronJob or GitHub Actions schedule.",
      "Running reports every Monday morning.",
      "Clearing caches every 15 minutes.",
      "Checking an inherited crontab you did not write.",
    ],
    sections: [
      { heading: "Cron syntax cheat sheet", body: "Fields: minute (0–59) · hour (0–23) · day of month (1–31) · month (1–12 or JAN–DEC) · day of week (0–6 or SUN–SAT, 7 also means Sunday). Symbols: * any value · , list · - range · / step. Examples: */5 * * * * every 5 minutes · 0 0 * * * daily at midnight · 30 2 * * 0 Sundays at 02:30 · 0 0 1 * * monthly." },
      { heading: "Time zones", body: "Cron runs in the time zone of the server or service. Most cloud schedulers, GitHub Actions and many containers use UTC. The next run times here use your device's local time, so convert if your server uses UTC." },
      { heading: "5 fields vs 6 fields", body: "Standard Unix cron uses 5 fields. Some tools such as Quartz or Spring add a seconds field at the start, and AWS adds a year field. This tool checks the standard 5-field format used by crontab, Kubernetes and most CI services." },
    ],
  },

  "/tools/zakat-calculator": {
    intro: [
      "The Zakat Calculator helps you work out how much Zakat you owe this year. Enter your cash, bank savings, gold, silver, shares, business stock and money owed to you, subtract debts that are due now, and the calculator checks your wealth against the nisab and shows 2.5% Zakat payable. It works in any currency — rupees, pounds, dollars, riyals or dirhams.",
      "Nisab is calculated from today's gold or silver price that you enter, using the standard weights of 87.48 grams of gold or 612.36 grams of silver. The tool explains each step so you understand the result, and nothing you type is saved or sent anywhere. It is a general estimate; for complex cases please ask a qualified scholar.",
    ],
    steps: [
      "Enter your cash and bank balances.",
      "Add the current value of gold, silver, shares, business stock and money owed to you.",
      "Enter debts and bills that are due now.",
      "Choose silver or gold nisab and enter today's price per gram.",
      "Read your net wealth, nisab and Zakat payable at 2.5%.",
    ],
    benefits: [
      { title: "Automatic nisab check", body: "The calculator tells you whether your wealth is above nisab, so you know if Zakat is obligatory before you see the amount." },
      { title: "Gold or silver basis", body: "Switch between gold and silver nisab to see both thresholds. Silver gives a lower threshold, which many scholars recommend as the safer option." },
      { title: "Any currency, fully private", body: "There is no currency lock and no account. Your financial details stay on your device." },
    ],
    useCases: [
      "Calculating annual Zakat on savings and gold before Ramadan.",
      "Working out Zakat on shares, mutual funds or savings certificates.",
      "Estimating Zakat on business inventory for a small shop.",
      "Checking whether your wealth has reached nisab this year.",
      "Helping family members calculate their Zakat.",
    ],
    sections: [
      { heading: "Zakat formula", body: "Zakat = (zakatable assets − debts due now) × 2.5%, only if the net amount is at or above nisab and has been held for one lunar year (hawl). Example: savings 600,000 + gold worth 400,000 − debts 100,000 = 900,000. At 2.5% the Zakat is 22,500." },
      { heading: "What counts as zakatable wealth", body: "Usually zakatable: cash, bank balances, gold and silver (jewellery included in many schools of thought), shares and investments, business stock for sale and loans you expect to be repaid. Usually not zakatable: your home, car, furniture, clothes and tools used for work." },
      { heading: "Gold vs silver nisab", body: "Nisab is 87.48 g of gold or 612.36 g of silver. Because silver is cheaper, its nisab is much lower, so more people pay Zakat when it is used. Check today's local price per gram for accuracy, since metal prices change every day." },
    ],
  },

  "/tools/box-shadow-generator": {
    intro: [
      "The CSS Box Shadow Generator lets you design shadows visually and copy ready-to-use code. Move sliders for horizontal and vertical offset, blur, spread and opacity, pick a colour, switch to an inset shadow and see the result on a live preview box. Stack several layers to create soft, realistic depth like modern design systems use.",
      "Start from presets — Soft, Elevated, Neumorphic, Inset and Glow — then fine-tune. When it looks right, copy the CSS box-shadow property or a Tailwind CSS arbitrary class. It is built for front-end developers, web designers and anyone styling cards, buttons and modals.",
    ],
    steps: [
      "Pick a preset or start with the default layer.",
      "Adjust offset, blur, spread and opacity with the sliders.",
      "Choose a colour and toggle inset if needed.",
      "Add more layers with + for softer, more realistic shadows.",
      "Copy the CSS or Tailwind class into your project.",
    ],
    benefits: [
      { title: "Multiple layers", body: "Real shadows are rarely one layer. Combine a tight shadow and a wide soft one to get the natural depth used in popular UI kits." },
      { title: "Neumorphism and glow presets", body: "Create soft UI (neumorphic) effects with a light and dark pair, or coloured glows for buttons and focus states, in one click." },
      { title: "CSS and Tailwind output", body: "Copy standard CSS or a Tailwind shadow-[…] class that works without editing your config file." },
    ],
    useCases: [
      "Styling cards, pricing tables and modals.",
      "Creating hover and focus effects for buttons.",
      "Designing neumorphic dashboards.",
      "Matching shadows from a Figma design.",
      "Adding inner shadows to inputs and pressed buttons.",
    ],
    sections: [
      { heading: "box-shadow syntax explained", body: "box-shadow: [inset] offset-x offset-y blur spread colour. Positive x moves the shadow right, positive y moves it down. Blur softens the edge. Spread makes the shadow bigger (positive) or smaller (negative). Separate several shadows with commas; the first one is drawn on top." },
      { heading: "Tips for realistic shadows", body: "Use low opacity (5–20%), keep the light source consistent (usually from the top, so y is positive), use a small negative spread for large blurs, and layer two shadows: one close and sharp, one far and soft." },
      { heading: "Performance", body: "Shadows are cheap for static elements. Animating large blurred shadows can be slow on mobile; animate opacity of a pseudo-element with the shadow instead." },
    ],
  },

  "/tools/meta-tag-generator": {
    intro: [
      "The Meta Tag Generator creates the HTML tags every web page needs for search engines and social media: title, meta description, robots, canonical URL, Open Graph tags and Twitter Card tags. Fill in a short form and copy the full code block into the <head> of your page.",
      "Live previews show how your page will look in Google search results and as a shared link card on Facebook, LinkedIn, WhatsApp and X. Length counters turn green when your title and description are a good length, so they are less likely to be cut off. It is useful for bloggers, developers, marketers and small business owners building their own site.",
    ],
    steps: [
      "Enter your page title and meta description.",
      "Add the canonical URL and a share image URL (1200×630).",
      "Add your site name and X/Twitter handle if you have one.",
      "Check the Google and social previews and the length counters.",
      "Copy the HTML and paste it inside your page's <head>.",
    ],
    benefits: [
      { title: "SEO and social in one block", body: "Get title, description, canonical, robots, Open Graph and Twitter tags together, so nothing important is forgotten." },
      { title: "Live previews", body: "See your search result snippet and share card update as you type, before anything goes live." },
      { title: "Length guidance", body: "Colour-coded counters for title (about 60 characters) and description (about 160 characters) help avoid truncated snippets." },
    ],
    useCases: [
      "Adding meta tags to a new landing page or blog post.",
      "Fixing missing or ugly link previews on WhatsApp and Facebook.",
      "Writing tags for a static HTML or React site.",
      "Setting noindex on thank-you or staging pages.",
      "Auditing and rewriting titles for better click-through rates.",
    ],
    sections: [
      { heading: "Which meta tags matter for SEO", body: "The title tag is a strong relevance signal and the headline in results. The meta description does not affect rankings directly but influences clicks. The canonical tag tells Google which URL is the main version. The robots tag controls indexing. The old meta keywords tag is ignored by Google." },
      { heading: "Open Graph and Twitter Cards", body: "og:title, og:description, og:image and og:url control link previews on Facebook, LinkedIn, WhatsApp, Slack and Discord. twitter:card set to summary_large_image shows a big image on X. Use an absolute https image URL, ideally 1200×630 pixels and under 5 MB." },
      { heading: "After adding tags", body: "Social platforms cache previews. If an old preview still appears, use the platform's sharing debugger to refresh it. For Google, request indexing in Search Console to speed up recrawling." },
    ],
  },
};
