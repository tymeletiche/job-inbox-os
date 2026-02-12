import { EventType } from '@prisma/client';

export interface ClassifierInput {
  subject: string;
  body: string;
  sender: string;
}

export interface ClassifierOutput {
  eventType: EventType;
  confidence: number;
  extractedData: {
    company?: string;
    position?: string;
    interviewDate?: string;
    location?: string;
    assessmentLink?: string;
  };
  rawMatches: string[];
}

interface EventPattern {
  keywords: string[];
  senderDomains?: string[];
  weight: number;
}

const EVENT_PATTERNS: Record<EventType, EventPattern> = {
  APPLICATION_RECEIVED: {
    keywords: [
      'application received',
      'received your application',
      'thank you for applying',
      'application confirmed',
      'submitted successfully',
    ],
    weight: 1.0,
  },
  INTERVIEW_REQUEST: {
    keywords: [
      'schedule an interview',
      'interview availability',
      'would you be available',
      'invite you to interview',
      'interview invitation',
    ],
    weight: 1.0,
  },
  INTERVIEW_SCHEDULED: {
    keywords: [
      'interview scheduled',
      'interview confirmed',
      'see you on',
      'meeting has been scheduled',
      'calendar invite',
    ],
    weight: 1.0,
  },
  ASSESSMENT: {
    keywords: [
      'coding challenge',
      'technical assessment',
      'complete the assessment',
      'take-home assignment',
      'hackerrank',
      'codility',
    ],
    weight: 1.0,
  },
  OFFER: {
    keywords: [
      'offer letter',
      'pleased to offer',
      'extend an offer',
      'compensation package',
      'offer of employment',
    ],
    weight: 1.0,
  },
  REJECTION: {
    keywords: [
      'unfortunately',
      'decided to move forward with other candidates',
      'not moving forward',
      'position has been filled',
      'will not be proceeding',
    ],
    weight: 1.0,
  },
  RECRUITER_OUTREACH: {
    keywords: [
      'recruiting',
      'opportunity that might interest you',
      'reaching out regarding',
      'potential opportunity',
      'interested in connecting',
    ],
    senderDomains: ['linkedin.com', 'indeed.com'],
    weight: 0.8,
  },
  OTHER: {
    keywords: [],
    weight: 0.0,
  },
};

const EXTRACTION_PATTERNS = {
  company: /(?:from|at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+team|\s+is|\.|\,)/,
  position: /(?:for the|position of|role of|as a)\s+([A-Z][A-Za-z\s]+?)(?:\s+position|\s+role|\.|\,)/,
  interviewDate: /(?:on|scheduled for)\s+([A-Z][a-z]+,?\s+[A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/,
  assessmentLink: /(https?:\/\/[^\s]+(?:hackerrank|codility|coderpad)[^\s]*)/,
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreEventType(
  normalizedText: string,
  eventType: EventType,
  sender: string
): { score: number; matches: string[] } {
  const pattern = EVENT_PATTERNS[eventType];
  const matches: string[] = [];
  let matchCount = 0;

  // Count keyword matches
  for (const keyword of pattern.keywords) {
    if (normalizedText.includes(keyword)) {
      matches.push(keyword);
      matchCount++;
    }
  }

  // Check sender domain
  let senderBonus = 0;
  if (pattern.senderDomains) {
    const senderDomain = sender.split('@')[1]?.toLowerCase() || '';
    if (pattern.senderDomains.some(domain => senderDomain.includes(domain))) {
      senderBonus = 0.2;
    }
  }

  // Calculate confidence
  let confidence = 0;
  if (matchCount >= 1) confidence = 0.3;
  if (matchCount >= 2) confidence = 0.6;
  if (matchCount >= 3) confidence = 0.9;
  confidence = Math.min(1.0, confidence + senderBonus);

  return { score: confidence * pattern.weight, matches };
}

function extractData(subject: string, body: string) {
  const combinedText = `${subject} ${body}`;
  const extractedData: ClassifierOutput['extractedData'] = {};

  // Extract company
  const companyMatch = combinedText.match(EXTRACTION_PATTERNS.company);
  if (companyMatch) {
    extractedData.company = companyMatch[1].trim();
  }

  // Extract position
  const positionMatch = combinedText.match(EXTRACTION_PATTERNS.position);
  if (positionMatch) {
    extractedData.position = positionMatch[1].trim();
  }

  // Extract interview date
  const dateMatch = combinedText.match(EXTRACTION_PATTERNS.interviewDate);
  if (dateMatch) {
    extractedData.interviewDate = dateMatch[1].trim();
  }

  // Extract assessment link
  const linkMatch = body.match(EXTRACTION_PATTERNS.assessmentLink);
  if (linkMatch) {
    extractedData.assessmentLink = linkMatch[1].trim();
  }

  return extractedData;
}

export function classifyEmail(input: ClassifierInput): ClassifierOutput {
  const normalizedText = normalizeText(`${input.subject} ${input.body}`);

  let bestEventType: EventType = 'OTHER';
  let bestScore = 0;
  let bestMatches: string[] = [];

  // Score each event type
  for (const eventType of Object.keys(EVENT_PATTERNS) as EventType[]) {
    if (eventType === 'OTHER') continue;

    const { score, matches } = scoreEventType(normalizedText, eventType, input.sender);

    if (score > bestScore) {
      bestScore = score;
      bestEventType = eventType;
      bestMatches = matches;
    }
  }

  // If confidence is too low, default to OTHER
  if (bestScore < 0.3) {
    bestEventType = 'OTHER';
    bestMatches = [];
  }

  // Extract structured data
  const extractedData = extractData(input.subject, input.body);

  return {
    eventType: bestEventType,
    confidence: bestScore,
    extractedData,
    rawMatches: bestMatches,
  };
}
