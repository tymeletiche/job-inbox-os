const ATS_DOMAINS: string[] = [
  'greenhouse.io',
  'lever.co',
  'myworkdayjobs.com',
  'workday.com',
  'icims.com',
  'taleo.net',
  'oraclecloud.com',
  'bamboohr.com',
  'smartrecruiters.com',
  'jobvite.com',
  'ashbyhq.com',
  'breezy.hr',
  'recruitee.com',
  'jazz.co',
  'applytojob.com',
  'hire.lever.co',
  'boards.greenhouse.io',
  'jobs.lever.co',
  'app.dover.io',
  'wellfound.com',
  'rippling.com',
];

const RECRUITER_DOMAINS: string[] = [
  'linkedin.com',
  'indeed.com',
  'ziprecruiter.com',
  'glassdoor.com',
  'monster.com',
  'dice.com',
  'hired.com',
  'otta.com',
  'wellfound.com',
  'angel.co',
  'weworkremotely.com',
  'remoteok.com',
];

const NOREPLY_PREFIXES: string[] = [
  'noreply@',
  'no-reply@',
  'donotreply@',
  'do-not-reply@',
  'notifications@',
  'careers@',
  'recruiting@',
  'talent@',
  'hiring@',
  'jobs@',
  'hr@',
];

const GENERIC_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'live.com',
  'msn.com',
]);

export function isATSDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return ATS_DOMAINS.some((ats) => lower.includes(ats));
}

export function isRecruiterDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return RECRUITER_DOMAINS.some((rd) => lower.includes(rd));
}

export function isNoreplyAddress(email: string): boolean {
  const lower = email.toLowerCase();
  return NOREPLY_PREFIXES.some((p) => lower.includes(p));
}

export function extractCompanyFromDomain(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  if (GENERIC_DOMAINS.has(domain)) return null;
  if (isATSDomain(domain)) return null;
  if (isRecruiterDomain(domain)) return null;

  const parts = domain.split('.');
  const companyPart = parts.length >= 3 ? parts[parts.length - 2] : parts[0];
  return companyPart.charAt(0).toUpperCase() + companyPart.slice(1);
}
