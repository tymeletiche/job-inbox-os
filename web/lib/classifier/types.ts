export type EventType =
  | 'APPLICATION_RECEIVED'
  | 'INTERVIEW_REQUEST'
  | 'INTERVIEW_SCHEDULED'
  | 'ASSESSMENT'
  | 'OFFER'
  | 'REJECTION'
  | 'RECRUITER_OUTREACH'
  | 'OTHER';

export const ALL_EVENT_TYPES: EventType[] = [
  'APPLICATION_RECEIVED',
  'INTERVIEW_REQUEST',
  'INTERVIEW_SCHEDULED',
  'ASSESSMENT',
  'OFFER',
  'REJECTION',
  'RECRUITER_OUTREACH',
  'OTHER',
];

export interface ClassifierInput {
  subject: string;
  body: string;
  sender: string;
}

export interface ExtractedData {
  company?: string;
  position?: string;
  interviewDate?: string;
  location?: string;
  assessmentLink?: string;
  salary?: string;
  deadline?: string;
}

export interface ClassifierOutput {
  eventType: EventType;
  confidence: number;
  extractedData: ExtractedData;
  rawMatches: string[];
  allScores: Record<EventType, number>;
}

export interface EventPattern {
  keywords: string[];
  subjectKeywords: string[];
  senderDomains?: string[];
  negativeKeywords?: string[];
  weight: number;
}

export interface ScoringResult {
  rawScore: number;
  matches: string[];
}
