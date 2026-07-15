import { PrismaClient, LegalDocType } from '@prisma/client';
import { CategoryMapper } from '../src/server/modules/import-engine/mappers/category.mapper';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database with Law Categories & Hierarchies...');

  // 1. Seed Legal Document Types (Hierarchical Categories)
  const typesToSeed = Object.values(LegalDocType);
  for (const type of typesToSeed) {
    const label = CategoryMapper.getLabel(type);
    const hierarchy = CategoryMapper.getHierarchyLevel(type);

    await prisma.lawCategory.upsert({
      where: { name: label },
      update: {
        hierarchy: hierarchy
      },
      create: {
        name: label,
        description: `Kategori regulasi/hukum: ${label}`,
        hierarchy: hierarchy
      },
    });
  }
  console.log(`✅ Seeded ${typesToSeed.length} Legal Document Types as LawCategories.`);

  // 2. Seed Subject Categories (Topikal)
  const subjects = [
    { name: 'Hukum Ketenagakerjaan', desc: 'Regulasi terkait tenaga kerja, PHK, dan perselisihan hubungan industrial.' },
    { name: 'Hukum Pidana', desc: 'Hukum pidana umum dan khusus.' },
    { name: 'Hukum Perdata', desc: 'Hukum perikatan, kebendaan, waris, dan keluarga.' },
    { name: 'Hukum Tata Negara', desc: 'Konstitusi, kelembagaan negara, dan pemilu.' },
    { name: 'Hukum Administrasi Negara', desc: 'Perizinan, birokrasi, dan tata usaha negara.' },
    { name: 'Hukum Bisnis & Korporasi', desc: 'Perseroan terbatas, investasi, dan kepailitan.' },
    { name: 'Hukum Pajak & Keuangan', desc: 'Perpajakan, retribusi, dan keuangan negara.' },
  ];

  for (const subject of subjects) {
    await prisma.lawCategory.upsert({
      where: { name: subject.name },
      update: { description: subject.desc },
      create: {
        name: subject.name,
        description: subject.desc,
        hierarchy: 0 // 0 means topical category, not hierarchical
      },
    });
  }
  console.log(`✅ Seeded ${subjects.length} Topical Subjects.`);

  // 3. Create Initial Source Repository
  const repositoryBPHN = await prisma.sourceRepository.upsert({
    where: { id: 'default-bphn' }, // We need a unique constraint or we can use findFirst
    update: {},
    create: {
      id: 'default-bphn',
      name: 'JDIH BPHN',
      url: 'https://jdihn.go.id',
      description: 'Jaringan Dokumentasi dan Informasi Hukum Nasional',
    },
  });

  // Since upsert above uses id which wasn't fully set up with unique, let's just find first or create
  let jdihRepo = await prisma.sourceRepository.findFirst({ where: { name: 'JDIH BPHN' } });
  if (!jdihRepo) {
    jdihRepo = await prisma.sourceRepository.create({
      data: { name: 'JDIH BPHN', url: 'https://jdihn.go.id', description: 'Pusat Dokumentasi Hukum' }
    });
  }

  // Find the category we just seeded
  const categoryUU = await prisma.lawCategory.findUnique({ where: { name: CategoryMapper.getLabel(LegalDocType.UU) } });

  // 4. Create a mock Legal Document to prevent breaking existing code
  if (categoryUU && jdihRepo) {
    const uu13 = await prisma.legalDocument.upsert({
      where: { id: 'mock-uu-13' },
      update: {},
      create: {
        id: 'mock-uu-13',
        title: 'Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan',
        type: LegalDocType.UU,
        docNumber: '13',
        year: 2003,
        categoryId: categoryUU.id,
        sourceId: jdihRepo.id,
        keywords: {
          create: [
            { keyword: { connectOrCreate: { where: { keyword: 'phk' }, create: { keyword: 'phk' } } } }
          ]
        }
      },
    });
    console.log('✅ Seeded mock LegalDocument UU 13/2003.');
  }

  console.log('🎉 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
