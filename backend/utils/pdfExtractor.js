const pdf = require('pdf-parse');

const normalizeExtractedText = (text = '') =>
  String(text)
    .replace(/\u0000/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const extractWithPdfParse = async (buffer) => {
  const firstPass = await pdf(buffer);
  let bestText = normalizeExtractedText(firstPass?.text || '');

  if (bestText.length >= 120) {
    return bestText;
  }

  const secondPass = await pdf(buffer, {
    pagerender: async (pageData) => {
      const textContent = await pageData.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false
      });
      return textContent.items.map((item) => item.str || '').join(' ');
    }
  });

  const secondText = normalizeExtractedText(secondPass?.text || '');
  if (secondText.length > bestText.length) {
    bestText = secondText;
  }

  return bestText;
};

const extractWithPdfJs = async (buffer) => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
    isEvalSupported: false,
    stopAtErrors: false
  });

  const doc = await task.promise;
  const pagesText = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    const pageText = content.items.map((item) => item.str || '').join(' ');
    pagesText.push(pageText);
  }

  return normalizeExtractedText(pagesText.join('\n'));
};

const extractTextFromPdf = async (buffer) => {
  let best = '';
  const errors = [];

  try {
    const parsed = await extractWithPdfParse(buffer);
    if (parsed.length > best.length) best = parsed;
  } catch (error) {
    errors.push(`pdf-parse failed: ${error.message}`);
  }

  if (best.length < 80) {
    try {
      const parsedByPdfJs = await extractWithPdfJs(buffer);
      if (parsedByPdfJs.length > best.length) best = parsedByPdfJs;
    } catch (error) {
      errors.push(`pdfjs-dist failed: ${error.message}`);
    }
  }

  if (best.length < 80) {
    const raw = normalizeExtractedText(
      buffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    );
    if (raw.length > best.length) best = raw;
  }

  return {
    text: best,
    errors
  };
};

module.exports = { extractTextFromPdf };
