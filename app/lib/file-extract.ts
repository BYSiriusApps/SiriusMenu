// Hazır menü dosyalarından (PDF/Excel/CSV/Word) düz metin çıkarma.
// Güvenlik ilkeleri:
// - Sadece metin çıkarılır; hiçbir makro, formül, gömülü nesne ya da harici referans çalıştırılmaz.
// - Uzantı/MIME değil, dosyanın gerçek "magic byte" imzası doğrulanır (yeniden adlandırılmış dosyalar yakalanır).
// - Eski, makro destekleyen ikili formatlar (.doc, .xls, .docm, .xlsm) kabul edilmez; sadece
//   modern, zip tabanlı XML formatları (.docx, .xlsx), .csv ve .pdf desteklenir.
// - Boyut sınırı ayrıştırmadan ÖNCE uygulanır (zip-bomb / aşırı büyük içerik riskini azaltır).
// - Çıkarılan metin uzunluğu da ayrıca sınırlanır (app/lib/gemini.ts parseMenuText).

export const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024; // 5MB
export type ImportFileExt = "csv" | "xlsx" | "docx" | "pdf";

const EXT_BY_NAME: Record<string, ImportFileExt> = {
  csv: "csv",
  xlsx: "xlsx",
  docx: "docx",
  pdf: "pdf",
};

// Yeniden adlandırılmış dosyaları yakalamak için gerçek ikili imzalar.
const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]); // eski .doc/.xls (desteklenmiyor)
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // .docx/.xlsx (zip tabanlı)
const ZIP_EMPTY_MAGIC = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

function startsWith(buf: Buffer, sig: Buffer): boolean {
  return buf.length >= sig.length && buf.subarray(0, sig.length).equals(sig);
}

export class FileImportError extends Error {}

function extFromFilename(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim());
  return m ? m[1].toLowerCase() : "";
}

function assertLooksLikeText(buf: Buffer) {
  // CSV için gerçek bir "magic number" yok; en azından ikili bir dosya (zip/pdf/OLE olarak
  // yeniden adlandırılmış) olmadığını ve makul oranda yazdırılabilir/UTF-8 metin içerdiğini doğrula.
  if (startsWith(buf, ZIP_MAGIC) || startsWith(buf, ZIP_EMPTY_MAGIC) || startsWith(buf, PDF_MAGIC) || startsWith(buf, OLE_MAGIC)) {
    throw new FileImportError("Dosya CSV gibi görünmüyor.");
  }
  const sample = buf.subarray(0, Math.min(buf.length, 4096));
  let control = 0;
  for (const byte of sample) {
    if (byte === 0) throw new FileImportError("Dosya CSV gibi görünmüyor.");
    if (byte < 9 || (byte > 13 && byte < 32)) control++;
  }
  if (sample.length > 0 && control / sample.length > 0.05) {
    throw new FileImportError("Dosya CSV gibi görünmüyor.");
  }
}

export function detectImportExt(filename: string, buf: Buffer): ImportFileExt {
  const declared = EXT_BY_NAME[extFromFilename(filename)];
  if (!declared) {
    throw new FileImportError("Desteklenmeyen dosya türü. Sadece PDF, Word (.docx), Excel (.xlsx) ve CSV kabul edilir.");
  }

  if (startsWith(buf, OLE_MAGIC)) {
    throw new FileImportError("Eski .doc/.xls formatı desteklenmiyor. Dosyayı .docx/.xlsx olarak kaydedip tekrar dene.");
  }

  switch (declared) {
    case "pdf":
      if (!startsWith(buf, PDF_MAGIC)) throw new FileImportError("Dosya geçerli bir PDF değil.");
      return "pdf";
    case "xlsx":
    case "docx":
      if (!startsWith(buf, ZIP_MAGIC) && !startsWith(buf, ZIP_EMPTY_MAGIC)) {
        throw new FileImportError("Dosya geçerli bir Word/Excel (Office Open XML) dosyası değil.");
      }
      return declared;
    case "csv":
      assertLooksLikeText(buf);
      return "csv";
  }
}

function bufferToText(buf: Buffer): string {
  // UTF-8 BOM varsa temizle.
  const withoutBom = buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf ? buf.subarray(3) : buf;
  return withoutBom.toString("utf8");
}

const MAX_EXTRACTED_CHARS = 30000;
// Zip tabanlı formatlar (docx/xlsx) teorik olarak "zip bomb" ile aşırı bellek/CPU tüketebilir;
// dosya boyutu zaten girişte sınırlı (MAX_IMPORT_FILE_BYTES) ama ek güvenlik için ayrıştırmaya
// bir üst zaman sınırı da koyuyoruz.
const EXTRACT_TIMEOUT_MS = 20000;

async function withTimeout<T>(p: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new FileImportError("Dosya işlenirken zaman aşımına uğradı.")), EXTRACT_TIMEOUT_MS);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

export async function extractImportText(ext: ImportFileExt, buf: Buffer): Promise<string> {
  switch (ext) {
    case "csv": {
      return bufferToText(buf).slice(0, MAX_EXTRACTED_CHARS);
    }
    case "xlsx": {
      return withTimeout(extractXlsxText(buf));
    }
    case "docx": {
      return withTimeout(extractDocxText(buf));
    }
    case "pdf": {
      return withTimeout(extractPdfText(buf));
    }
  }
}

async function extractXlsxText(buf: Buffer): Promise<string> {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  // exceljs sadece hücre değerlerini okur; formüllerin SONUCU (cached value) kullanılır, hiçbir
  // formül yeniden hesaplanmaz/çalıştırılmaz ve makro içeren .xlsm zaten detectImportExt'te reddedilir.
  // İki farklı @types/node sürümü arasındaki yapısal Buffer uyuşmazlığı için tip dönüşümü;
  // çalışma zamanında sıradan bir Node Buffer'dır.
  await workbook.xlsx.load(buf as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  const parts: string[] = [];
  let sheetCount = 0;
  for (const worksheet of workbook.worksheets) {
    if (sheetCount >= 5) break;
    sheetCount++;
    const lines: string[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const cells: string[] = [];
      row.eachCell({ includeEmpty: false }, (cell) => {
        const raw = cell.text ?? (cell.value == null ? "" : String(cell.value));
        cells.push(raw.replace(/\r?\n/g, " ").trim());
      });
      if (cells.some((c) => c)) lines.push(cells.join(", "));
    });
    if (lines.length) parts.push(`# ${worksheet.name}\n${lines.join("\n")}`);
    if (parts.join("\n").length > MAX_EXTRACTED_CHARS) break;
  }
  return parts.join("\n\n").slice(0, MAX_EXTRACTED_CHARS);
}

async function extractDocxText(buf: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer: buf });
  return (result.value || "").slice(0, MAX_EXTRACTED_CHARS);
}

async function extractPdfText(buf: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buf });
  try {
    const result = await parser.getText();
    return (result.text || "").slice(0, MAX_EXTRACTED_CHARS);
  } finally {
    await parser.destroy();
  }
}
