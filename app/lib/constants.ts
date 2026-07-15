import { markRaw } from 'vue';
// =============================================================================
// AI Legal Operating System — Constants & Navigation Configuration
// =============================================================================

import {
  LayoutDashboard,
  MessageSquare,
  Search,
  FileEdit,
  Scale,
  TrendingUp,
  FileSearch,
  FileCheck,
  HelpCircle,
  Sword,
  Handshake,
  Calendar,
  Building2,
  Share2,
  Calculator,
  Users,
  FileText,
  FolderOpen,
  BarChart3,
  Bell,
  Settings,
  Database,
} from 'lucide-vue-next';

// -----------------------------------------------------------------------------
// Navigation Items
// -----------------------------------------------------------------------------

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: markRaw(LayoutDashboard),
    section: 'main',
  },
  {
    id: 'copilot',
    label: 'Legal Copilot',
    href: '/copilot',
    icon: markRaw(MessageSquare),
    section: 'ai',
  },
  {
    id: 'research',
    label: 'Research',
    href: '/research',
    icon: markRaw(Search),
    section: 'ai',
  },
  {
    id: 'drafting',
    label: 'Drafting',
    href: '/drafting',
    icon: markRaw(FileEdit),
    section: 'ai',
  },
  {
    id: 'case-analyzer',
    label: 'Case Analyzer',
    href: '/case-analyzer',
    icon: markRaw(Scale),
    section: 'ai',
  },
  {
    id: 'probability',
    label: 'Probability of Winning',
    href: '/probability',
    icon: markRaw(TrendingUp),
    section: 'ai',
  },
  {
    id: 'evidence',
    label: 'Evidence Analyzer',
    href: '/evidence',
    icon: markRaw(FileSearch),
    section: 'ai',
  },
  {
    id: 'contract-review',
    label: 'Contract Review',
    href: '/contract-review',
    icon: markRaw(FileCheck),
    section: 'ai',
  },
  {
    id: 'cross-examination',
    label: 'Cross Examination',
    href: '/cross-examination',
    icon: markRaw(HelpCircle),
    section: 'ai',
  },
  {
    id: 'litigation',
    label: 'Litigation Strategy',
    href: '/litigation',
    icon: markRaw(Sword),
    section: 'ai',
  },
  {
    id: 'negotiation',
    label: 'Negotiation Assistant',
    href: '/negotiation',
    icon: markRaw(Handshake),
    section: 'ai',
  },
  {
    id: 'timeline',
    label: 'Timeline Perkara',
    href: '/timeline',
    icon: markRaw(Calendar),
    section: 'management',
  },
  {
    id: 'court-intelligence',
    label: 'Court Intelligence',
    href: '/court-intelligence',
    icon: markRaw(Building2),
    section: 'intelligence',
  },
  {
    id: 'knowledge-graph',
    label: 'Knowledge Graph',
    href: '/knowledge-graph',
    icon: markRaw(Share2),
    section: 'intelligence',
  },
  {
    id: 'calculator',
    label: 'Legal Calculator',
    href: '/calculator',
    icon: markRaw(Calculator),
    section: 'tools',
  },
  {
    id: 'crm',
    label: 'Legal CRM',
    href: '/crm',
    icon: markRaw(Users),
    section: 'management',
  },
  {
    id: 'templates',
    label: 'Template',
    href: '/templates',
    icon: markRaw(FileText),
    section: 'tools',
  },
  {
    id: 'documents',
    label: 'Document Library',
    href: '/documents',
    icon: markRaw(FolderOpen),
    section: 'tools',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: markRaw(BarChart3),
    section: 'management',
  },
  {
    id: 'notifications',
    label: 'Notification',
    href: '/notifications',
    icon: markRaw(Bell),
    section: 'system',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: markRaw(Settings),
    section: 'system',
  },
  {
    id: 'admin-legal-database',
    label: 'Legal Database',
    href: '/admin/legal-database',
    icon: markRaw(Database),
    section: 'admin',
  },
] as const;

// Navigation sections for grouping
export const NAV_SECTIONS = {
  main: 'Utama',
  ai: 'AI Tools',
  management: 'Management',
  intelligence: 'Intelligence',
  tools: 'Tools',
  system: 'System',
  admin: 'Admin',
} as const;

// -----------------------------------------------------------------------------
// Application Metadata
// -----------------------------------------------------------------------------

export const APP_NAME = 'Legal OS';
export const APP_FULL_NAME = 'AI Legal Operating System';
export const APP_TAGLINE = 'One AI. Every Legal Workflow.';
export const APP_DESCRIPTION =
  'Platform AI terdepan untuk profesional hukum Indonesia. Otomatisasi riset, drafting, analisis perkara, dan manajemen klien dengan kecerdasan buatan.';

// -----------------------------------------------------------------------------
// Legal Source Types (for Research & Citations)
// -----------------------------------------------------------------------------

export const LEGAL_SOURCE_TYPES = [
  { id: 'uud', label: 'UUD 1945', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'uu', label: 'Undang-Undang', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'pp', label: 'Peraturan Pemerintah', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'perpres', label: 'Peraturan Presiden', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'permen', label: 'Peraturan Menteri', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'perda', label: 'Peraturan Daerah', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  { id: 'surat_edaran', label: 'Surat Edaran', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'putusan_ma', label: 'Putusan MA', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: 'putusan_mk', label: 'Putusan MK', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 'yurisprudensi', label: 'Yurisprudensi', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { id: 'doktrin', label: 'Doktrin', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: 'fatwa', label: 'Fatwa', color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400' },
  { id: 'jurnal', label: 'Jurnal Hukum', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
] as const;

// -----------------------------------------------------------------------------
// Document Types (for Drafting)
// -----------------------------------------------------------------------------

export const DOCUMENT_TYPES = [
  { id: 'gugatan', label: 'Gugatan', category: 'litigasi', icon: '⚖️' },
  { id: 'jawaban', label: 'Jawaban', category: 'litigasi', icon: '📝' },
  { id: 'replik', label: 'Replik', category: 'litigasi', icon: '📄' },
  { id: 'duplik', label: 'Duplik', category: 'litigasi', icon: '📋' },
  { id: 'kesimpulan', label: 'Kesimpulan', category: 'litigasi', icon: '📑' },
  { id: 'somasi', label: 'Somasi', category: 'pra-litigasi', icon: '✉️' },
  { id: 'legal_opinion', label: 'Legal Opinion', category: 'advisory', icon: '💼' },
  { id: 'kontrak', label: 'Kontrak', category: 'transaksional', icon: '📃' },
  { id: 'perjanjian', label: 'Perjanjian', category: 'transaksional', icon: '🤝' },
  { id: 'nda', label: 'NDA', category: 'transaksional', icon: '🔒' },
  { id: 'pks', label: 'PKS', category: 'transaksional', icon: '📜' },
  { id: 'surat_kuasa', label: 'Surat Kuasa', category: 'umum', icon: '🏛️' },
  { id: 'pkpu', label: 'PKPU', category: 'kepailitan', icon: '🏦' },
  { id: 'pailit', label: 'Pailit', category: 'kepailitan', icon: '⚠️' },
  { id: 'arbitrase', label: 'Arbitrase', category: 'penyelesaian-sengketa', icon: '🏳️' },
  { id: 'cerai', label: 'Cerai', category: 'keluarga', icon: '👨‍👩‍👦' },
  { id: 'phi', label: 'PHI', category: 'ketenagakerjaan', icon: '👷' },
  { id: 'perdata', label: 'Perdata', category: 'litigasi', icon: '📖' },
  { id: 'pidana', label: 'Pidana', category: 'litigasi', icon: '🔨' },
  { id: 'due_diligence', label: 'Due Diligence', category: 'korporasi', icon: '🔍' },
  { id: 'legal_memo', label: 'Legal Memo', category: 'advisory', icon: '📝' },
] as const;

// -----------------------------------------------------------------------------
// Calculator Types
// -----------------------------------------------------------------------------

export const CALCULATOR_TYPES = [
  { id: 'pesangon', label: 'Pesangon', icon: '💰', description: 'Hitung uang pesangon karyawan' },
  { id: 'upmk', label: 'UPMK', icon: '📊', description: 'Uang Penghargaan Masa Kerja' },
  { id: 'uph', label: 'UPH', icon: '💵', description: 'Uang Penggantian Hak' },
  { id: 'thr', label: 'THR', icon: '🎁', description: 'Tunjangan Hari Raya' },
  { id: 'bpjs', label: 'BPJS', icon: '🏥', description: 'Iuran BPJS Kesehatan & Ketenagakerjaan' },
  { id: 'pajak', label: 'Pajak', icon: '🧾', description: 'Perhitungan pajak penghasilan' },
  { id: 'waris', label: 'Waris', icon: '👨‍👩‍👧‍👦', description: 'Pembagian harta waris' },
  { id: 'denda', label: 'Denda', icon: '⚡', description: 'Perhitungan denda keterlambatan' },
  { id: 'bunga', label: 'Bunga', icon: '📈', description: 'Perhitungan bunga pinjaman' },
  { id: 'nilai_gugatan', label: 'Nilai Gugatan', icon: '⚖️', description: 'Estimasi nilai gugatan' },
  { id: 'kerugian', label: 'Kerugian', icon: '📉', description: 'Perhitungan kerugian materiil' },
  { id: 'ganti_rugi', label: 'Ganti Rugi', icon: '💳', description: 'Perhitungan ganti rugi' },
] as const;

// -----------------------------------------------------------------------------
// Pricing Plans
// -----------------------------------------------------------------------------

export const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic' as const,
    price: 499000,
    period: 'monthly' as const,
    isPopular: false,
    cta: 'Mulai Gratis',
    features: [
      'AI Legal Copilot (50 query/bulan)',
      'AI Research (100 pencarian/bulan)',
      'Drafting (10 dokumen/bulan)',
      'Legal Calculator',
      'Template Library',
      '5 GB Storage',
      'Email Support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tier: 'professional' as const,
    price: 1499000,
    period: 'monthly' as const,
    isPopular: true,
    cta: 'Coba 14 Hari Gratis',
    features: [
      'Semua fitur Basic',
      'AI Legal Copilot (Unlimited)',
      'AI Research (Unlimited)',
      'Drafting (Unlimited)',
      'Case Analyzer',
      'Probability of Winning',
      'Evidence Analyzer',
      'Contract Review',
      'Cross Examination',
      'Litigation Strategy',
      'Legal CRM',
      'Court Intelligence',
      'Knowledge Graph',
      '50 GB Storage',
      'Priority Support',
      'API Access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise' as const,
    price: 0,
    period: 'monthly' as const,
    isPopular: false,
    cta: 'Hubungi Sales',
    features: [
      'Semua fitur Professional',
      'Custom AI Training',
      'Dedicated Server',
      'SSO / SAML',
      'Unlimited Storage',
      'Custom Integration',
      'SLA 99.9%',
      'Dedicated Account Manager',
      'On-premise Option',
      'Audit & Compliance',
      'Team Management',
      'White Label',
    ],
  },
] as const;

// -----------------------------------------------------------------------------
// User Roles
// -----------------------------------------------------------------------------

export const USER_ROLES = [
  { id: 'advokat', label: 'Advokat', icon: '⚖️' },
  { id: 'firma_hukum', label: 'Firma Hukum', icon: '🏛️' },
  { id: 'corporate_legal', label: 'Corporate Legal', icon: '🏢' },
  { id: 'in_house_counsel', label: 'In House Counsel', icon: '👔' },
  { id: 'konsultan_hukum', label: 'Konsultan Hukum', icon: '💼' },
  { id: 'notaris', label: 'Notaris', icon: '📜' },
  { id: 'legal_officer', label: 'Legal Officer', icon: '👨‍💼' },
  { id: 'mahasiswa_hukum', label: 'Mahasiswa Hukum', icon: '🎓' },
  { id: 'dosen_hukum', label: 'Dosen Hukum', icon: '👨‍🏫' },
] as const;
