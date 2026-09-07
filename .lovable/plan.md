# Fix PDF upload rejection + add test sample files

## What's wrong

The PDF upload area only accepts a file when the browser reports its type as exactly `application/pdf`. Automated tests (and some real browsers/OSes) hand over a `.pdf` file with a blank or different type, so the file is silently dropped, an "Invalid File Type" message appears, and the "Compress PDFs" button stays greyed out. Nothing to do with the compression-level slider — the second failing test fails for the same reason (no file ever got in).

## The fix

1. Accept a file when either the reported type says PDF or the file name ends in `.pdf`. Same relaxed rule for images (type starts with `image/` or the name ends in a known image extension).
2. Apply this in three places so behaviour is consistent: the shared upload area, the PDF compressor's file handler, and the shared PDF validation helper.
3. Only show the "Invalid File Type" message when genuinely nothing usable was selected, and make sure a good upload immediately enables the Compress button.
4. Add small sample files the test harness can pick up: a sample PDF and a sample PNG/JPG served from the site's public folder (`/samples/sample.pdf`, `/samples/sample.jpg`, `/samples/sample.png`), so the blocked image-tool tests have something to upload.

## Technical notes

- `src/components/DragDropUpload.tsx`: replace strict `file.type === 'application/pdf'` / `startsWith('image/')` checks in `filterFiles` with a type-or-extension check; widen the dropzone `accept` map to also allow `application/octet-stream` for `.pdf` so files with no MIME aren't rejected before `onDrop`.
- `src/hooks/usePdfCompression.ts`: same relaxed filter in `handleFilesSelected`; keep the destructive toast only when the filtered list is empty.
- `src/utils/fileUtils.ts`: `validatePdfFile` accepts extension fallback.
- Generate `public/samples/sample.pdf` plus one JPG and one PNG fixture at build-safe static paths; no route or app-logic change.
- No change to compression logic, settings, or output.

## Verification

Rerun both compressor tests and the image-tool tests; confirm upload → button enabled → compressed output → download works.
