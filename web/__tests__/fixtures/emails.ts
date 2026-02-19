import { ClassifierInput, EventType } from '../../lib/classifier/types';

export interface TestFixture {
  name: string;
  input: ClassifierInput;
  expectedType: EventType;
  minConfidence: number;
  expectedCompany?: string;
  expectedPosition?: string;
  description: string;
}

function email(subject: string, body: string, sender = 'hr@example.com'): ClassifierInput {
  return { subject, body, sender };
}

// ─── APPLICATION_RECEIVED ─────────────────────────────────────────

export const APPLICATION_RECEIVED_FIXTURES: TestFixture[] = [
  {
    name: 'Greenhouse auto-confirmation',
    input: email(
      'Application Received - Software Engineer',
      'Thank you for applying to the Software Engineer role at Stripe. We have received your application and will review your qualifications.',
      'no-reply@greenhouse.io',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    expectedPosition: 'Software Engineer',
    description: 'Standard Greenhouse ATS confirmation email',
  },
  {
    name: 'Lever confirmation',
    input: email(
      'Your application for Product Manager at Notion',
      'We received your application for the Product Manager position. Our team is reviewing your resume and will be in touch.',
      'notifications@lever.co',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Notion',
    description: 'Lever ATS confirmation with position in subject',
  },
  {
    name: 'Generic ATS confirmation',
    input: email(
      'Application Confirmation',
      'Thank you for your interest in Google. Your application has been submitted successfully. We appreciate your interest and will review your qualifications.',
      'careers@google.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Google',
    description: 'Generic confirmation with company name in body',
  },
  {
    name: 'Workday style',
    input: email(
      'Application submitted successfully',
      'You have successfully submitted your application for the Data Scientist role at Amazon. We look forward to reviewing your application.',
      'donotreply@myworkdayjobs.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Amazon',
    description: 'Workday ATS with noreply sender',
  },
  {
    name: 'Minimal application confirmation',
    input: email(
      'Thank you for applying',
      'We appreciate your interest. Your application is under review.',
      'noreply@company.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.25,
    description: 'Short, minimal confirmation email',
  },
  {
    name: 'Application with review language',
    input: email(
      'We received your application',
      'Thank you for taking the time to apply for the Senior Backend Engineer position at Stripe. Your application is being reviewed by our hiring team.',
      'talent@stripe.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    description: 'Application being reviewed language',
  },
];

// ─── INTERVIEW_REQUEST ────────────────────────────────────────────

export const INTERVIEW_REQUEST_FIXTURES: TestFixture[] = [
  {
    name: 'Phone screen request',
    input: email(
      'Next Steps - Phone Screen',
      'We would like to schedule an interview with you. Please share your availability for the coming week.',
      'recruiter@company.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Standard phone screen scheduling request',
  },
  {
    name: 'Calendly style scheduling',
    input: email(
      'Schedule your interview',
      'Please select a time that works for you to speak with our hiring team. Book a time to speak about the role.',
      'hiring@startup.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Self-service scheduling link style',
  },
  {
    name: 'Formal interview invitation',
    input: email(
      'Interview Invitation - Data Analyst',
      'We invite you to interview for the Data Analyst position. Please provide your availability for next week.',
      'hr@bigcorp.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Formal invitation with position named',
  },
  {
    name: 'Casual startup outreach',
    input: email(
      'Quick chat about the engineering role?',
      'Would you be available for an introductory call? We would love to chat about the opportunity and like to set up a time.',
      'cto@startup.io',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Informal startup scheduling request',
  },
  {
    name: 'Moving forward to interview',
    input: email(
      'Next steps in your application',
      'We are excited to move forward with your application. We would like to schedule a call to discuss the next step in the interview process.',
      'talent@company.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Moving forward language with scheduling',
  },
];

// ─── INTERVIEW_SCHEDULED ─────────────────────────────────────────

export const INTERVIEW_SCHEDULED_FIXTURES: TestFixture[] = [
  {
    name: 'Google Meet interview',
    input: email(
      'Interview Confirmed - Jan 20 at 2pm',
      'Your interview is confirmed for Monday, January 20th at 2:00 PM EST. Google Meet join link: meet.google.com/abc-defg-hij. You will be meeting with Sarah Chen, Engineering Manager.',
      'scheduling@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Confirmed interview with Google Meet link',
  },
  {
    name: 'Zoom interview',
    input: email(
      'Interview Scheduled',
      'Your interview has been scheduled for Thursday, January 23rd at 10:00 AM. Zoom link: zoom.us/j/123456. Your interview panel includes the hiring manager and two team members.',
      'hr@techcorp.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Scheduled interview with Zoom link and panel info',
  },
  {
    name: 'On-site interview details',
    input: email(
      'Your upcoming interview',
      'Please arrive at our office at 123 Main St on Friday, February 7th at 9:00 AM. Interview details and agenda will follow. You will be meeting with the engineering team.',
      'recruiting@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'On-site interview with physical location',
  },
  {
    name: 'Calendar invite style',
    input: email(
      'Meeting confirmed: Technical Interview',
      'A calendar invite has been sent. Meeting has been scheduled for your technical interview. Interview agenda: system design discussion followed by coding exercise.',
      'calendar@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Calendar-invite confirmation format',
  },
];

// ─── ASSESSMENT ──────────────────────────────────────────────────

export const ASSESSMENT_FIXTURES: TestFixture[] = [
  {
    name: 'HackerRank assessment',
    input: email(
      'Complete your coding challenge',
      'Please complete the technical assessment on HackerRank. Assessment link: https://www.hackerrank.com/test/abc123. You have 72 hours to complete the coding challenge.',
      'assessments@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.5,
    description: 'HackerRank coding challenge with link and deadline',
  },
  {
    name: 'Take-home assignment',
    input: email(
      'Take-Home Assignment - Backend Engineer',
      'As the next step, please complete the following take-home assignment. You have one week to submit your work sample.',
      'hiring@startup.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Take-home with deadline',
  },
  {
    name: 'Codility timed test',
    input: email(
      'Online Assessment Invitation',
      'You have been invited to take a timed assessment on Codility. This is a skills test that should take approximately 90 minutes. Assessment deadline: February 15th.',
      'testing@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.5,
    description: 'Codility timed assessment with platform mention',
  },
  {
    name: 'System design exercise',
    input: email(
      'Technical Assessment - System Design',
      'Please prepare a system design exercise for your upcoming interview. We would like you to complete this exercise and present your work.',
      'engineering@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'System design exercise as assessment',
  },
  {
    name: 'Generic coding test',
    input: email(
      'Skills Assessment',
      'We would like you to complete a coding test to help us evaluate your technical abilities. Please complete the assessment at https://tests.example.com/assessment/12345.',
      'hr@techco.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Generic assessment with link',
  },
];

// ─── OFFER ───────────────────────────────────────────────────────

export const OFFER_FIXTURES: TestFixture[] = [
  {
    name: 'Formal offer letter',
    input: email(
      'Offer Letter - Software Engineer',
      'We are pleased to offer you the position of Software Engineer at Stripe. Your starting salary will be $180,000 with a signing bonus of $25,000. Please review and sign the attached offer letter.',
      'hr@stripe.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Stripe',
    description: 'Formal offer with salary and signing bonus',
  },
  {
    name: 'Startup offer with equity',
    input: email(
      'Welcome to the team!',
      'We are thrilled to offer you the role of Full Stack Developer. Your compensation package includes a base salary of $140,000 and equity grant of 0.1%. We are excited to welcome aboard a talented engineer.',
      'founders@startup.io',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Startup offer with equity package',
  },
  {
    name: 'Contingent offer',
    input: email(
      'Your Offer from Amazon',
      'We are delighted to extend a formal offer of employment for the Senior SDE position. This offer is contingent upon successful completion of a background check. Your start date is March 1st.',
      'recruiting@amazon.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Amazon',
    description: 'Contingent offer with background check requirement',
  },
  {
    name: 'Offer with benefits',
    input: email(
      'Congratulations!',
      'Pleased to inform you that we would like to extend an offer for the Engineering Manager position. Your benefits package includes health insurance, 401k matching, and stock options.',
      'hr@techcorp.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Offer highlighting benefits package',
  },
];

// ─── REJECTION ───────────────────────────────────────────────────

export const REJECTION_FIXTURES: TestFixture[] = [
  {
    name: 'Polite post-application rejection',
    input: email(
      'Update on your application',
      'Thank you for your interest in the Software Engineer role. After careful consideration, we have decided to pursue other candidates whose experience more closely aligns with our current needs. We wish you all the best.',
      'noreply@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Standard rejection after application review',
  },
  {
    name: 'Post-interview rejection',
    input: email(
      'Regarding your application at Google',
      'Thank you for taking the time to interview with us. Unfortunately, we have decided to move forward with other candidates. We appreciate your time and effort throughout the process.',
      'recruiting@google.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.5,
    expectedCompany: 'Google',
    description: 'Rejection after interview stage',
  },
  {
    name: 'Position filled',
    input: email(
      'Application Status Update',
      'We regret to inform you that the position has been filled. We will keep your resume on file and encourage you to apply again in the future.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.5,
    description: 'Position filled notification',
  },
  {
    name: 'Subtle rejection',
    input: email(
      'Your application to Notion',
      'After reviewing your application, we have chosen not to move forward. We encourage you to apply for future positions that match your skills.',
      'talent@notion.so',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Notion',
    description: 'Subtle language without "unfortunately"',
  },
  {
    name: 'Generic rejection',
    input: email(
      'Thank you for your interest',
      'We appreciate your time and effort. Unfortunately, we will not be moving forward with your candidacy at this time. We wish you all the best in your job search.',
      'noreply@bigcorp.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.5,
    description: 'Generic template rejection with multiple signals',
  },
  {
    name: 'Not selected rejection',
    input: email(
      'Application update',
      'After a competitive pool of applicants, you were not selected for the position. We encourage you to apply again and keep your resume on file.',
      'careers@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Competitive pool language rejection',
  },
];

// ─── RECRUITER_OUTREACH ──────────────────────────────────────────

export const RECRUITER_OUTREACH_FIXTURES: TestFixture[] = [
  {
    name: 'LinkedIn InMail',
    input: email(
      'Exciting opportunity at Stripe',
      'I came across your profile and was impressed by your background. I am recruiting for a Senior Engineer role that might interest you. Would you be open to exploring new opportunities?',
      'messages-noreply@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'LinkedIn recruiter message with domain match',
  },
  {
    name: 'Agency recruiter',
    input: email(
      'Your profile is a great match',
      'I represent a top-tier company that is hiring for a Lead Developer role. On behalf of my client, I am reaching out regarding a potential opportunity with competitive compensation.',
      'john@techrecruiting.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Third-party recruitment agency outreach',
  },
  {
    name: 'Internal talent team',
    input: email(
      'Reaching out regarding a role',
      'Our talent acquisition team thought of you for a Principal Engineer opportunity. Are you currently looking? I came across your profile and thought you would be a great match for this role.',
      'talent@amazon.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Internal talent acquisition outreach',
  },
  {
    name: 'Indeed recruiter message',
    input: email(
      'Role you might be interested in',
      'Based on your profile, we found an opportunity that might interest you. A company is hiring for a Senior Software Engineer with competitive compensation.',
      'notifications@indeed.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Indeed platform recruiter message',
  },
];

// ─── EDGE CASES ──────────────────────────────────────────────────

export const EDGE_CASE_FIXTURES: TestFixture[] = [
  {
    name: 'Rejection mentioning interview',
    input: email(
      'Thank you for interviewing',
      'Thank you for your interview last week. Unfortunately, we have decided to move forward with other candidates. We wish you all the best.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Should be REJECTION not INTERVIEW_SCHEDULED despite interview mention',
  },
  {
    name: 'Newsletter / job alert',
    input: email(
      'New jobs for you this week',
      'Based on your search, here are new Software Engineer jobs. Similar jobs in your area. Manage your notifications. Unsubscribe from job alerts.',
      'alerts@jobboard.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Job alert digest should be classified as OTHER',
  },
  {
    name: 'Forwarded interview email',
    input: email(
      'Fwd: Interview Scheduled',
      '---------- Forwarded message ---------- Your interview is confirmed for Monday at 2pm. Meeting has been scheduled. Join link: meet.google.com/abc.',
      'friend@gmail.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Forwarded email should be correctly classified after header stripping',
  },
  {
    name: 'Offer with "unfortunately" in negotiation',
    input: email(
      'Your Offer Details',
      'We are pleased to offer you the Software Engineer position. Unfortunately, we were unable to meet your requested salary, but we hope our offer of $150,000 base salary with signing bonus is acceptable. Please review and sign.',
      'hr@company.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Should be OFFER despite "unfortunately" appearing in salary negotiation context',
  },
  {
    name: 'Ambiguous subject, clear body',
    input: email(
      'Update on your application',
      'Great news! We would like to schedule an interview. Please share your availability for next week. We are excited to move forward.',
      'recruiter@company.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Vague subject but body clearly indicates interview request',
  },
  {
    name: 'Subject-only signal (empty body)',
    input: email(
      'Application Received - Frontend Developer',
      '',
      'noreply@greenhouse.io',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.25,
    description: 'Subject alone should provide enough signal',
  },
  {
    name: 'Generic email with no job signals',
    input: email(
      'Hello',
      'Just checking in. Let me know if you have any questions about the project.',
      'colleague@company.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Non-job email should default to OTHER',
  },
  {
    name: 'Multiple assessment platforms',
    input: email(
      'Next Steps - Technical Assessment',
      'Please complete the HackerRank coding challenge at https://hackerrank.com/test/123. This is a timed assessment that includes a coding test.',
      'assessments@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.5,
    description: 'Multiple assessment signals should produce high confidence',
  },
  {
    name: 'Offer rescission (actually rejection)',
    input: email(
      'Update regarding your offer',
      'Unfortunately, due to restructuring, we are unable to proceed with the offer previously extended. We will not be extending the position at this time. We regret to inform you of this decision.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Rescinded offer should classify as REJECTION',
  },
  {
    name: 'Recruiter mentioning interview scheduling',
    input: email(
      'Exciting opportunity',
      'I am a recruiter and came across your profile. I am impressed by your background and thought of you for a Senior Engineer role. Would you be open to exploring new opportunities? I would love to chat.',
      'recruiter@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Recruiter domain + outreach language should win over interview language',
  },
];
