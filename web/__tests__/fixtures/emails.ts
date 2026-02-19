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
      'Your Offer - Engineering Manager',
      'Pleased to inform you that we would like to extend an offer for the Engineering Manager position. Your annual compensation includes a base salary of $195,000 and a signing bonus. We are excited to welcome aboard a talented leader.',
      'hr@techcorp.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Offer highlighting compensation details',
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
  // ── FALSE POSITIVE GUARDS ──
  {
    name: 'Generic work email (not job-related)',
    input: email(
      'Q1 Planning Meeting Notes',
      'Hi team, attached are the notes from our Q1 planning session. Please review the action items and let me know if you have any questions. The next sync is scheduled for Friday.',
      'manager@currentjob.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Internal work email should not be classified as a job event',
  },
  {
    name: 'Newsletter / job alert digest',
    input: email(
      '15 new Software Engineer jobs for you',
      'Based on your job search preferences, here are new jobs matching your criteria. Senior Engineer at Google, Staff Engineer at Meta. View all recommended jobs. Manage your notifications. Unsubscribe from job alerts.',
      'alerts@linkedin.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Job alert digest with unsubscribe should be OTHER not a specific event',
  },
  {
    name: 'Spam with congratulations',
    input: email(
      'Congratulations! You have been selected',
      'You have been selected for our exclusive program. Click here to claim your reward. This is a limited time offer. Act now!',
      'promo@sketchy-marketing.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Spam email should not be classified as a job offer',
  },
  {
    name: 'Personal email mentioning job search',
    input: email(
      'Dinner this weekend?',
      'Hey! Are you free Saturday? I know you have been interviewing at a few places. How is the job search going? Let me know if you want to grab dinner and catch up.',
      'friend@gmail.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Personal email should not trigger job classification',
  },
  {
    name: 'Internal HR benefits enrollment',
    input: email(
      'Benefits enrollment reminder',
      'This is a reminder that open enrollment for your benefits closes on March 1st. Please review your health insurance and 401k selections. Contact HR with questions.',
      'hr@currentemployer.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Internal HR email about benefits should not be classified as offer',
  },
];

// ─── NEW: APPLICATION_RECEIVED EXPANDED ─────────────────────────

export const APPLICATION_RECEIVED_EXPANDED: TestFixture[] = [
  {
    name: 'iCIMS confirmation',
    input: email(
      'Application Confirmation',
      'Thank you for applying to the Frontend Engineer position at Netflix. We have received your application and our recruiting team is reviewing your qualifications.',
      'no-reply@icims.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Netflix',
    description: 'iCIMS ATS confirmation email',
  },
  {
    name: 'Taleo acknowledgment',
    input: email(
      'Application Received',
      'Your application for the DevOps Engineer role at Oracle has been submitted successfully. We appreciate your interest and will review your application.',
      'do-not-reply@taleo.net',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Oracle',
    description: 'Taleo ATS acknowledgment',
  },
  {
    name: 'SmartRecruiters receipt',
    input: email(
      'We received your application',
      'Thank you for applying for the Product Designer role at Spotify. Your application is being reviewed by our hiring team.',
      'noreply@smartrecruiters.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Spotify',
    description: 'SmartRecruiters ATS receipt',
  },
  {
    name: 'BambooHR auto-reply',
    input: email(
      'Thank you for your interest',
      'We received your application for the QA Engineer position at Datadog. We look forward to reviewing your application and will be in touch.',
      'careers@bamboohr.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    description: 'BambooHR auto-reply confirmation',
  },
  {
    name: 'Ashby confirmation',
    input: email(
      'Your application for Staff Engineer at Figma',
      'Thank you for taking the time to apply for the Staff Engineer position. We have received your resume and will review your qualifications carefully.',
      'jobs@ashbyhq.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    description: 'Ashby ATS confirmation with position in subject',
  },
  {
    name: 'Jobvite receipt',
    input: email(
      'Application submitted successfully',
      'Your application has been submitted for the Mobile Developer role at Uber. We appreciate your interest and will review your application materials.',
      'no-reply@jobvite.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Uber',
    description: 'Jobvite ATS submission receipt',
  },
  {
    name: 'Resume received generic',
    input: email(
      'Application Confirmation',
      'We have received your resume for the Backend Engineer opening. Thank you for applying. Our team will review your qualifications and reach out if there is a match.',
      'hr@salesforce.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Salesforce',
    description: 'Generic resume received language',
  },
  {
    name: 'Portal submission confirmation',
    input: email(
      'Application Received - Cloud Architect',
      'You have successfully submitted your application for the Cloud Architect position at Microsoft. Your application is under review by our talent team.',
      'careers@microsoft.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Microsoft',
    description: 'Career portal submission confirmation',
  },
];

// ─── NEW: INTERVIEW_REQUEST EXPANDED ────────────────────────────

export const INTERVIEW_REQUEST_EXPANDED: TestFixture[] = [
  {
    name: 'Panel interview request',
    input: email(
      'Interview Invitation - Senior Developer',
      'We would like to invite you to interview with our engineering panel at Dropbox. Please share your availability for the next two weeks so we can schedule an interview.',
      'hr@dropbox.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Dropbox',
    description: 'Panel interview scheduling request',
  },
  {
    name: 'Hiring manager direct reach-out',
    input: email(
      'Next steps in your application',
      'I reviewed your resume and would like to schedule a call to discuss the Engineering Manager opportunity. Please provide your availability for a 30-minute phone screen.',
      'hiring.manager@airbnb.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Hiring manager requesting phone screen',
  },
  {
    name: 'Calendly scheduling link',
    input: email(
      'Schedule your interview',
      'Thank you for applying. We would love to chat about the role. Please select a time that works for you using the link below to schedule an interview.',
      'talent@hubspot.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Calendly-style self-service scheduling',
  },
  {
    name: 'Technical screen invitation',
    input: email(
      'Interview Opportunity - Backend Engineer',
      'We are excited to move forward with your application for the Backend Engineer role. We would like to schedule an interview with our tech lead. When are you free this week?',
      'recruiting@shopify.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Technical screen with availability request',
  },
  {
    name: 'Video call scheduling',
    input: email(
      'Scheduling your interview',
      'We invite you to interview for the Data Engineer position. We would like to set up a time for a video call. What times work for you next week?',
      'hr@snowflake.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Video call interview scheduling request',
  },
  {
    name: 'Meet the team invitation',
    input: email(
      'Interview Invitation',
      'We would like to invite you to interview and meet the team. Please share your availability for an introductory call with our engineering group.',
      'people@confluent.io',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Meet the team interview invitation',
  },
  {
    name: 'Second-round request',
    input: email(
      'Next Steps - Second Interview',
      'We enjoyed speaking with you and would like to move you forward to the interview stage. Please provide your availability for next week so we can schedule an interview.',
      'talent@plaid.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Second round interview scheduling',
  },
  {
    name: 'Availability check from recruiter',
    input: email(
      'Interview request - Platform Engineer',
      'Would you be available for an initial call about the Platform Engineer role? We would like to schedule an interview at your earliest convenience.',
      'recruiting@twilio.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Recruiter availability check for interview',
  },
];

// ─── NEW: INTERVIEW_SCHEDULED EXPANDED ──────────────────────────

export const INTERVIEW_SCHEDULED_EXPANDED: TestFixture[] = [
  {
    name: 'Teams meeting confirmation',
    input: email(
      'Interview Confirmed',
      'Your interview has been scheduled for Wednesday, March 5th at 11:00 AM. Microsoft Teams meeting link will be sent separately. You will be meeting with the VP of Engineering.',
      'scheduling@meta.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Teams meeting interview confirmation',
  },
  {
    name: 'On-site with full address',
    input: email(
      'Your upcoming interview',
      'Your interview is confirmed for Thursday, February 20th at 10:00 AM. Please arrive at our office at 350 5th Avenue, New York. Interview details: you will be meeting with three team members.',
      'hr@bloomberg.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    expectedCompany: 'Bloomberg',
    description: 'On-site interview with full street address',
  },
  {
    name: 'Multi-round day schedule',
    input: email(
      'Interview Scheduled - Full Day',
      'Your interview is confirmed for Monday, March 10th. Interview agenda: 9am system design, 10am coding, 11am behavioral, 12pm lunch with team. A calendar invite has been sent.',
      'recruiting@stripe.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    description: 'Full day multi-round interview schedule',
  },
  {
    name: 'Virtual panel with interviewers listed',
    input: email(
      'Interview Confirmed - Virtual Panel',
      'Your interview is confirmed for Tuesday at 2:00 PM. Google Meet join link: meet.google.com/xyz. Your interview panel includes Sarah (EM), Tom (SWE), and Lisa (PM).',
      'talent@databricks.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Virtual panel with named interviewers',
  },
  {
    name: 'Lunch interview',
    input: email(
      'Meeting confirmed: Lunch Interview',
      'Your interview has been scheduled. Please join us for a working lunch interview on Friday at 12:30 PM at our downtown office. You will be meeting with the CTO.',
      'ea@startup.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Lunch interview meeting confirmation',
  },
  {
    name: 'All-day onsite itinerary',
    input: email(
      'Your Interview Itinerary',
      'Your interview is confirmed for next Monday. Interview agenda: 9:00 AM arrival and badge pickup, 9:30 coding exercise, 10:30 system design, 12:00 lunch, 1:00 PM behavioral. Meeting has been scheduled.',
      'recruiting@google.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Google',
    description: 'Full onsite itinerary with multiple sessions',
  },
  {
    name: 'Calendar invite with Zoom',
    input: email(
      'Calendar invite: Technical Interview',
      'A calendar invite has been sent for your technical interview. Interview scheduled for Thursday at 3:00 PM EST. Zoom link: zoom.us/j/987654. Interview details below.',
      'hr@coinbase.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Calendar invite with Zoom link',
  },
  {
    name: 'Weekend interview slot',
    input: email(
      'Interview Confirmed - Saturday',
      'Your interview is confirmed for Saturday, March 15th at 10:00 AM. This will be a virtual interview. Join link: meet.google.com/sat-int. You will be meeting with the founding team.',
      'founder@earlystage.io',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Weekend interview confirmation',
  },
];

// ─── NEW: ASSESSMENT EXPANDED ───────────────────────────────────

export const ASSESSMENT_EXPANDED: TestFixture[] = [
  {
    name: 'CoderPad live session',
    input: email(
      'Technical Assessment - Live Coding',
      'You have been invited to a live coding session on CoderPad. Please complete the coding challenge with your interviewer. Assessment link: https://coderpad.io/session/abc.',
      'hiring@atlassian.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'CoderPad live coding assessment',
  },
  {
    name: 'Karat interview link',
    input: email(
      'Complete your coding challenge',
      'You have been invited to take a technical assessment through Karat. This is a timed assessment. Please complete the coding test at https://karat.com/interview/xyz.',
      'assessments@roblox.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Karat platform assessment invitation',
  },
  {
    name: 'TestGorilla invitation',
    input: email(
      'Skills Assessment Invitation',
      'Please complete your skills test on TestGorilla. This online assessment covers coding and problem solving. You have 72 hours to complete the assessment.',
      'hr@remote.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'TestGorilla skills assessment',
  },
  {
    name: 'Pair programming session',
    input: email(
      'Technical Assessment - Pair Programming',
      'As the next step, we have a pair programming exercise for you. Please complete this exercise with one of our engineers. This is a coding challenge.',
      'engineering@vercel.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Pair programming assessment exercise',
  },
  {
    name: 'Case study assignment',
    input: email(
      'Take-Home Assignment - Product Case Study',
      'Please complete the following take-home assignment. This is a case study where you will analyze and present your findings. You have one week to submit your work sample.',
      'recruiting@mckinsey.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Case study take-home assignment',
  },
  {
    name: 'Portfolio review request',
    input: email(
      'Technical Assessment - Portfolio Review',
      'As part of our technical assessment, please complete the following: share your portfolio and prepare to present a past project. This is a work sample review.',
      'talent@figma.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Portfolio review as technical assessment',
  },
  {
    name: 'Coderbyte challenge',
    input: email(
      'Online Assessment',
      'You have been invited to take a coding test on Coderbyte. This timed assessment should take approximately 60 minutes. Assessment link: https://coderbyte.com/sl-abc123.',
      'hr@lyft.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Coderbyte platform coding challenge',
  },
  {
    name: 'Design exercise',
    input: email(
      'Complete your assessment',
      'Please complete this system design exercise as part of your technical assessment. We would like you to complete this exercise and present your solution.',
      'hiring@pinterest.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'System design exercise assessment',
  },
];

// ─── NEW: OFFER EXPANDED ────────────────────────────────────────

export const OFFER_EXPANDED: TestFixture[] = [
  {
    name: 'Verbal-to-written confirmation',
    input: email(
      'Offer Letter - Senior Engineer',
      'Following our conversation, we are pleased to offer you the Senior Engineer position. Your compensation package includes a base salary of $175,000 and a signing bonus. Please review and sign the attached offer letter.',
      'hr@netflix.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Netflix',
    description: 'Verbal offer converted to written offer letter',
  },
  {
    name: 'Counter-offer response',
    input: email(
      'Your Offer - Updated Compensation',
      'We are pleased to extend an updated offer for the Staff Engineer position. Your revised annual compensation is $210,000 base salary with equity grant. We are excited to welcome aboard a talented engineer.',
      'hr@datadog.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Datadog',
    description: 'Counter-offer with updated compensation',
  },
  {
    name: 'Relocation package offer',
    input: email(
      'Offer of Employment - Relocation',
      'We are delighted to extend a formal offer of employment for the Principal Engineer role. Your starting salary is $200,000 with signing bonus. This offer includes a relocation package.',
      'talent@apple.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Apple',
    description: 'Offer with relocation package',
  },
  {
    name: 'Remote role offer',
    input: email(
      'Job Offer - Remote Software Engineer',
      'We are thrilled to offer you the Remote Software Engineer position. Your base salary of $165,000 with equity grant and signing bonus. Please review and sign the attached offer letter.',
      'people@gitlab.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Remote role job offer',
  },
  {
    name: 'Engineering manager offer',
    input: email(
      'Welcome to the team!',
      'We are pleased to offer you the Engineering Manager position. Your compensation package includes annual compensation of $190,000 and equity grant. We are excited to welcome aboard a talented leader.',
      'hr@square.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Engineering manager level offer',
  },
  {
    name: 'Government sector offer',
    input: email(
      'Offer of Employment',
      'We are pleased to inform you that you have been selected for the Software Developer position. Your annual compensation is set at GS-13 level. This is a formal offer of employment contingent upon background check.',
      'hr@agency.gov',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    description: 'Government sector formal offer',
  },
  {
    name: 'Contract-to-hire conversion',
    input: email(
      'Offer Letter - Full-Time Conversion',
      'We are delighted to extend a formal offer to convert your contract to full-time employment. Your base salary will be $155,000 with signing bonus. Please review and sign.',
      'hr@twitter.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Contract to full-time conversion offer',
  },
  {
    name: 'International offer with visa',
    input: email(
      'Your Offer from Shopify',
      'We are pleased to offer you the position of Backend Developer. Your starting salary will be CAD $145,000. This offer is contingent upon background check and work authorization. Welcome aboard.',
      'talent@shopify.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    expectedCompany: 'Shopify',
    description: 'International offer with visa sponsorship mention',
  },
];

// ─── NEW: REJECTION EXPANDED ────────────────────────────────────

export const REJECTION_EXPANDED: TestFixture[] = [
  {
    name: 'Post-phone-screen rejection',
    input: email(
      'Update on your application',
      'Thank you for taking the time to speak with us. After careful consideration, we have decided to pursue other candidates whose experience more closely aligns with our needs. We wish you all the best.',
      'recruiting@meta.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Rejection after phone screen',
  },
  {
    name: 'After final round rejection',
    input: email(
      'Regarding your application',
      'We appreciate your time and effort throughout the interview process. Unfortunately, we have decided to move forward with other candidates. We encourage you to apply again in the future.',
      'talent@airbnb.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Rejection after final round interviews',
  },
  {
    name: 'Position on hold',
    input: email(
      'Application Status Update',
      'We regret to inform you that the position you applied for has been put on hold. We will not be proceeding with candidates at this time. We will keep your resume on file.',
      'hr@lyft.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Position on hold effectively a rejection',
  },
  {
    name: 'After assessment rejection',
    input: email(
      'Your application status',
      'Thank you for completing the technical assessment. After careful consideration, we have decided not to move forward with your candidacy at this time. We wish you all the best.',
      'assessments@stripe.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Rejection after completing assessment',
  },
  {
    name: 'Talent pool addition',
    input: email(
      'Update on your application',
      'After reviewing your application, we will not be moving forward for this particular role. However, we will keep your resume on file and encourage you to apply for future positions.',
      'careers@uber.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Rejection with talent pool addition',
  },
  {
    name: 'Personalized feedback rejection',
    input: email(
      'Regarding your application at Databricks',
      'We have decided to move forward with other candidates. Unfortunately, while your skills are strong, we felt other candidates whose experience more closely aligns with our current team needs. We wish you all the best.',
      'recruiting@databricks.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    expectedCompany: 'Databricks',
    description: 'Rejection with personalized feedback',
  },
  {
    name: 'Automated ATS rejection',
    input: email(
      'Application update',
      'We have reviewed your application and unfortunately we are unable to offer you a position at this time. We appreciate your time and effort. We encourage you to apply again.',
      'no-reply@icims.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Automated ATS rejection email',
  },
  {
    name: 'Role eliminated rejection',
    input: email(
      'Your application status',
      'We regret to inform you that the role has been eliminated due to restructuring. We will not be extending the position. We appreciate your interest and wish you all the best in your job search.',
      'hr@coinbase.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Rejection due to role elimination',
  },
];

// ─── NEW: RECRUITER_OUTREACH EXPANDED ───────────────────────────

export const RECRUITER_OUTREACH_EXPANDED: TestFixture[] = [
  {
    name: 'Glassdoor message',
    input: email(
      'Exciting opportunity - Senior Backend Engineer',
      'I came across your profile and thought of you for a Senior Backend Engineer role. Would you be open to exploring new opportunities? This is a potential opportunity with competitive compensation.',
      'notifications@glassdoor.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Glassdoor recruiter domain message',
  },
  {
    name: 'Dice recruiter',
    input: email(
      'Role you might be interested in',
      'I am recruiting for a DevOps Lead position. I came across your profile and was impressed by your background. This is an exclusive opportunity with a top-tier company.',
      'recruiter@dice.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Dice platform recruiter outreach',
  },
  {
    name: 'Hired platform match',
    input: email(
      'Your profile is a great match',
      'Based on your profile, a company is interested in connecting with you for a Staff Engineer role. This opportunity that might interest you has competitive compensation.',
      'matches@hired.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Hired platform automated match',
  },
  {
    name: 'Cold email from personal address',
    input: email(
      'Exciting opportunity at a fast-growing startup',
      'I am a recruiter reaching out regarding a potential opportunity. I came across your profile and was impressed by your background. Would you be open to exploring new opportunities? I represent a top-tier company hiring for a Senior Engineer.',
      'sarah.jones@gmail.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Cold recruiter email from personal gmail',
  },
  {
    name: 'Internal mobility team',
    input: email(
      'Reaching out about an internal role',
      'Our talent acquisition team thought of you for an open position. I came across your profile in our system and thought you would be a great match for this role. Are you currently looking?',
      'internal-talent@google.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Internal mobility team outreach',
  },
  {
    name: 'Executive recruiter',
    input: email(
      'Confidential: VP Engineering opportunity',
      'I am recruiting for a confidential search for a VP of Engineering. On behalf of my client, I am reaching out regarding this exclusive opportunity. I was impressed by your background.',
      'partner@executivesearch.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Executive search firm outreach',
  },
  {
    name: 'Wellfound match',
    input: email(
      'A startup wants to connect with you',
      'Based on your profile, a startup is interested in you for an Engineering Lead role. This is a potential opportunity with competitive compensation and equity.',
      'notifications@wellfound.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Wellfound (AngelList) platform match',
  },
  {
    name: 'Staffing agency outreach',
    input: email(
      'Perfect fit for a new role',
      'I represent a top-tier company that is hiring for a Senior Developer position. On behalf of my client, I am reaching out regarding a potential opportunity. I came across your profile and thought you would be a great match.',
      'recruiter@staffingagency.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Staffing agency recruiter outreach',
  },
];

// ─── NEW: FALSE POSITIVE GUARDS ─────────────────────────────────

export const FALSE_POSITIVE_FIXTURES: TestFixture[] = [
  {
    name: 'SaaS product webinar invitation',
    input: email(
      'Join our upcoming webinar: Scaling Your Infrastructure',
      'You are invited to our upcoming webinar on scaling your cloud infrastructure. Register now for this free event. Learn from industry experts. Unsubscribe from marketing emails.',
      'marketing@cloudprovider.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Marketing webinar invite should not match any job type',
  },
  {
    name: 'Product update newsletter',
    input: email(
      'What is new in v4.0',
      'We are excited to announce new features in our latest release. Check out the dashboard improvements and API updates. Manage your notifications.',
      'updates@saasproduct.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'SaaS product update email should be OTHER',
  },
  {
    name: 'Conference invitation',
    input: email(
      'You are invited: TechConf 2026',
      'Join us at TechConf 2026 in San Francisco. Early bird tickets available now. Speakers include leaders from Google, Meta, and Amazon. Register today.',
      'events@techconf.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Tech conference invitation should not be classified as job event',
  },
  {
    name: 'E-commerce shipping notification',
    input: email(
      'Your order has shipped!',
      'Your order #12345 has been shipped and is on its way. Track your package at the link below. Estimated delivery: February 25th.',
      'shipping@store.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Shipping notification should be OTHER',
  },
  {
    name: 'Password reset email',
    input: email(
      'Password Reset Request',
      'We received a request to reset your password. If you did not make this request, please ignore this email. Click the link below to reset your password.',
      'security@service.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Password reset should not match any job type',
  },
  {
    name: 'Subscription renewal notice',
    input: email(
      'Your subscription is expiring',
      'Your annual subscription to Premium Plan is expiring on March 1st. Renew now to continue enjoying all features. Click here to manage your subscription.',
      'billing@subscription.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Subscription renewal should be OTHER',
  },
  {
    name: 'Internal all-hands meeting',
    input: email(
      'All Hands Meeting - Q1 Kickoff',
      'Please join us for the Q1 All Hands meeting this Friday at 3pm. We will cover company updates, team achievements, and goals for the quarter. Lunch will be provided.',
      'ceo@currentcompany.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Internal company meeting should not match any job event',
  },
  {
    name: 'Social media notification',
    input: email(
      'You have new followers',
      'You have 5 new followers on your profile this week. See who is viewing your posts and check out trending topics in your network.',
      'notifications@socialmedia.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Social media notification should be OTHER',
  },
  {
    name: 'Bank statement notification',
    input: email(
      'Your monthly statement is ready',
      'Your January statement is now available. Log in to view your account activity and balance. If you have any questions, contact our support team.',
      'statements@bank.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Banking notification should not match job events',
  },
  {
    name: 'Charity donation request',
    input: email(
      'Make a difference today',
      'Your generous donation can help change lives. We are a nonprofit working to provide education access to underserved communities. Donate now.',
      'outreach@charity.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Charity email should be OTHER',
  },
  {
    name: 'Customer survey request',
    input: email(
      'How was your experience?',
      'We would love your feedback. Please take a moment to complete our short survey about your recent interaction with our support team. Your feedback helps us improve.',
      'feedback@company.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Survey request should be OTHER',
  },
  {
    name: 'Real estate offer language',
    input: email(
      'New listing: Make an offer today',
      'Beautiful 3-bedroom home listed at $450,000. This property is move-in ready. Schedule a viewing today. Contact your agent for details.',
      'agent@realestate.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Real estate email using offer language should be OTHER',
  },
  {
    name: 'University application confirmation',
    input: email(
      'Application Received - Fall 2026',
      'Thank you for submitting your application to our graduate program. We have received your application materials and will review them carefully. Admissions decisions will be made by April.',
      'admissions@university.edu',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.25,
    description: 'University application uses same language - may classify as APPLICATION_RECEIVED',
  },
  {
    name: 'Government DMV notification',
    input: email(
      'Vehicle Registration Renewal',
      'Your vehicle registration expires on March 31, 2026. Please renew online or visit your local DMV office. Late renewals may incur additional fees.',
      'noreply@dmv.state.gov',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'DMV notification should be OTHER',
  },
  {
    name: 'Travel booking confirmation',
    input: email(
      'Booking Confirmed - Flight to San Francisco',
      'Your flight to San Francisco is confirmed for March 10th. Confirmation number: ABC123. Check in online 24 hours before departure.',
      'reservations@airline.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Travel booking should not match interview scheduled',
  },
  {
    name: 'Insurance quote email',
    input: email(
      'Your auto insurance quote is ready',
      'Based on your information, we have prepared a quote for your auto insurance policy. Your estimated premium is $150 per month. Contact us to finalize.',
      'quotes@insurance.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Insurance quote should be OTHER',
  },
  {
    name: 'Meetup event notification',
    input: email(
      'New event: JavaScript Developers Meetup',
      'A new event has been scheduled in your area. Join fellow developers for an evening of talks and networking. RSVP now. Light refreshments provided.',
      'noreply@meetup.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Meetup notification should not be interview scheduled',
  },
  {
    name: 'Internal hiring team discussion',
    input: email(
      'Re: Hiring update for Q2',
      'Team, here is the latest on our hiring pipeline. We have 15 open positions and 50 candidates in process. Please review the dashboard and provide feedback on your top picks.',
      'headofrecruiting@ourcompany.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Internal hiring discussion NOT addressed to candidate',
  },
  {
    name: 'Feature launch announcement',
    input: email(
      'Introducing our new AI features',
      'We are excited to announce our new AI-powered features. Try them today and see how they can boost your productivity. Learn more on our blog.',
      'announcements@techcompany.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Product feature launch should be OTHER',
  },
  {
    name: 'Promotion sale email',
    input: email(
      'Limited time offer: 50% off',
      'Do not miss our biggest sale of the year. Save 50% on all plans. This offer expires Friday. Upgrade now and save.',
      'deals@saas.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Sale email using offer language should be OTHER',
  },
];

// ─── NEW: EXPANDED EDGE CASES ───────────────────────────────────

export const EDGE_CASE_EXPANDED: TestFixture[] = [
  {
    name: 'Extremely short rejection',
    input: email(
      'Application update',
      'Unfortunately, we will not be moving forward.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.25,
    description: 'Very short email with clear rejection signal',
  },
  {
    name: 'Extremely long application confirmation',
    input: email(
      'Application Received',
      'Thank you for applying to our company. We have received your application and our team will review your qualifications. We appreciate your interest in joining our team. Our hiring process typically takes 2-4 weeks. During this time, your application will be reviewed by our talent acquisition team. If your experience aligns with our needs, we will reach out to schedule an initial conversation. In the meantime, you can learn more about our company on our website. We value diversity and inclusion and are committed to creating an equitable workplace. We offer competitive compensation, comprehensive benefits, and opportunities for growth. Our team is passionate about building great products and we are excited to review your application. Thank you again for your interest and we look forward to potentially working together. Your application is under review.',
      'careers@bigcorp.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    description: 'Very long email should still classify correctly',
  },
  {
    name: 'HTML artifacts in body',
    input: email(
      'Interview Scheduled',
      'Your interview has been scheduled for Monday at 10am. <br/><div style="font-family: Arial">Interview details will follow.</div> <p>You will be meeting with the hiring manager.</p> Meeting has been scheduled.',
      'hr@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'HTML tags in body should not prevent classification',
  },
  {
    name: 'Special characters in company: AT&T',
    input: email(
      'Application Received',
      'Thank you for applying to the Software Engineer role at AT&T. We have received your application and will review your qualifications.',
      'careers@att.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    description: 'Company name with ampersand should be handled',
  },
  {
    name: 'Personal gmail with clear job content',
    input: email(
      'Offer Letter - Data Scientist',
      'We are pleased to offer you the Data Scientist position. Your base salary will be $160,000 with equity grant and signing bonus. Please review and sign the attached offer letter.',
      'ceo@gmail.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    description: 'Job offer from personal gmail should still classify',
  },
  {
    name: 'Body-only with generic subject',
    input: email(
      'Hello',
      'We are pleased to offer you the position of Software Engineer. Your starting salary will be $170,000 with a signing bonus. This is a formal offer of employment. Please review and sign.',
      'hr@company.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Body signals should work even with generic subject',
  },
  {
    name: 'All-caps assessment email',
    input: email(
      'TECHNICAL ASSESSMENT',
      'PLEASE COMPLETE THE CODING CHALLENGE. THIS IS A TIMED ASSESSMENT. YOU HAVE 48 HOURS. COMPLETE THE ASSESSMENT AT THE LINK BELOW.',
      'hr@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'All-caps email should still match (case-insensitive)',
  },
  {
    name: 'Multiple companies mentioned',
    input: email(
      'Application Received',
      'Thank you for applying to the role at Stripe. We received your application. Note: We also partner with Google and Meta for referrals.',
      'careers@stripe.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Stripe',
    description: 'Should extract first/primary company when multiple mentioned',
  },
  {
    name: 'Forwarded chain with Fw: prefix',
    input: email(
      'Fw: Application Confirmation',
      'Begin forwarded message: Thank you for applying. We received your application and will review your qualifications.',
      'friend@outlook.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.25,
    description: 'Fw: prefix and forwarded header should be stripped',
  },
  {
    name: 'Duplicate content in body',
    input: email(
      'Interview Confirmed',
      'Your interview is confirmed for Monday at 2pm. Your interview is confirmed for Monday at 2pm. Meeting has been scheduled. Join link: zoom.us/j/123.',
      'scheduling@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Repeated content should still classify correctly (may boost confidence)',
  },
  {
    name: 'Just above threshold',
    input: email(
      'Update on your application',
      'Unfortunately we have decided not to move forward. We wish you all the best.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.25,
    description: 'Minimal signal but just enough to clear the 0.25 threshold',
  },
  {
    name: 'Just below threshold - generic',
    input: email(
      'Quick update',
      'Here is a brief update on the situation.',
      'person@company.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Not enough signal should default to OTHER',
  },
  {
    name: 'Reschedule request',
    input: email(
      'Interview Confirmed - New Time',
      'Your interview has been moved to a new time. Your interview is confirmed for Thursday at 3pm. Meeting has been scheduled. You will be meeting with the hiring team. Interview details below.',
      'hr@company.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Rescheduled interview still contains scheduled signals',
  },
  {
    name: 'Background check follow-up (not offer)',
    input: email(
      'Background Check Update',
      'Your background check has been completed successfully. Please contact us if you have any questions about the results.',
      'screening@hireright.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Background check update alone should not be classified as offer',
  },
  {
    name: 'Rejection email from ATS domain',
    input: email(
      'Application update',
      'After careful consideration, we have decided to move forward with other candidates. We wish you all the best in your job search. We encourage you to apply again.',
      'no-reply@greenhouse.io',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Rejection from ATS domain should still be REJECTION not APPLICATION_RECEIVED',
  },
  {
    name: 'Subject says offer, body says rejection',
    input: email(
      'Update regarding your offer',
      'Unfortunately, we regret to inform you that we must rescind the previously extended offer. We will not be moving forward at this time. We wish you all the best.',
      'hr@company.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Body rejection signals should override subject offer language',
  },
  {
    name: 'Assessment with interview language',
    input: email(
      'Technical Assessment for your interview',
      'As part of your interview process, please complete the following technical assessment. This is a coding challenge on HackerRank. You have been invited to take a timed assessment.',
      'hr@company.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Assessment keywords should win when both assessment and interview present',
  },
  {
    name: 'Empty subject with body signal',
    input: email(
      '',
      'We are pleased to offer you the Software Engineer position. Your starting salary will be $165,000. Please review and sign the offer letter.',
      'hr@company.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Empty subject should still classify from body signals',
  },
  {
    name: 'Position with slash in title',
    input: email(
      'Application Received',
      'Thank you for applying for the Frontend/Backend Engineer role at Vercel. We received your application.',
      'careers@vercel.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    description: 'Position with slash should be extractable',
  },
  {
    name: 'Auto-reply about interview',
    input: email(
      'Out of Office',
      'Thank you for your message. I am currently out of the office and will return on Monday. If this is regarding an interview, I will respond when I return.',
      'recruiter@company.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Out of office reply should be OTHER even if mentioning interview',
  },
];

// ─── NEW: ADDITIONAL COVERAGE ───────────────────────────────────

export const ADDITIONAL_FIXTURES: TestFixture[] = [
  // More APPLICATION_RECEIVED edge cases
  {
    name: 'Application from Rippling ATS',
    input: email(
      'Application Received - ML Engineer',
      'Thank you for applying for the ML Engineer position. We have received your application and our team will review your qualifications.',
      'no-reply@rippling.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    description: 'Rippling ATS domain application confirmation',
  },
  {
    name: 'Application with acknowledged receipt',
    input: email(
      'We received your application',
      'We have acknowledged receipt of your application for the Security Engineer position at Cloudflare. We will review your qualifications and get back to you.',
      'careers@cloudflare.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Cloudflare',
    description: 'Acknowledged receipt language',
  },
  // More INTERVIEW edge cases
  {
    name: 'Interview request with Goodtime scheduling',
    input: email(
      'Schedule your interview with Figma',
      'We would like to schedule an interview for the Design Engineer role. Please select a time that works for you. We are excited to move forward with your application.',
      'scheduling@goodtime.io',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Interview request via Goodtime scheduling tool',
  },
  {
    name: 'Final round interview scheduled',
    input: email(
      'Interview Confirmed - Final Round',
      'Your final round interview is confirmed for Wednesday, March 12th at 1:00 PM. Your interview panel includes the CTO and VP of Engineering. Meeting has been scheduled. Join link: zoom.us/j/final.',
      'recruiting@palantir.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    description: 'Final round interview with panel details',
  },
  // More ASSESSMENT
  {
    name: 'LeetCode style assessment',
    input: email(
      'Online Assessment Invitation',
      'Please complete the online assessment. This is a coding test that includes LeetCode-style problems. You have been invited to take a timed assessment. Complete the assessment within 48 hours.',
      'assessments@meta.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'LeetCode style online assessment from Meta',
  },
  {
    name: 'Qualified.io assessment',
    input: email(
      'Technical Assessment',
      'You have been invited to take a skills test on Qualified. Please complete the coding challenge at https://www.qualified.io/assess/abc123. This is a timed assessment.',
      'hiring@twitch.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Qualified.io platform assessment',
  },
  // More OFFER
  {
    name: 'Startup with only equity details',
    input: email(
      'Offer Letter - Founding Engineer',
      'We are pleased to offer you the Founding Engineer position. Your compensation package includes a base salary of $130,000 and equity grant of 0.5%. We are thrilled to offer you this role. Please review and sign.',
      'ceo@stealth-startup.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Early-stage startup offer with equity emphasis',
  },
  {
    name: 'Offer with deadline to respond',
    input: email(
      'Your Offer - Please Respond',
      'We are delighted to extend a formal offer for the Senior Backend Engineer position. Your starting salary is $185,000 with signing bonus. Please review and sign by March 1st.',
      'hr@snap.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.5,
    description: 'Offer letter with response deadline',
  },
  // More REJECTION
  {
    name: 'Ghosting follow-up rejection',
    input: email(
      'Regarding your application',
      'We apologize for the delay in getting back to you. After careful consideration, we have decided to pursue other candidates. We wish you all the best in your job search.',
      'talent@slack.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Late/delayed rejection after ghosting period',
  },
  {
    name: 'Encouragement-heavy rejection',
    input: email(
      'Your application status',
      'We were impressed by your background, however we will not be moving forward with your candidacy at this time. We encourage you to apply again when new positions open. We wish you all the best.',
      'careers@discord.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.4,
    description: 'Positive-tone rejection with encouragement',
  },
  // More RECRUITER
  {
    name: 'ZipRecruiter notification',
    input: email(
      'Role you might be interested in',
      'A company is looking for a Senior DevOps Engineer. Based on your profile, this opportunity that might interest you has competitive compensation. Would you be open to exploring new opportunities?',
      'alerts@ziprecruiter.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'ZipRecruiter platform automated match',
  },
  {
    name: 'Monster.com recruiter',
    input: email(
      'Your profile caught our attention',
      'I came across your profile on Monster and was impressed by your background. I am recruiting for a Full Stack Developer role. Would you be open to exploring new opportunities?',
      'recruiter@monster.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Monster.com platform recruiter outreach',
  },
  // More FALSE POSITIVES
  {
    name: 'Podcast invitation',
    input: email(
      'Invitation to be a guest on our podcast',
      'We would love to have you as a guest on our engineering podcast. We think your experience would be valuable to our listeners. Let us know if you are interested.',
      'host@techpodcast.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Podcast guest invitation should be OTHER',
  },
  {
    name: 'Open source contribution request',
    input: email(
      'Contributing to our project',
      'We noticed you have experience with TypeScript. We are looking for contributors to help with our open source project. Check out our GitHub repo for open issues.',
      'maintainer@opensource.dev',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Open source contribution request should be OTHER',
  },
  {
    name: 'Gym membership offer',
    input: email(
      'Special offer: Join today!',
      'Start the new year right with our special membership offer. Sign up today and get your first month free. Limited time only.',
      'sales@fitnesscenter.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Gym membership using offer language should be OTHER',
  },
  {
    name: 'Food delivery promotion',
    input: email(
      'Your order is confirmed',
      'Your delivery order has been confirmed and is being prepared. Estimated delivery time is 30-45 minutes. Track your order in the app.',
      'orders@fooddelivery.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Food delivery confirmation should be OTHER',
  },
  {
    name: 'Apartment application (not job)',
    input: email(
      'Application Received',
      'Thank you for submitting your rental application for unit 5B at 123 Oak Street. We will review your credit and references and get back to you within 48 hours.',
      'leasing@apartments.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.25,
    description: 'Rental application uses same language - may match APPLICATION_RECEIVED',
  },
  // More edge cases
  {
    name: 'Recruiter outreach from Otta platform',
    input: email(
      'Exciting opportunity for you',
      'A company on Otta is interested in your profile for a Platform Engineer role. This is a potential opportunity with competitive compensation. Would you be open to exploring new opportunities?',
      'matches@otta.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.4,
    description: 'Otta platform match notification',
  },
  {
    name: 'Dover sourcing outreach',
    input: email(
      'Reaching out about an opportunity',
      'I came across your profile and was impressed by your background. I am reaching out regarding a potential opportunity as a Senior Engineer. Would you be open to exploring new opportunities?',
      'sourcing@app.dover.io',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Dover ATS sourcing outreach',
  },
  {
    name: 'Rejection with "not the right fit"',
    input: email(
      'Application update',
      'After reviewing your background, we have determined that you are not the right fit for the current opening. We appreciate your interest and wish you all the best.',
      'hr@pinterest.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Not the right fit language rejection',
  },
  {
    name: 'Application from Breezy HR',
    input: email(
      'Application Received',
      'Thank you for applying to the Product Manager role. Your application has been submitted successfully. We look forward to reviewing your application.',
      'noreply@breezy.hr',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    description: 'Breezy HR ATS confirmation',
  },
  {
    name: 'Offer from noreply address',
    input: email(
      'Offer Letter',
      'We are pleased to offer you the position of Data Engineer. Your base salary will be $170,000 with equity grant and signing bonus. This is a formal offer. Please review and sign the attached offer letter.',
      'noreply@company.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    description: 'Offer letter from noreply address should still classify as OFFER',
  },
  {
    name: 'Assessment with deadline pattern',
    input: email(
      'Complete your assessment',
      'Please complete the technical assessment by Friday, March 7th. This is a coding test. Complete the assessment at the link provided. You have 3 days to submit.',
      'hr@robinhood.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Assessment with explicit deadline',
  },
  {
    name: 'WeWorkRemotely recruiter',
    input: email(
      'Exciting opportunity - Remote Engineer',
      'I came across your profile and thought you might be interested. A company is hiring for a Remote Senior Engineer with competitive compensation. Would you be open to exploring new opportunities?',
      'jobs@weworkremotely.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'WeWorkRemotely platform job match',
  },
];
