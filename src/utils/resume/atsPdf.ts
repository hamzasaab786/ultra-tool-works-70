/**
 * Vector (selectable-text) resume PDF generator.
 *
 * A raster screenshot PDF looks fine to a human but is invisible to applicant
 * tracking systems. This writes real text runs with jsPDF so every keyword is
 * parsable, the file stays under ~100KB and the layout still looks designed.
 */
import jsPDF from "jspdf";
import { DENSITY_SCALE, PDF_FONT, type ResumeData, type ResumeSettings } from "./types";

const PAGE_W = 210;
const PAGE_H = 297;

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [17, 17, 17];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Latin-1 safe text for the built-in PDF fonts. */
const clean = (value: string) =>
  (value || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00B7/g, "-")
    .replace(/[^\x09\x0A\x20-\xFF]/g, "")
    .trim();

const lines = (value: string) => clean(value).split("\n").map((l) => l.trim()).filter(Boolean);

export function generateAtsResumePdf(data: ResumeData, settings: ResumeSettings) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const font = PDF_FONT[settings.font];
  const scale = DENSITY_SCALE[settings.density];
  const accent = hexToRgb(settings.accent);

  const margin = 16;
  const contentW = PAGE_W - margin * 2;
  let y = margin;

  const mm = (pt: number) => (pt * 0.3528 * scale);

  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    opts: { size: number; style?: "normal" | "bold" | "italic"; color?: [number, number, number]; indent?: number; gap?: number; width?: number }
  ) => {
    const { size, style = "normal", color = [17, 17, 17] as [number, number, number], indent = 0, gap = 1 } = opts;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const wrapped: string[] = doc.splitTextToSize(clean(text), (opts.width ?? contentW) - indent);
    const lh = mm(size) * 1.32;
    wrapped.forEach((line) => {
      ensure(lh);
      doc.text(line, margin + indent, y + lh * 0.78);
      y += lh;
    });
    y += mm(gap);
  };

  const rowWrite = (left: string, right: string, size: number, style: "bold" | "normal" = "bold") => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(17, 17, 17);
    const lh = mm(size) * 1.32;
    ensure(lh);
    doc.setFont(font, "normal");
    doc.setFontSize(size - 1);
    const rightW = right ? doc.getTextWidth(clean(right)) : 0;
    doc.setFont(font, style);
    doc.setFontSize(size);
    const leftLines: string[] = doc.splitTextToSize(clean(left), contentW - rightW - 4);
    doc.text(leftLines[0] ?? "", margin, y + lh * 0.78);
    if (right) {
      doc.setFont(font, "normal");
      doc.setFontSize(size - 1);
      doc.setTextColor(90, 90, 90);
      doc.text(clean(right), PAGE_W - margin, y + lh * 0.78, { align: "right" });
    }
    y += lh;
    if (leftLines.length > 1) {
      doc.setFont(font, style);
      doc.setFontSize(size);
      doc.setTextColor(17, 17, 17);
      leftLines.slice(1).forEach((l) => {
        ensure(lh);
        doc.text(l, margin, y + lh * 0.78);
        y += lh;
      });
    }
  };

  const section = (title: string) => {
    y += mm(3);
    ensure(mm(14));
    doc.setFont(font, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(clean(title).toUpperCase(), margin, y + mm(3.2));
    y += mm(4.6);
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, PAGE_W - margin, y);
    y += mm(2.6);
  };

  const bullets = (value: string) => {
    lines(value).forEach((item) => {
      const lh = mm(10) * 1.34;
      doc.setFont(font, "normal");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      const wrapped: string[] = doc.splitTextToSize(item, contentW - 5);
      wrapped.forEach((line, i) => {
        ensure(lh);
        if (i === 0) doc.text("\u2022", margin + 1, y + lh * 0.78);
        doc.text(line, margin + 5, y + lh * 0.78);
        y += lh;
      });
    });
    y += mm(1.4);
  };

  // ---- Header ----------------------------------------------------------
  doc.setFont(font, "bold");
  doc.setFontSize(22);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text(clean(data.name) || "Your Name", margin, y + mm(8));
  y += mm(9.5);

  if (data.title) {
    doc.setFont(font, "normal");
    doc.setFontSize(12);
    doc.setTextColor(70, 70, 70);
    doc.text(clean(data.title), margin, y + mm(4));
    y += mm(6);
  }

  const contacts = [data.location, data.phone, data.email, data.linkedin, data.github, data.website]
    .map(clean)
    .filter(Boolean)
    .join("  |  ");
  if (contacts) {
    write(contacts, { size: 9.5, color: [80, 80, 80], gap: 1.5 });
  }

  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, y, PAGE_W - margin, y);
  y += mm(1.5);

  // ---- Body ------------------------------------------------------------
  if (data.summary.trim()) {
    section("Professional Summary");
    write(data.summary, { size: 10, color: [30, 30, 30], gap: 0 });
  }

  if (data.experience.some((e) => e.role || e.company)) {
    section("Professional Experience");
    data.experience.forEach((item) => {
      const heading = [item.role, item.company].filter(Boolean).join(" | ");
      const dates = [item.start, item.end].filter(Boolean).join(" - ");
      if (heading || dates) rowWrite(heading, dates, 11);
      if (item.location) write(item.location, { size: 9.5, style: "italic", color: [100, 100, 100], gap: 0.6 });
      bullets(item.bullets);
    });
  }

  if (data.projects.some((p) => p.name)) {
    section("Projects");
    data.projects.forEach((item) => {
      const heading = [item.name, item.tech].filter(Boolean).join(" | ");
      if (heading) rowWrite(heading, "", 10.5);
      if (item.link) write(item.link, { size: 9, color: [100, 100, 100], gap: 0.4 });
      bullets(item.bullets);
    });
  }

  if (data.education.some((e) => e.degree || e.school)) {
    section("Education");
    data.education.forEach((item) => {
      const dates = [item.start, item.end].filter(Boolean).join(" - ");
      if (item.degree || dates) rowWrite(item.degree, dates, 10.5);
      const sub = [item.school, item.location].filter(Boolean).join(", ");
      if (sub) write(sub, { size: 10, color: [40, 40, 40], gap: 0.3 });
      if (item.details) write(item.details, { size: 9, color: [100, 100, 100], gap: 1 });
    });
  }

  if (data.skills.trim()) {
    section("Skills");
    lines(data.skills).forEach((line) => {
      const [label, ...rest] = line.split(":");
      if (rest.length) {
        const lh = mm(10) * 1.34;
        doc.setFont(font, "bold");
        doc.setFontSize(10);
        doc.setTextColor(17, 17, 17);
        const labelText = `${label.trim()}: `;
        const labelW = doc.getTextWidth(labelText);
        doc.setFont(font, "normal");
        const wrapped: string[] = doc.splitTextToSize(rest.join(":").trim(), contentW - labelW);
        wrapped.forEach((part, i) => {
          ensure(lh);
          if (i === 0) {
            doc.setFont(font, "bold");
            doc.text(labelText, margin, y + lh * 0.78);
            doc.setFont(font, "normal");
            doc.text(part, margin + labelW, y + lh * 0.78);
          } else {
            doc.text(part, margin + labelW, y + lh * 0.78);
          }
          y += lh;
        });
      } else {
        write(line, { size: 10, color: [30, 30, 30], gap: 0 });
      }
    });
  }

  if (data.awards.trim()) {
    section("Certifications & Awards");
    bullets(data.awards);
  }

  if (data.languages.trim()) {
    section("Languages");
    write(data.languages, { size: 10, color: [30, 30, 30], gap: 0 });
  }

  doc.setProperties({
    title: `${clean(data.name)} - Resume`,
    subject: clean(data.title),
    author: clean(data.name),
    keywords: clean(data.skills).replace(/\n/g, ", "),
  });

  return doc;
}
