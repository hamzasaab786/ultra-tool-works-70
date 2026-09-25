import type { ToolContentMap } from "./types";

export const chunk6: ToolContentMap = {
  "/tools/excel-to-word": {
    intro: [
      "The Excel to Word Converter takes a spreadsheet and rebuilds it as a real Word document: every sheet becomes a native table with its own rows, columns and header row, ready to edit, restyle or drop into a longer report. It exists because copy-pasting from Excel into Word almost always breaks — column widths collapse, numbers turn into text, and merged cells scatter across the page.",
      "Everything is parsed in your browser, so financial models, payroll sheets and client data never leave your device. Upload an XLSX or XLS file, let the converter read each worksheet, and download a DOCX in which the data is genuinely editable Word content rather than a flat screenshot of a spreadsheet. That makes it the quickest way to move tabular data into a document that has to be written around, commented on or signed off.",
    ],
    steps: [
      "Upload your .xlsx or .xls workbook by dragging it in or browsing your device.",
      "Wait a moment while each worksheet is read and its used range detected in your browser.",
      "Check the preview to confirm the rows, columns and header row were picked up correctly.",
      "Convert the workbook — every sheet is written into the document under its own heading.",
      "Download the DOCX and open it in Word, Google Docs or LibreOffice to edit the tables directly.",
    ],
    benefits: [
      { title: "Real Word tables, not images", body: "Each sheet arrives as a native table you can resize, recolour and type into. Nothing is pasted as a picture, so the document stays fully editable and searchable." },
      { title: "Every worksheet preserved", body: "Multi-sheet workbooks keep all of their sheets, converted in order and labelled by sheet name, so a monthly workbook doesn't lose eleven months of data on the way into Word." },
      { title: "Private by default", body: "Parsing runs entirely client-side, which matters when the workbook holds salaries, prices or customer records. No upload, no server copy, no retention." },
    ],
    useCases: [
      "Dropping a budget or pricing table into a proposal that is written in Word.",
      "Turning an attendance or inventory sheet into a printable document for sign-off.",
      "Preparing spreadsheet data for a report template that only accepts DOCX.",
      "Sharing figures with colleagues who do not have Excel installed.",
      "Converting an exported system report into a document you can annotate and comment on.",
    ],
    sections: [
      { heading: "What happens to formulas and formatting", body: "Calculated results are carried across rather than formula syntax, because a Word table has no calculation engine. Basic structure — header rows, cell order and text content — is preserved, while advanced spreadsheet formatting such as conditional colour rules and charts does not have a direct Word table equivalent." },
      { heading: "Handling very wide sheets", body: "A sheet with dozens of columns will not fit a portrait A4 page. Either trim the columns you don't need before converting, or set the page to landscape in Word afterwards so the table stays readable in print." },
      { heading: "Versus copy and paste", body: "Pasting from Excel carries hidden styling that fights with your document template, and pasting as an image kills editability. Converting produces a clean table built from the data itself, which behaves like the rest of your document." },
    ],
  },

  "/tools/signature-generator": {
    intro: [
      "The Signature Generator turns your handwriting into a clean digital signature file you can reuse on contracts, invoices, letters and PDFs. Draw with a mouse, trackpad or finger, or type your name and pick a handwriting style, then export a sharp PNG with a transparent background so the signature sits naturally on any document instead of inside a white rectangle.",
      "Signatures are personal data, so nothing here is uploaded: the canvas, the rendering and the export all happen in your browser, and closing the tab leaves no copy behind. Adjust pen thickness and ink colour until the stroke looks like your real signature, then keep the file on hand for every document that needs signing — no scanner, no printing, no app subscription.",
    ],
    steps: [
      "Choose whether to draw your signature or type your name in a handwriting style.",
      "If drawing, sign on the canvas with your mouse, trackpad or a finger on a touchscreen.",
      "Set the pen thickness and ink colour — black or dark blue reads best on printed paper.",
      "Clear and redraw as many times as you need until the stroke looks natural.",
      "Download the signature as a transparent PNG and drop it into your PDF, Word file or email footer.",
    ],
    benefits: [
      { title: "Transparent background", body: "The exported PNG has no white box, so the signature overlays contract text, letterheads and signature lines cleanly the way a pen on paper would." },
      { title: "Draw or type", body: "Draw for a genuine handwritten look, or type your name in a handwriting style when you want a consistent signature across a whole set of documents." },
      { title: "Nothing leaves your device", body: "Your signature is one of the easiest pieces of identity to misuse. It is drawn and exported locally, never uploaded, stored or logged." },
    ],
    useCases: [
      "Signing a contract or offer letter without printing, signing and rescanning it.",
      "Adding a signature image to invoices and quotations before sending them to clients.",
      "Building an email footer that ends with a handwritten-looking name.",
      "Signing school, visa or bank forms that are shared as PDFs.",
      "Creating a consistent signature for a team's document templates.",
    ],
    sections: [
      { heading: "Getting a natural-looking stroke", body: "A trackpad tends to produce shaky lines. Signing slowly with a finger on a phone or tablet usually gives the smoothest result, and a slightly thicker pen hides small wobbles. Sign a few times and keep the best attempt." },
      { heading: "Using the signature in a PDF", body: "Once downloaded, place the PNG onto the signature line with the Sign PDF or Edit PDF tool on Klipza. Because the background is transparent, the underlying line and text stay visible behind the ink." },
      { heading: "Are electronic signatures valid?", body: "Many countries accept electronic signatures for everyday business agreements, but rules differ by jurisdiction and by document type — property deeds, wills and some notarised forms often need a wet signature or a certified e-signature service. Check the requirements that apply where you are." },
    ],
  },



  "/tools/image-watermark": {
    intro: [
      "The Image Watermark tool stamps a text line or a logo across your photos so reposted copies still point back to you. You control position, size, opacity, rotation and whether the mark appears once in a corner or tiled across the whole frame — the difference between a watermark that quietly protects a portfolio and one that ruins the picture.",
      "Photographers, sellers and designers usually need this across a whole shoot rather than one file, so the tool is built for batches: set the mark up once and apply the same treatment to every image. Processing is done in the browser at the original resolution, so nothing is uploaded, nothing is recompressed unnecessarily, and your unwatermarked originals stay only on your device.",
    ],
    steps: [
      "Upload the photo or photos you want to protect.",
      "Choose a text watermark and type your name, handle or copyright line — or upload a logo image instead.",
      "Set position (corner, centre or tiled), size, rotation and colour.",
      "Lower the opacity until the mark is clearly visible but not overpowering — 30–50% suits most photos.",
      "Apply to all images and download the watermarked versions.",
    ],
    benefits: [
      { title: "Text or logo marks", body: "Use a simple copyright line for quick protection, or upload a transparent PNG logo when the watermark needs to match your brand exactly." },
      { title: "Batch consistency", body: "One set of settings is applied identically across every photo, so a whole gallery looks deliberate instead of hand-placed and slightly different each time." },
      { title: "Original resolution kept", body: "Only the watermark layer is drawn on top; the underlying pixels and dimensions are untouched, so your images stay as sharp as they started." },
    ],
    useCases: [
      "Photographers sharing proofs with clients before final payment.",
      "Sellers protecting product photos from being reused by competing listings.",
      "Designers marking concept work as a draft before approval.",
      "Adding a copyright line to images before posting them on social media.",
      "Labelling internal screenshots as confidential before circulating them.",
    ],
    sections: [
      { heading: "Corner mark or tiled mark?", body: "A single corner mark is subtle and looks professional, but it can be cropped out in seconds. Tiling a light, rotated mark across the frame is much harder to remove cleanly, which is why proofing galleries usually use it." },
      { heading: "Choosing opacity and colour", body: "Around 30–50% opacity reads on most images. White marks work over dark photos and dark marks over light ones; if a gallery mixes both, a mid-grey mark with a soft outline stays visible across the whole set." },
      { heading: "What a watermark can and cannot do", body: "A watermark deters casual reuse and keeps your name attached to a shared image, but a determined editor can retouch marks out. Treat it as a first line of defence alongside lower-resolution previews for public posting, not as absolute protection." },
    ],
  },

  "/tools/random-number-generator": {
    intro: [
      "The Random Number Generator picks numbers in any range you set, one at a time or many at once, with an option to prevent repeats. It draws from the browser's cryptographically strong random source rather than a simple seeded formula, so results are genuinely unpredictable — which is what matters when the numbers decide a giveaway winner rather than a dice roll in a game.",
      "Set a minimum and maximum, choose how many numbers to draw, and decide whether duplicates are allowed. Unique mode is the one to use for raffles, team draws and secret-santa style assignments, where the same ticket must never come up twice. Nothing is stored or sent anywhere, and there are no ads, accounts or limits on how many draws you run.",
    ],
    steps: [
      "Enter the minimum and maximum values for your range — negative numbers are fine.",
      "Choose how many numbers you want in a single draw.",
      "Turn on unique results if the same number must not appear twice.",
      "Generate the draw and read the results.",
      "Copy the numbers, or draw again as many times as you need.",
    ],
    benefits: [
      { title: "Cryptographically strong randomness", body: "Numbers come from the browser's secure random source, not a predictable seeded sequence, which makes draws fair enough to run in front of an audience." },
      { title: "Unique-results mode", body: "Draw a set of numbers with no repeats in one go — exactly what a raffle, a shortlist or a random team split needs." },
      { title: "Any range, instantly", body: "From 1–10 for a quick decision to large custom ranges for ticket numbers, results appear immediately with nothing to install or sign up for." },
    ],
    useCases: [
      "Picking a giveaway or raffle winner from numbered entries.",
      "Splitting a class or team into random groups.",
      "Choosing a random order for presentations or interviews.",
      "Generating sample values while testing software or spreadsheets.",
      "Settling a decision when nobody can agree and a coin flip isn't enough.",
    ],
    sections: [
      { heading: "Running a draw people will trust", body: "Number every entry first and say the range out loud before generating. Using unique mode and drawing all winners in a single pass — rather than repeatedly pressing generate — removes any suspicion that unwanted results were quietly discarded." },
      { heading: "Random versus shuffled", body: "Generating a number picks a value independently each time, so repeats are possible unless you switch on unique mode. If you need every item in a list used exactly once, a unique draw across the full range is effectively a shuffle." },
      { heading: "Not for passwords or keys", body: "Use the Password Generator for credentials. It is built to produce strings with the right character mix and length rather than plain numbers, which are far too easy to guess as a password." },
    ],
  },

  "/tools/ovulation-calculator": {
    intro: [
      "The Ovulation Calculator estimates when you are most likely to ovulate and marks the fertile window around it, using the first day of your last period and your average cycle length. Ovulation typically happens about 14 days before the next period begins, and the days that matter most for conception are the five days leading up to it plus ovulation day itself.",
      "It is built as a private planning aid: the dates you enter are used only for the calculation in your browser, with no account, no tracking and nothing saved to a server. Use it to plan ahead, to understand where you are in your cycle, or simply to know roughly when your next period is due — while remembering that a calendar estimate is a starting point, not a medical diagnosis.",
    ],
    steps: [
      "Enter the first day of your last menstrual period.",
      "Set your average cycle length — 28 days is typical, but anything from about 21 to 35 days is common.",
      "Calculate to see your estimated ovulation date.",
      "Read the fertile window highlighted around that date, including the days before it.",
      "Note the estimated next period date to plan the following cycle.",
    ],
    benefits: [
      { title: "Fertile window, not just one day", body: "Sperm can survive for several days, so the calculator shows the full window rather than a single date — a far more useful picture when planning." },
      { title: "Works with irregular cycle lengths", body: "Set your own average instead of being locked to a 28-day assumption, so the estimate reflects your actual cycle rather than a textbook one." },
      { title: "Completely private", body: "Cycle data is sensitive. Nothing is uploaded, stored in an account or shared — the calculation runs and disappears when you close the page." },
    ],
    useCases: [
      "Planning ahead while trying to conceive.",
      "Understanding which part of the cycle you are currently in.",
      "Estimating when the next period is due before booking travel or events.",
      "Preparing a cycle history to discuss with a doctor or fertility clinic.",
      "Learning how cycle length changes the timing of ovulation.",
    ],
    sections: [
      { heading: "How the estimate is calculated", body: "The luteal phase — from ovulation to the next period — is relatively stable at around 14 days for most people. Ovulation is therefore estimated as your cycle length minus 14 days, counted from the first day of your last period, with the fertile window covering the five days before that date plus ovulation day." },
      { heading: "How accurate is it?", body: "It is a calendar average, and cycles vary month to month with stress, illness, travel and other factors. Ovulation predictor tests, basal body temperature tracking and cervical mucus observation give far more precise timing, and a healthcare professional can interpret them together." },
      { heading: "When to speak to a doctor", body: "Cycles consistently shorter than 21 days or longer than 35, cycles that skip or change abruptly, or difficulty conceiving after several months of trying are all reasons to seek medical advice. This tool is for general information and planning, not for diagnosis or contraception." },
    ],
  },
};
