import { EventType, ALL_EVENT_TYPES, ScoringResult } from './types';
import { EVENT_PATTERNS } from './keywords';
import { isATSDomain, isRecruiterDomain, isNoreplyAddress } from './domains';

// Priority order for tie-breaking when scores are close
const PRIORITY: EventType[] = [
  'REJECTION',
  'OFFER',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_REQUEST',
  'ASSESSMENT',
  'APPLICATION_RECEIVED',
  'RECRUITER_OUTREACH',
  'OTHER',
];

const NEWSLETTER_SIGNALS: string[] = [
  'unsubscribe',
  'email preferences',
  'manage your notifications',
  'weekly digest',
  'job alert',
  'jobs matching your search',
  'new jobs for you',
  'recommended jobs',
  'similar jobs',
  'view in browser',
];

// Signals that the email is NOT about a job application/hiring process.
// Each match applies a -2.0 penalty to ALL event type scores.
const NON_JOB_CONTEXT_SIGNALS: string[] = [
  // Real estate & property
  'your property',
  'property at',
  'property assessment',
  'your home',
  'real estate',
  'closing costs',
  'mortgage',
  // Financial products
  'credit card',
  'store card',
  'redcard',
  'auto loan',
  'loan application',
  'apr',
  'financing at',
  'insurance claim',
  'insurance quote',
  'insurance policy',
  // Education (non-job)
  'fall semester',
  'spring semester',
  'admission',
  'admissions committee',
  'scholarship',
  'financial aid',
  'tuition',
  // Memberships & subscriptions
  'gym',
  'membership application',
  'fitness',
  // Volunteering
  'volunteer program',
  'volunteer position',
  'volunteer for',
  'volunteer opportunity',
  'volunteering',
  'habitat for humanity',
  'canvassing',
  // Pets & animals
  'dog adoption',
  'cat adoption',
  'pet adoption',
  'adopt',
  // Health & medical
  'health assessment',
  'health screening',
  'cognitive health',
  'annual health',
  'wellness',
  // E-commerce & sales
  'off everything',
  '% off',
  'expires at midnight',
  'promo code',
  'discount',
  'sale ends',
  'loyalty',
  // Podcasts & media
  'listen now',
  'new episode',
  'podcast',
  'this week\'s episode',
  // Coaching & workshops
  'mock interview',
  'career coaching',
  'coaching session',
  'interview techniques',
  'workshop',
  // Surveys & feedback
  'valued customer',
  'as a customer',
  'customer feedback',
  'feedback interview',
  'customer survey',
  // Apartment & rental
  'apartment',
  'unit ',
  'leasing',
  'rental',
  // Conferences & speaking
  'speaker',
  'speak at',
  'panel discussion',
  'conference',
  'register now',
  // Business deals (non-job)
  'acquire your',
  'acquire our',
  'business acquisition',
  'due diligence',
  'buy your',
  // Political
  'campaign',
  'canvassing',
  'political',
  // Freelance platforms
  'upwork',
  'freelance',
  'fiverr',
  'project opportunity',
];

export function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function stripForwardedHeaders(text: string): string {
  return text
    .replace(/^(?:fwd?|fw):\s*/gi, '')
    .replace(/-+\s*forwarded\s+message\s*-+/gi, '')
    .replace(/begin\s+forwarded\s+message:/gi, '');
}

export function isLikelyNewsletter(subject: string, body: string): boolean {
  const text = normalizeText(`${subject} ${body}`);
  const matchCount = NEWSLETTER_SIGNALS.filter((s) => text.includes(s)).length;
  return matchCount >= 2;
}

export function scoreEventType(
  subject: string,
  body: string,
  sender: string,
  eventType: EventType,
): ScoringResult {
  const pattern = EVENT_PATTERNS[eventType];
  const normalizedSubject = normalizeText(subject);
  const normalizedBody = normalizeText(body);
  const matches: string[] = [];
  let totalScore = 0;

  // Subject-specific keyword matches: weight = 2.0
  for (const keyword of pattern.subjectKeywords) {
    if (normalizedSubject.includes(keyword)) {
      totalScore += 2.0;
      matches.push(`[subject] ${keyword}`);
    }
  }

  // General keywords found in subject: weight = 1.5
  for (const keyword of pattern.keywords) {
    if (normalizedSubject.includes(keyword)) {
      totalScore += 1.5;
      matches.push(`[subject-general] ${keyword}`);
    }
  }

  // Body keyword matches: weight = 1.0
  for (const keyword of pattern.keywords) {
    if (normalizedBody.includes(keyword)) {
      totalScore += 1.0;
      matches.push(`[body] ${keyword}`);
    }
  }

  // Negative keyword penalty: -1.5
  if (pattern.negativeKeywords) {
    for (const keyword of pattern.negativeKeywords) {
      if (normalizedSubject.includes(keyword) || normalizedBody.includes(keyword)) {
        totalScore -= 1.5;
        matches.push(`[negative] ${keyword}`);
      }
    }
  }

  // Event-specific sender domain bonus: +2.0
  const senderDomain = sender.split('@')[1]?.toLowerCase() || '';
  if (pattern.senderDomains?.some((d) => senderDomain.includes(d))) {
    totalScore += 2.0;
    matches.push(`[domain] ${senderDomain}`);
  }

  // ATS domain bonus for non-recruiter types: +1.0
  if (eventType !== 'RECRUITER_OUTREACH' && isATSDomain(senderDomain)) {
    totalScore += 1.0;
    matches.push(`[ats-domain] ${senderDomain}`);
  }

  // Noreply bonus for APPLICATION_RECEIVED: +0.5
  if (eventType === 'APPLICATION_RECEIVED' && isNoreplyAddress(sender)) {
    totalScore += 0.5;
    matches.push(`[noreply] ${sender}`);
  }

  // Non-job context penalty: -3.0 per signal
  const fullText = normalizeText(`${subject} ${body}`);
  let nonJobHits = 0;
  for (const signal of NON_JOB_CONTEXT_SIGNALS) {
    if (fullText.includes(signal)) {
      nonJobHits++;
      totalScore -= 3.0;
      matches.push(`[non-job] ${signal}`);
    }
  }
  // Extra penalty when multiple non-job signals found: very likely not a job email
  if (nonJobHits >= 2) {
    totalScore -= 3.0;
    matches.push(`[non-job-multi] ${nonJobHits} signals`);
  }

  return { rawScore: Math.max(0, totalScore), matches };
}

export function rawScoreToConfidence(rawScore: number): number {
  if (rawScore <= 0) return 0;
  // Smooth exponential curve: approaches 0.95 asymptotically
  const confidence = 1 - Math.exp(-0.25 * rawScore);
  return Math.min(0.95, Math.round(confidence * 100) / 100);
}

export function resolveAmbiguity(
  scores: Record<EventType, ScoringResult>,
): EventType {
  const sorted = Object.entries(scores)
    .filter(([type]) => type !== 'OTHER')
    .filter(([, result]) => result.rawScore > 0)
    .sort(([, a], [, b]) => b.rawScore - a.rawScore);

  if (sorted.length === 0) return 'OTHER';
  if (sorted.length === 1) return sorted[0][0] as EventType;

  const [first, second] = sorted;
  const firstScore = first[1].rawScore;
  const secondScore = second[1].rawScore;

  // If top two are close (within 20%), use priority hierarchy
  if (secondScore > 0 && firstScore / secondScore < 1.2) {
    const firstPriority = PRIORITY.indexOf(first[0] as EventType);
    const secondPriority = PRIORITY.indexOf(second[0] as EventType);
    return (firstPriority <= secondPriority ? first[0] : second[0]) as EventType;
  }

  return first[0] as EventType;
}

export function scoreAllEventTypes(
  subject: string,
  body: string,
  sender: string,
): Record<EventType, ScoringResult> {
  const scores: Partial<Record<EventType, ScoringResult>> = {};

  for (const eventType of ALL_EVENT_TYPES) {
    if (eventType === 'OTHER') {
      scores[eventType] = { rawScore: 0, matches: [] };
      continue;
    }
    scores[eventType] = scoreEventType(subject, body, sender, eventType);
  }

  return scores as Record<EventType, ScoringResult>;
}
