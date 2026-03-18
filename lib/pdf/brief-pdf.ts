import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { BriefPdfContent, BriefPdfField, BriefPdfSection } from '@/lib/pdf/render-brief-pdf';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 52;
const MARGIN_BOTTOM = 52;
const LINE_HEIGHT = 14;
const SECTION_SPACING = 18;

type PdfCursor = {
  document: PDFDocument;
  page: PDFPage;
  y: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
};

function splitTextToLines(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const tokens = text.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return [''];
  }

  const lines: string[] = [];
  let currentLine = '';

  for (const token of tokens) {
    const candidate = currentLine.length > 0 ? `${currentLine} ${token}` : token;

    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = '';
    }

    if (font.widthOfTextAtSize(token, fontSize) <= maxWidth) {
      currentLine = token;
      continue;
    }

    let remainder = token;

    while (remainder.length > 0) {
      let chunkSize = remainder.length;

      while (chunkSize > 1 && font.widthOfTextAtSize(remainder.slice(0, chunkSize), fontSize) > maxWidth) {
        chunkSize -= 1;
      }

      lines.push(remainder.slice(0, chunkSize));
      remainder = remainder.slice(chunkSize);
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

function ensureVerticalSpace(cursor: PdfCursor, requiredHeight: number) {
  if (cursor.y - requiredHeight >= MARGIN_BOTTOM) {
    return;
  }

  cursor.page = cursor.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cursor.y = PAGE_HEIGHT - MARGIN_TOP;
}

function drawLines(cursor: PdfCursor, lines: string[], options: { font: PDFFont; size: number; color?: ReturnType<typeof rgb>; x?: number }) {
  const { font, size, color = rgb(0.1, 0.1, 0.1), x = MARGIN_X } = options;

  ensureVerticalSpace(cursor, lines.length * LINE_HEIGHT);

  for (const line of lines) {
    cursor.page.drawText(line, {
      x,
      y: cursor.y,
      size,
      font,
      color
    });

    cursor.y -= LINE_HEIGHT;
  }
}

function drawHeader(cursor: PdfCursor, content: BriefPdfContent) {
  drawLines(cursor, [content.title], { font: cursor.boldFont, size: 16, color: rgb(0, 0, 0) });
  drawLines(cursor, [content.subtitle], { font: cursor.regularFont, size: 10, color: rgb(0.35, 0.35, 0.35) });
  cursor.y -= 8;
}

function drawField(cursor: PdfCursor, field: BriefPdfField) {
  const maxWidth = PAGE_WIDTH - MARGIN_X * 2;
  const label = `${field.label} :`;
  const body = field.value || 'Non renseigné';
  const bodyLines = splitTextToLines(body, cursor.regularFont, 10, maxWidth - 24);

  drawLines(cursor, [label], { font: cursor.boldFont, size: 10, color: rgb(0.08, 0.08, 0.08) });
  drawLines(cursor, bodyLines, {
    font: cursor.regularFont,
    size: 10,
    color: rgb(0.2, 0.2, 0.2),
    x: MARGIN_X + 12
  });
}

function drawSection(cursor: PdfCursor, section: BriefPdfSection) {
  ensureVerticalSpace(cursor, SECTION_SPACING + LINE_HEIGHT * 2);
  drawLines(cursor, [section.title], { font: cursor.boldFont, size: 12, color: rgb(0, 0, 0) });

  if (section.fields) {
    for (const field of section.fields) {
      drawField(cursor, field);
    }
  }

  if (section.bullets) {
    const maxWidth = PAGE_WIDTH - MARGIN_X * 2 - 12;

    for (const bullet of section.bullets) {
      const wrapped = splitTextToLines(bullet, cursor.regularFont, 10, maxWidth);

      if (wrapped.length === 0) {
        continue;
      }

      drawLines(cursor, [`• ${wrapped[0]}`], { font: cursor.regularFont, size: 10, color: rgb(0.2, 0.2, 0.2) });
      for (const continuation of wrapped.slice(1)) {
        drawLines(cursor, [continuation], {
          font: cursor.regularFont,
          size: 10,
          color: rgb(0.2, 0.2, 0.2),
          x: MARGIN_X + 10
        });
      }
    }
  }

  cursor.y -= 4;
}

export async function generateBriefPdf(content: BriefPdfContent) {
  const pdf = await PDFDocument.create();
  const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const cursor: PdfCursor = {
    document: pdf,
    page: pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    y: PAGE_HEIGHT - MARGIN_TOP,
    regularFont,
    boldFont
  };

  drawHeader(cursor, content);

  for (const section of content.sections) {
    drawSection(cursor, section);
  }

  return pdf.save();
}
