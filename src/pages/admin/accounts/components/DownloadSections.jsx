import React from "react";
import { jsPDF } from "jspdf";

const DownloadSections = ({
  sections = [],
  headerTitle,
  headerSubtitle,
  headerDescription,
  fileBaseName,
  getAnswerText,         
  className = "",
  children = "Download",
  title = "Download all sections as one PDF",
  ...buttonProps
}) => {
  // ---------- Shared helpers ---------- //
  const ensureSpace = (doc, ctx, needed) => {
    const { pageHeight, margin } = ctx;
    if (ctx.cursorY + needed > pageHeight - margin) {
      doc.addPage();
      ctx.cursorY = margin;
    }
  };

  const writeWrapped = (doc, text, ctx, lineHeight = 14, style = "normal") => {
    const { margin, pageWidth } = ctx;
    const maxWidth = pageWidth - 2 * margin;
    const lines = doc.splitTextToSize(String(text || ""), maxWidth);

    doc.setFont(undefined, style);
    for (const line of lines) {
      ensureSpace(doc, ctx, lineHeight);
      doc.text(line, margin, ctx.cursorY);
      ctx.cursorY += lineHeight;
    }
    return lines.length * lineHeight;
  };

  const drawSectionHeading = (doc, title, ctx) => {
    const { margin, pageWidth } = ctx;
    // Reserve ~40pt height
    ensureSpace(doc, ctx, 40);

    doc.setFillColor(240);
    doc.rect(margin, ctx.cursorY - 4, pageWidth - 2 * margin, 24, "F");

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(formatSectionName(title), margin + 6, ctx.cursorY + 12);

    ctx.cursorY += 30;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
  };

  const addQA = (doc, qText, aText, ctx) => {
    const qLineH = 14;
    const aLineH = 12;

    doc.setFont(undefined, "bold");
    writeWrapped(doc, qText, ctx, qLineH, "bold");
    ctx.cursorY += 2;

    doc.setFont(undefined, "normal");
    writeWrapped(doc, `Answer: ${aText}`, ctx, aLineH, "normal");

    ctx.cursorY += 8;
  };

  const drawSubheading = (doc, text, ctx) => {
    ensureSpace(doc, ctx, 24);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    writeWrapped(doc, text, ctx, 14, "bold");
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    ctx.cursorY += 4;
  };

  const formatSectionName = (name = "") =>
    String(name)
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const defaultGetAnswerText = (q) => {
    if (q.answer == null || q.answer === "") return "Not answered";
    if (Array.isArray(q.answer)) return q.answer.join(", ");
    return String(q.answer);
  };

  const handleClick = () => {
    try {
      if (!sections?.length) return;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;

      const ctx = {
        margin,
        pageWidth,
        pageHeight,
        cursorY: margin,
      };

      const answerFn = getAnswerText || defaultGetAnswerText;

      // ---- Header (title + subtitle + optional description) ----
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      writeWrapped(doc, String(headerTitle || "Details"), ctx, 20, "bold");
      ctx.cursorY += 6;

      if (headerSubtitle) {
        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        writeWrapped(doc, headerSubtitle, ctx, 14, "normal");
        ctx.cursorY += 8;
      }

      if (headerDescription) {
        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        writeWrapped(doc, headerDescription, ctx, 13, "normal");
        ctx.cursorY += 8;
      }

      // Divider
      ensureSpace(doc, ctx, 14);
      doc.setDrawColor(200);
      doc.line(margin, ctx.cursorY, pageWidth - margin, ctx.cursorY);
      ctx.cursorY += 18;

      // ---- Sections ----
      doc.setFontSize(11);
      doc.setTextColor(40);
      doc.setFont(undefined, "normal");

      const helpers = {
        ensureSpace,
        writeWrapped,
        drawSubheading,
        addQA,
        formatSectionName,
      };

      sections.forEach((section) => {
        drawSectionHeading(doc, section.section_name, ctx);

        // Normal Q/A
        (section.questions || [])
          .filter((q) => q.field_type !== "table")
          .forEach((q, idx) => {
            const qText = `${idx + 1}. ${q.question || ""}`;
            const aText = answerFn(q);
            addQA(doc, qText, aText, ctx);
          });
        ctx.cursorY += 6;
      });

      const safeName = String(fileBaseName || headerTitle || "details")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      doc.save(`${safeName}.pdf`);
    } catch (e) {
      console.error("DownloadSections error", e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90 ${className}`}
      title={title}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default DownloadSections;
