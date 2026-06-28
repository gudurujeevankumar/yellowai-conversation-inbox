// ═══════════════════════════════════════════════════════════════
// Yellow.ai Conversation Inbox — Core Type Definitions
// ═══════════════════════════════════════════════════════════════

// === Domain Enums ===

export type ConversationStatus = 'waiting' | 'assigned' | 'resolved';
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type SentimentLabel = 'angry' | 'frustrated' | 'neutral' | 'satisfied';
export type Channel = 'web' | 'whatsapp' | 'email' | 'voice';
export type CustomerTier = 'enterprise' | 'pro' | 'standard';
export type MessageRole = 'customer' | 'ai' | 'agent';

// === Core Interfaces ===

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: CustomerTier;
}

export interface AIHandoffContext {
  summary: string;
  failReason: string;
  attemptCount: number;
  lastIntent: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO 8601
}

export interface Conversation {
  id: string;
  customer: Customer;
  status: ConversationStatus;
  urgency: UrgencyLevel;
  sentiment: SentimentLabel;
  channel: Channel;
  subject: string;
  waitingSince: string; // ISO 8601
  assignedTo: string | null;
  aiContext: AIHandoffContext;
  messages: Message[];
  tags: string[];
}

// === Derived / UI State ===

export interface QueueStats {
  total: number;
  critical: number;
  avgWaitMinutes: number;
  unassigned: number;
}

export type ActionState =
  | { type: 'idle' }
  | { type: 'assigning' }
  | { type: 'assigned' }
  | { type: 'confirming-resolve' }
  | { type: 'resolving' }
  | { type: 'error'; action: 'assign' | 'resolve'; message: string };

export type SortOption = 'urgency' | 'waitTime' | 'newest';

export interface FilterTab {
  id: 'all' | 'unassigned' | 'mine' | 'critical';
  label: string;
  count: number;
}

// === API Response Types ===

export interface ApiError {
  error: string;
  message: string;
}

export interface AssignResponse {
  success: boolean;
}

export interface ResolveResponse {
  success: boolean;
}

// === Utility Types ===

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
