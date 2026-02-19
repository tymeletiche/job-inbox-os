import { ExtractedData } from './types';
import { extractCompanyFromDomain } from './domains';

const COMMON_WORDS = new Set([
  'the', 'our', 'your', 'this', 'that', 'their', 'these', 'those',
  'hello', 'dear', 'thanks', 'thank', 'please', 'best', 'regards',
  'hi', 'hey', 'good', 'great', 'team', 'all', 'we', 'you',
]);

// Words that should be stripped from the end of a captured company name
const TRAILING_NOISE_WORDS = new Set([
  'we', 'our', 'the', 'thank', 'please', 'your', 'this', 'that',
  'has', 'have', 'is', 'are', 'was', 'were', 'will', 'would',
  'could', 'should', 'may', 'can', 'shall', 'for', 'and', 'but',
  'or', 'to', 'in', 'on', 'at', 'by', 'as', 'if', 'so', 'of',
  'a', 'an', 'it', 'i', 'you', 'they', 'he', 'she', 'not',
  'after', 'before', 'with', 'from', 'about', 'into',
]);

function cleanCompanyName(name: string): string {
  const words = name.trim().split(/\s+/);
  // Strip common English words from the end
  while (words.length > 1 && TRAILING_NOISE_WORDS.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  return words.join(' ');
}

// Company extraction patterns — ordered by specificity
const COMPANY_PATTERNS: RegExp[] = [
  // "team at Google", "team at Amazon Web Services"
  /\bteam\s+at\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "on behalf of Google"
  /\bon\s+behalf\s+of\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "your application to Google" / "application at Google"
  /\bapplication\s+(?:to|at)\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "at Google", "at Amazon Web Services"
  /\bat\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "from Google", "from the Microsoft team"
  /\bfrom\s+(?:the\s+)?([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "with Google", "with Stripe Inc"
  /\bwith\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[,.:;]|\s+[a-z])/,
  // "Google is pleased to", "Amazon would like to"
  /\b([A-Z][A-Za-z0-9\s&.\-]{1,30}?)\s+(?:is pleased|would like|is excited|has reviewed|is delighted)/,
];

// Position extraction patterns
const POSITION_PATTERNS: RegExp[] = [
  // "for the Software Engineer role" / "to the Software Engineer role"
  /\b(?:for|to)\s+the\s+([A-Z][A-Za-z\s/\-]+?)(?:\s+(?:role|position|job|opening))/i,
  // "Software Engineer position at"
  /\b([A-Z][A-Za-z\s/\-]+?)\s+(?:role|position|job|opening)\s+(?:at|with)/i,
  // "role of Senior Data Scientist"
  /\brole\s+of\s+([A-Z][A-Za-z\s/\-]+?)(?:\s*[,.]|\s+(?:at|with|in))/i,
  // "position of Software Engineer"
  /\bposition\s+of\s+([A-Z][A-Za-z\s/\-]+?)(?:\s*[,.]|\s+(?:at|with|in))/i,
  // "position: Software Engineer"
  /\bposition:\s*([A-Za-z\s/\-]+?)(?:\s*[,.\n])/i,
  // "as a Software Engineer"
  /\bas\s+(?:a|an)\s+([A-Z][A-Za-z\s/\-]+?)(?:\s*[,.]|\s+(?:at|with|in|on|for))/i,
  // "your application for Software Engineer"
  /\bapplication\s+for\s+(?:the\s+)?([A-Z][A-Za-z\s/\-]+?)(?:\s*[,.]|\s+(?:at|with|has|was|is))/i,
  // "hiring a Senior Backend Developer"
  /\bhiring\s+(?:a|an)\s+([A-Z][A-Za-z\s/\-]+?)(?:\s*[,.]|\s+(?:to|for|who|in))/i,
  // Subject: "Software Engineer - Google" or "Software Engineer | Google"
  /^([A-Z][A-Za-z\s/\-]+?)\s*[-|–]\s*[A-Z]/,
];

// Date extraction patterns
const DATE_PATTERNS: RegExp[] = [
  // "scheduled for / confirmed for January 15th at 2pm"
  /\b(?:scheduled|confirmed)\s+for\s+(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+)?([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))?)/i,
  // "on Monday, January 15th" / "on January 15, 2026"
  /\bon\s+(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+)?([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i,
  // "confirmed for Monday at 2pm" (day name only)
  /\b(?:scheduled|confirmed)\s+for\s+((?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))?)/i,
  // "at 2:00 PM on January 15"
  /\bat\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))\s+on\s+([A-Z][a-z]+\s+\d{1,2})/i,
  // ISO: "2026-01-15"
  /\b(\d{4}-\d{2}-\d{2})\b/,
  // US format: "01/15/2026"
  /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/,
  // "this Thursday at 3pm"
  /\b(this\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?)/i,
  // "tomorrow at 10am"
  /\b(tomorrow(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?)/i,
];

// Assessment link patterns
const ASSESSMENT_LINK_PATTERNS: RegExp[] = [
  // Known platforms
  /(https?:\/\/[^\s]+(?:hackerrank|codility|coderpad|leetcode|qualified|devskiller|coderbyte|testgorilla|vervoe|adaface|mettl|imocha|karat)[^\s]*)/i,
  // Generic assessment/challenge links
  /(https?:\/\/[^\s]*(?:assessment|challenge|test|quiz|exercise)[^\s]*)/i,
];

// Salary patterns
const SALARY_PATTERNS: RegExp[] = [
  // "$120,000 - $160,000"
  /\$(\d{1,3}(?:,\d{3})*)\s*[-–]\s*\$(\d{1,3}(?:,\d{3})*)/,
  // "base salary of $150,000"
  /base\s+salary\s+(?:of\s+)?\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
  // "$150,000 per year"
  /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+(?:year|annum))?/,
  // "$150K"
  /\$(\d{2,3})[kK]\b/,
];

// Deadline patterns
const DEADLINE_PATTERNS: RegExp[] = [
  /\b(?:complete|submit|respond|reply)\s+(?:by|before|within)\s+([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i,
  /\bdeadline:?\s+([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i,
  /\byou\s+have\s+(\d+\s+(?:hours|days|weeks?))\b/i,
];

function extractCompany(subject: string, body: string, sender: string): string | null {
  const combinedText = `${subject} ${body}`;

  for (const pattern of COMPANY_PATTERNS) {
    const match = combinedText.match(pattern);
    if (match) {
      const name = cleanCompanyName(match[1].trim());
      if (name.length >= 2 && !COMMON_WORDS.has(name.toLowerCase())) {
        return name;
      }
    }
  }

  // Fallback: infer from sender domain
  return extractCompanyFromDomain(sender);
}

function extractPosition(subject: string, body: string): string | null {
  const combinedText = `${subject} ${body}`;

  for (const pattern of POSITION_PATTERNS) {
    const match = combinedText.match(pattern);
    if (match) {
      const name = match[1].trim();
      if (name.length >= 3 && !COMMON_WORDS.has(name.toLowerCase())) {
        return name;
      }
    }
  }
  return null;
}

function extractDate(subject: string, body: string): string | null {
  const combinedText = `${subject} ${body}`;

  for (const pattern of DATE_PATTERNS) {
    const match = combinedText.match(pattern);
    if (match) {
      // For the "at X on Y" pattern, combine the parts
      if (match[2]) {
        return `${match[2]} at ${match[1]}`.trim();
      }
      return match[1].trim();
    }
  }
  return null;
}

function extractAssessmentLink(body: string): string | null {
  for (const pattern of ASSESSMENT_LINK_PATTERNS) {
    const match = body.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function extractSalary(body: string): string | null {
  for (const pattern of SALARY_PATTERNS) {
    const match = body.match(pattern);
    if (match) {
      // Range format
      if (match[2]) {
        return `$${match[1]} - $${match[2]}`;
      }
      return match[0].trim();
    }
  }
  return null;
}

function extractDeadline(body: string): string | null {
  for (const pattern of DEADLINE_PATTERNS) {
    const match = body.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

export function extractData(subject: string, body: string, sender: string): ExtractedData {
  const data: ExtractedData = {};

  const company = extractCompany(subject, body, sender);
  if (company) data.company = company;

  const position = extractPosition(subject, body);
  if (position) data.position = position;

  const date = extractDate(subject, body);
  if (date) data.interviewDate = date;

  const link = extractAssessmentLink(body);
  if (link) data.assessmentLink = link;

  const salary = extractSalary(body);
  if (salary) data.salary = salary;

  const deadline = extractDeadline(body);
  if (deadline) data.deadline = deadline;

  return data;
}
