// =============================================================================
// AI Legal Operating System — Core Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// User & Authentication
// -----------------------------------------------------------------------------

export type UserRole =
  | 'advokat'
  | 'firma_hukum'
  | 'corporate_legal'
  | 'in_house_counsel'
  | 'konsultan_hukum'
  | 'notaris'
  | 'legal_officer'
  | 'mahasiswa_hukum'
  | 'dosen_hukum';

export type SubscriptionTier = 'basic' | 'professional' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organization?: string;
  subscription: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}

// -----------------------------------------------------------------------------
// Dashboard
// -----------------------------------------------------------------------------

export interface DashboardStats {
  activeCases: number;
  completedCases: number;
  successRate: number;
  totalClients: number;
  monthlyRevenue: number;
  annualRevenue: number;
  productivity: number;
  hoursWorked: number;
}

export interface UpcomingDeadline {
  id: string;
  caseId: string;
  caseName: string;
  type: 'sidang' | 'deadline' | 'meeting' | 'filing';
  date: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface RecentDocument {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AIActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  module: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// -----------------------------------------------------------------------------
// Cases
// -----------------------------------------------------------------------------

export type CaseStatus =
  | 'active'
  | 'pending'
  | 'mediation'
  | 'trial'
  | 'appeal'
  | 'cassation'
  | 'review'
  | 'closed'
  | 'won'
  | 'lost'
  | 'settled';

export type CaseType =
  | 'perdata'
  | 'pidana'
  | 'phi'
  | 'ptun'
  | 'arbitrase'
  | 'cerai'
  | 'pkpu'
  | 'pailit'
  | 'corporate';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  clientId: string;
  clientName: string;
  court: string;
  judge?: string;
  opponent?: string;
  opponentLawyer?: string;
  filingDate: string;
  nextHearing?: string;
  description: string;
  tags: string[];
  documents: string[];
  probability?: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Clients
// -----------------------------------------------------------------------------

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  type: 'individual' | 'corporate';
  cases: string[];
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Documents
// -----------------------------------------------------------------------------

export type DocumentType =
  | 'gugatan'
  | 'jawaban'
  | 'replik'
  | 'duplik'
  | 'kesimpulan'
  | 'somasi'
  | 'legal_opinion'
  | 'kontrak'
  | 'perjanjian'
  | 'nda'
  | 'pks'
  | 'surat_kuasa'
  | 'pkpu'
  | 'pailit'
  | 'legal_memo'
  | 'due_diligence'
  | 'template'
  | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  caseId?: string;
  clientId?: string;
  content?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  version: number;
  versions: DocumentVersion[];
  tags: string[];
  isFavorite: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
  changeNote?: string;
}

// -----------------------------------------------------------------------------
// AI Chat / Copilot
// -----------------------------------------------------------------------------

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  confidence?: number;
  attachments?: Attachment[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface Citation {
  id: string;
  type: 'uu' | 'pp' | 'perpres' | 'permen' | 'putusan' | 'yurisprudensi' | 'doktrin' | 'jurnal';
  title: string;
  reference: string;
  snippet: string;
  url?: string;
  relevanceScore: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// AI Legal Research
// -----------------------------------------------------------------------------

export type LegalSourceType =
  | 'uud'
  | 'uu'
  | 'pp'
  | 'perpres'
  | 'permen'
  | 'perda'
  | 'surat_edaran'
  | 'putusan_ma'
  | 'putusan_mk'
  | 'yurisprudensi'
  | 'doktrin'
  | 'fatwa'
  | 'jurnal';

export interface LegalSearchResult {
  id: string;
  type: LegalSourceType;
  title: string;
  reference: string;
  snippet: string;
  fullText?: string;
  relevanceScore: number;
  date?: string;
  articles?: string[];
  tags: string[];
}

// -----------------------------------------------------------------------------
// Case Analysis
// -----------------------------------------------------------------------------

export interface SWOTAnalysis {
  strengths: AnalysisPoint[];
  weaknesses: AnalysisPoint[];
  opportunities: AnalysisPoint[];
  threats: AnalysisPoint[];
}

export interface AnalysisPoint {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  relatedArticles?: string[];
}

export interface CaseAnalysis {
  id: string;
  caseId?: string;
  swot: SWOTAnalysis;
  timeline: TimelineEvent[];
  missingEvidence: string[];
  legalRisk: RiskAssessment;
  legalGaps: string[];
  recommendations: string[];
  overallScore: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Probability & Risk
// -----------------------------------------------------------------------------

export interface WinProbability {
  probability: number;
  confidence: number;
  reasons: ProbabilityFactor[];
  jurisprudence: Citation[];
  riskFactors: RiskFactor[];
}

export interface ProbabilityFactor {
  id: string;
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface RiskFactor {
  id: string;
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
}

// -----------------------------------------------------------------------------
// Evidence
// -----------------------------------------------------------------------------

export interface EvidenceAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  strength: number;
  validity: 'valid' | 'questionable' | 'invalid';
  potentialToBeRefuted: number;
  relatedArticles: string[];
  weaknesses: string[];
  recommendations: string[];
}

// -----------------------------------------------------------------------------
// Contract Review
// -----------------------------------------------------------------------------

export type ClauseType = 'missing' | 'risk' | 'unfair' | 'illegal' | 'good';

export interface ContractClause {
  id: string;
  type: ClauseType;
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  originalText?: string;
  suggestedText?: string;
}

export interface ContractReview {
  id: string;
  fileName: string;
  riskScore: number;
  clauses: ContractClause[];
  recommendations: string[];
  summary: string;
}

// -----------------------------------------------------------------------------
// Cross Examination
// -----------------------------------------------------------------------------

export type QuestionCategory = 'main' | 'cross' | 'trap' | 'clarification' | 'proof';

export interface ExaminationQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  purpose: string;
  followUp?: string;
  expectedAnswer?: string;
  order: number;
}

// -----------------------------------------------------------------------------
// Timeline & Calendar
// -----------------------------------------------------------------------------

export type TimelineEventType =
  | 'filing'
  | 'hearing'
  | 'mediation'
  | 'verdict'
  | 'appeal'
  | 'cassation'
  | 'review'
  | 'deadline'
  | 'meeting'
  | 'document'
  | 'other';

export interface TimelineEvent {
  id: string;
  caseId?: string;
  type: TimelineEventType;
  title: string;
  date: string;
  endDate?: string;
  description?: string;
  status: 'upcoming' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
}

// -----------------------------------------------------------------------------
// Court Intelligence
// -----------------------------------------------------------------------------

export interface JudgeProfile {
  id: string;
  name: string;
  court: string;
  position: string;
  specialization: string[];
  totalCases: number;
  avgDuration: number;
  stats: {
    won: number;
    lost: number;
    settled: number;
    dismissed: number;
  };
}

// -----------------------------------------------------------------------------
// Knowledge Graph
// -----------------------------------------------------------------------------

export interface GraphNode {
  id: string;
  type: 'law' | 'article' | 'decision' | 'doctrine' | 'regulation';
  label: string;
  data?: Record<string, string | number>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'references' | 'amends' | 'implements' | 'interprets' | 'overrules';
  label?: string;
}

// -----------------------------------------------------------------------------
// Legal Calculator
// -----------------------------------------------------------------------------

export type CalculatorType =
  | 'pesangon'
  | 'upmk'
  | 'uph'
  | 'thr'
  | 'bpjs'
  | 'pajak'
  | 'waris'
  | 'denda'
  | 'bunga'
  | 'nilai_gugatan'
  | 'kerugian'
  | 'ganti_rugi';

export interface CalculationResult {
  type: CalculatorType;
  inputs: Record<string, number | string>;
  result: number;
  breakdown: CalculationBreakdown[];
  legalBasis: string[];
}

export interface CalculationBreakdown {
  label: string;
  value: number;
  formula?: string;
}

// -----------------------------------------------------------------------------
// Billing & Subscription
// -----------------------------------------------------------------------------

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  cta: string;
}

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// Negotiation
// -----------------------------------------------------------------------------

export interface NegotiationPlan {
  batna: string;
  watna: string;
  anchor: string;
  opening: string;
  closing: string;
  counterOffers: string[];
  strategy: string[];
}

// -----------------------------------------------------------------------------
// Litigation Strategy
// -----------------------------------------------------------------------------

export type LitigationPhase =
  | 'somasi'
  | 'mediasi'
  | 'gugatan'
  | 'eksepsi'
  | 'provisi'
  | 'sita'
  | 'banding'
  | 'kasasi'
  | 'pk';

export interface StrategyRecommendation {
  phase: LitigationPhase;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  isRecommended: boolean;
}

// -----------------------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------------------

export interface AnalyticsData {
  period: string;
  aiUsage: ChartDataPoint[];
  caseOutcomes: ChartDataPoint[];
  revenue: ChartDataPoint[];
  productivity: ChartDataPoint[];
}
