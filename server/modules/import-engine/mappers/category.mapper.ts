import { LegalDocType } from '@prisma/client';

export class CategoryMapper {
  /**
   * Normalizes raw strings from imported files into Prisma LegalDocType enums.
   */
  static parseType(rawType: string): LegalDocType {
    const normalized = rawType.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

    if (normalized.includes('uud') || normalized.includes('undang undang dasar')) return LegalDocType.UUD_1945;
    if (normalized.includes('tap mpr') || normalized.includes('ketetapan mpr')) return LegalDocType.TAP_MPR;
    if (normalized === 'uu' || normalized === 'undang undang' || normalized === 'undangundang') return LegalDocType.UU;
    if (normalized.includes('perppu') || normalized.includes('peraturan pemerintah pengganti undang undang')) return LegalDocType.PERPPU;
    if (normalized === 'pp' || normalized === 'peraturan pemerintah') return LegalDocType.PP;
    if (normalized.includes('perpres') || normalized.includes('peraturan presiden')) return LegalDocType.PERPRES;
    if (normalized.includes('permen') || normalized.includes('peraturan menteri')) return LegalDocType.PERMEN;
    if (normalized.includes('perda provinsi') || normalized.includes('peraturan daerah provinsi')) return LegalDocType.PERDA_PROV;
    if (normalized.includes('pergub') || normalized.includes('peraturan gubernur')) return LegalDocType.PERGUB;
    if (normalized.includes('perda kab') || normalized.includes('perda kota') || normalized.includes('peraturan daerah kab')) return LegalDocType.PERDA_KABKOT;
    if (normalized.includes('perbup') || normalized.includes('peraturan bupati')) return LegalDocType.PERBUP;
    if (normalized.includes('perwali') || normalized.includes('peraturan wali kota') || normalized.includes('peraturan walikota')) return LegalDocType.PERWALI;
    if (normalized.startsWith('se ') || normalized.includes('surat edaran')) return LegalDocType.SE;
    if (normalized.includes('inpres') || normalized.includes('instruksi presiden')) return LegalDocType.INPRES;
    if (normalized.includes('perma') || normalized.includes('peraturan mahkamah agung')) return LegalDocType.PERMA;
    if (normalized.includes('sema') || normalized.includes('surat edaran mahkamah agung')) return LegalDocType.SEMA;
    if (normalized.includes('putusan ma') || normalized.includes('putusan mahkamah agung')) return LegalDocType.PUTUSAN_MA;
    if (normalized.includes('putusan mk') || normalized.includes('putusan mahkamah konstitusi')) return LegalDocType.PUTUSAN_MK;
    if (normalized.includes('yurisprudensi')) return LegalDocType.YURISPRUDENSI;
    
    // Lembaga
    if (normalized.includes('peraturan ojk') || normalized.includes('pojk')) return LegalDocType.PERATURAN_OJK;
    if (normalized.includes('peraturan bi') || normalized.includes('pbi')) return LegalDocType.PERATURAN_BI;
    if (normalized.includes('peraturan kpu') || normalized.includes('pkpu')) return LegalDocType.PERATURAN_KPU;
    if (normalized.includes('peraturan bpk')) return LegalDocType.PERATURAN_BPK;
    if (normalized.includes('peraturan lkpp')) return LegalDocType.PERATURAN_LKPP;
    if (normalized.includes('peraturan bkn')) return LegalDocType.PERATURAN_BKN;
    if (normalized.includes('peraturan bssn')) return LegalDocType.PERATURAN_BSSN;

    return LegalDocType.OTHER;
  }

  /**
   * Returns the hierarchy level of a legal document type based on UU 12/2011.
   * Lower number = higher hierarchy. 99 = unclassified/other.
   */
  static getHierarchyLevel(type: LegalDocType): number {
    switch (type) {
      case LegalDocType.UUD_1945: return 1;
      case LegalDocType.TAP_MPR: return 2;
      case LegalDocType.UU:
      case LegalDocType.PERPPU: return 3;
      case LegalDocType.PP: return 4;
      case LegalDocType.PERPRES: return 5;
      case LegalDocType.PERDA_PROV: return 6;
      case LegalDocType.PERDA_KABKOT: return 7;
      
      // Delegated legislation (Pasal 8 UU 12/2011)
      case LegalDocType.PERMEN:
      case LegalDocType.PERATURAN_BI:
      case LegalDocType.PERATURAN_OJK:
      case LegalDocType.PERATURAN_BPK:
      case LegalDocType.PERATURAN_KPU:
      case LegalDocType.PERATURAN_BKN:
      case LegalDocType.PERATURAN_LKPP:
      case LegalDocType.PERATURAN_BSSN: return 8;

      case LegalDocType.PERGUB: return 9;
      case LegalDocType.PERBUP:
      case LegalDocType.PERWALI: return 10;

      // Administrative / internal
      case LegalDocType.INPRES: return 11;
      case LegalDocType.PERMA: return 12;
      case LegalDocType.SEMA: return 13;
      case LegalDocType.SE: return 14;

      // Judicial
      case LegalDocType.PUTUSAN_MK: return 20; // Constitutional
      case LegalDocType.YURISPRUDENSI: return 21;
      case LegalDocType.PUTUSAN_MA: return 22;

      default: return 99;
    }
  }

  /**
   * Translates an enum back to its display label.
   */
  static getLabel(type: LegalDocType): string {
    const labels: Record<LegalDocType, string> = {
      [LegalDocType.UUD_1945]: 'UUD 1945',
      [LegalDocType.TAP_MPR]: 'Ketetapan MPR',
      [LegalDocType.UU]: 'Undang-Undang',
      [LegalDocType.PERPPU]: 'Perppu',
      [LegalDocType.PP]: 'Peraturan Pemerintah',
      [LegalDocType.PERPRES]: 'Peraturan Presiden',
      [LegalDocType.PERMEN]: 'Peraturan Menteri',
      [LegalDocType.PERDA_PROV]: 'Peraturan Daerah Provinsi',
      [LegalDocType.PERGUB]: 'Peraturan Gubernur',
      [LegalDocType.PERDA_KABKOT]: 'Peraturan Daerah Kab/Kota',
      [LegalDocType.PERBUP]: 'Peraturan Bupati',
      [LegalDocType.PERWALI]: 'Peraturan Wali Kota',
      [LegalDocType.SE]: 'Surat Edaran',
      [LegalDocType.INPRES]: 'Instruksi Presiden',
      [LegalDocType.PERMA]: 'Peraturan MA',
      [LegalDocType.SEMA]: 'SEMA',
      [LegalDocType.PUTUSAN_MA]: 'Putusan MA',
      [LegalDocType.PUTUSAN_MK]: 'Putusan MK',
      [LegalDocType.YURISPRUDENSI]: 'Yurisprudensi',
      [LegalDocType.PERATURAN_OJK]: 'Peraturan OJK',
      [LegalDocType.PERATURAN_BI]: 'Peraturan BI',
      [LegalDocType.PERATURAN_KPU]: 'Peraturan KPU',
      [LegalDocType.PERATURAN_BPK]: 'Peraturan BPK',
      [LegalDocType.PERATURAN_LKPP]: 'Peraturan LKPP',
      [LegalDocType.PERATURAN_BKN]: 'Peraturan BKN',
      [LegalDocType.PERATURAN_BSSN]: 'Peraturan BSSN',
      [LegalDocType.OTHER]: 'Lainnya'
    };
    return labels[type] || 'Lainnya';
  }
}
