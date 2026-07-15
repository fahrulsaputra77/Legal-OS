export interface ParsedRecord {
  docNumber: string;
  title: string;
  year: number;
  type: string;
  rawContent: string;
  metadata?: any;
}

export interface FileParser {
  parse(filePath: string): Promise<ParsedRecord[]>;
}

export class JsonParser implements FileParser {
  async parse(filePath: string): Promise<ParsedRecord[]> {
    // Simulated JSON parsing
    return [
      { docNumber: '1', title: 'Undang-Undang Test JSON', year: 2024, type: 'UU', rawContent: 'Konten pasal 1 JSON' }
    ];
  }
}

export class CsvParser implements FileParser {
  async parse(filePath: string): Promise<ParsedRecord[]> {
    return [
      { docNumber: '2', title: 'Peraturan Pemerintah Test CSV', year: 2024, type: 'PP', rawContent: 'Konten CSV' }
    ];
  }
}

export class XmlParser implements FileParser {
  async parse(filePath: string): Promise<ParsedRecord[]> {
    return [
      { docNumber: '3', title: 'Test XML', year: 2024, type: 'UU', rawContent: 'Konten XML' }
    ];
  }
}

export class TxtParser implements FileParser {
  async parse(filePath: string): Promise<ParsedRecord[]> {
    return [
      { docNumber: '4', title: 'Test TXT', year: 2024, type: 'UU', rawContent: 'Konten TXT' }
    ];
  }
}

export class PdfParser implements FileParser {
  async parse(filePath: string): Promise<ParsedRecord[]> {
    return [
      { docNumber: '5', title: 'Test PDF Metadata', year: 2024, type: 'UU', rawContent: 'Konten PDF' }
    ];
  }
}

export function getParserForType(type: string): FileParser {
  switch (type.toUpperCase()) {
    case 'JSON': return new JsonParser();
    case 'CSV': return new CsvParser();
    case 'XML': return new XmlParser();
    case 'TXT': return new TxtParser();
    case 'PDF': return new PdfParser();
    default: throw new Error(`Unsupported file type: ${type}`);
  }
}
