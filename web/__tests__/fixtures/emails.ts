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
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'University admissions should be OTHER, not job APPLICATION_RECEIVED',
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
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Rental application should be OTHER, not job APPLICATION_RECEIVED',
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

// ─── ADVERSARIAL FIXTURES: REAL JOB EMAILS (should classify correctly) ──────

export const ADVERSARIAL_REAL_JOB_FIXTURES: TestFixture[] = [
  // APPLICATION_RECEIVED (5)
  {
    name: 'Minimal ATS confirmation',
    input: email(
      'Your application',
      'Hi, we received your application for the Data Analyst role. Our team is reviewing your qualifications and we will be in touch.',
      'noreply@company.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.2,
    description: 'Short confirmation with minimal keywords',
  },
  {
    name: 'Application via job board',
    input: email(
      'Application submitted successfully',
      'Your application for Backend Engineer at Datadog has been submitted successfully through our careers portal. You will receive updates as your application progresses.',
      'careers@datadog.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    description: 'Job board submission confirmation',
  },
  {
    name: 'Resume received acknowledgement',
    input: email(
      'We have received your resume',
      'Thank you for your interest in the Product Manager position at Notion. Your resume has been received and is being reviewed by our hiring team.',
      'hiring@notion.so',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    description: 'Resume receipt acknowledgement',
  },
  {
    name: 'Application under review',
    input: email(
      'Application status: received',
      'Your application for Senior Frontend Developer at Vercel is now under review. We appreciate your interest and will update you on the next steps.',
      'no-reply@vercel.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    description: 'Application status update - received',
  },
  {
    name: 'Thank you for applying',
    input: email(
      'Thank you for your interest',
      'Thank you for applying to the DevOps Engineer role at Cloudflare. We look forward to reviewing your application and will reach out if there is a fit.',
      'talent@cloudflare.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.2,
    description: 'Generic thank you for applying',
  },
  // INTERVIEW_REQUEST (4)
  {
    name: 'Casual phone screen request',
    input: email(
      'Next steps - Software Engineer',
      'Hi! We reviewed your application and would love to chat. Would you be available for a 30-minute phone screen this week? Please share your availability.',
      'recruiter@stripe.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Informal phone screen invitation',
  },
  {
    name: 'Hiring manager wants to talk',
    input: email(
      'Interview opportunity at Figma',
      'The hiring manager for the Design Engineer role would like to set up a time to speak with you. When are you free next week for a 45-minute conversation?',
      'talent@figma.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Hiring manager direct outreach',
  },
  {
    name: 'Moving to next round',
    input: email(
      'Next step in your application',
      'Congratulations! We are excited to move forward with your application for the ML Engineer position. We would like to schedule an interview with our technical team. Please provide your availability for the coming week.',
      'hr@anthropic.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Advancing to interview stage',
  },
  {
    name: 'Panel interview invitation',
    input: email(
      'Interview invitation - Senior SRE',
      'We invite you to interview for the Senior SRE role at Netflix. This will be a panel interview with three team members. Please share your availability for a 2-hour block.',
      'recruiting@netflix.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    description: 'Panel interview scheduling request',
  },
  // INTERVIEW_SCHEDULED (4)
  {
    name: 'Zoom meeting confirmed',
    input: email(
      'Interview confirmed - March 15',
      'Your interview for the Platform Engineer role has been confirmed for March 15 at 2:00 PM EST. Join link: https://zoom.us/j/123456. You will be meeting with Sarah Chen, Engineering Director.',
      'scheduling@airbnb.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Confirmed Zoom interview with details',
  },
  {
    name: 'On-site interview details',
    input: email(
      'Your upcoming interview at Apple',
      'Your interview is confirmed for Monday at 10 AM at Apple Park. Please arrive at the visitor center 15 minutes early. The interview will take place on the second floor. Your interview panel includes 4 engineers.',
      'hr@apple.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'On-site interview with logistics',
  },
  {
    name: 'Calendar invite with Teams link',
    input: email(
      'Meeting confirmed: Technical Interview',
      'A calendar invite has been sent for your technical interview on Thursday at 3 PM PST. Please join via Microsoft Teams meeting link below. Interview details and agenda are attached.',
      'noreply@microsoft.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Teams calendar invite for interview',
  },
  {
    name: 'Final round scheduled',
    input: email(
      'Interview scheduled - Final Round',
      'See you on Wednesday, March 20th at 11:00 AM for your final round interview. The meeting has been scheduled and you should receive a Google Meet link shortly. You will be meeting with the VP of Engineering.',
      'talent@shopify.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    description: 'Final round with confirmation details',
  },
  // ASSESSMENT (3)
  {
    name: 'HackerRank timed challenge',
    input: email(
      'Complete your coding challenge',
      'You have been invited to take a timed coding challenge on HackerRank for the Backend Engineer position at Uber. You have 72 hours to complete it. Assessment link: https://hackerrank.com/test/abc123',
      'assessments@uber.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'HackerRank with deadline',
  },
  {
    name: 'Take-home project',
    input: email(
      'Take-home assignment - Full Stack Engineer',
      'As the next step, please complete the following take-home assignment. Build a small REST API with the specifications attached. You have 5 days to submit. This is a coding test to evaluate your skills.',
      'hiring@plaid.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Take-home project with instructions',
  },
  {
    name: 'System design exercise',
    input: email(
      'Technical assessment - System Design',
      'Please complete this system design exercise as part of your interview process. You will have a pair programming session afterwards to discuss your approach. Assessment deadline: March 10th.',
      'talent@coinbase.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'System design assessment',
  },
  // OFFER (3)
  {
    name: 'Formal offer letter',
    input: email(
      'Offer of employment - Staff Engineer',
      'We are pleased to offer you the position of Staff Engineer at Databricks. Your starting salary will be $245,000 with an equity grant of 15,000 RSUs. Please review and sign the attached offer letter.',
      'hr@databricks.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Full formal offer with compensation',
  },
  {
    name: 'Verbal offer follow-up',
    input: email(
      'Your offer from Square',
      'Following our conversation, we are delighted to extend a formal offer for the iOS Engineer role. The compensation package includes a base salary of $190,000, a signing bonus of $25,000, and annual compensation reviews.',
      'people@squareup.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Written follow-up to verbal offer',
  },
  {
    name: 'Startup equity offer',
    input: email(
      'Welcome to the team!',
      'We are thrilled to offer you the role of Founding Engineer. Your offer includes equity grant of 0.5% and a base salary of $175K. This offer is contingent upon background check. Welcome aboard!',
      'founders@startup.io',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    description: 'Startup offer with equity',
  },
  // REJECTION (3)
  {
    name: 'Post-final-round rejection',
    input: email(
      'Update on your application',
      'After careful consideration following your final round interviews, we have decided to pursue other candidates for the Senior Engineer role. We appreciate your time and effort throughout the process and wish you all the best.',
      'recruiting@meta.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Rejection after final interviews',
  },
  {
    name: 'Position filled notification',
    input: email(
      'Regarding your application at Spotify',
      'Thank you for your interest in the Data Engineer position. Unfortunately, the position has been filled. We will keep your resume on file and encourage you to apply again in the future.',
      'careers@spotify.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Position already filled',
  },
  {
    name: 'Moved forward with others',
    input: email(
      'Your application status',
      'We wanted to let you know that after reviewing all candidates, we have decided to move forward with other candidates whose experience more closely matched our needs. We are unable to offer you a position at this time.',
      'hr@lyft.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    description: 'Generic moved forward with others',
  },
  // RECRUITER_OUTREACH (3)
  {
    name: 'LinkedIn recruiter InMail',
    input: email(
      'Exciting opportunity for you',
      'I came across your profile on LinkedIn and was impressed by your background in distributed systems. I represent a top-tier company looking for a Principal Engineer. Would you be open to exploring new opportunities? Competitive compensation offered.',
      'recruiter@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'LinkedIn InMail style outreach',
  },
  {
    name: 'Agency recruiter cold email',
    input: email(
      'Perfect fit for a role',
      'I am reaching out regarding a potential opportunity with one of my clients. They are hiring for a Staff Backend Engineer and I thought of you for this role. On behalf of my client, I would love to have a conversation about this.',
      'john@recruitingfirm.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Third-party agency recruiter',
  },
  {
    name: 'Internal recruiter from job board',
    input: email(
      'Your profile caught our attention',
      'Our talent acquisition team came across your profile on Indeed. We have a confidential search for a VP of Engineering role that could be a great match for you. Are you currently looking?',
      'talent@indeed.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Indeed-sourced recruiter outreach',
  },
];

// ─── ADVERSARIAL FIXTURES: TRICKY JUNK EMAILS (should classify as OTHER) ────

export const ADVERSARIAL_JUNK_FIXTURES: TestFixture[] = [
  {
    name: 'Webinar interview with leaders',
    input: email(
      'Interview with Industry Leaders - Live Webinar',
      'Join us for a live interview with top tech leaders discussing the future of AI. Register now for this exclusive panel discussion. Seats are limited. Unsubscribe from these emails.',
      'events@techconference.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Webinar using "interview" in non-job context',
  },
  {
    name: 'Career advice newsletter',
    input: email(
      '5 Tips to Ace Your Next Interview',
      'In this week\'s newsletter: How to prepare for your next interview, tips for negotiating your offer, and how to follow up after a phone screen. View in browser. Manage your notifications.',
      'newsletter@careercoach.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Newsletter about interviews, not an actual interview',
  },
  {
    name: 'Store credit card application',
    input: email(
      'Your application for a Target RedCard',
      'Your application for a Target RedCard store credit card has been received. We will review your application and notify you of our decision within 7-10 business days. Check your application status online.',
      'noreply@target.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Credit card application using "application received" language',
  },
  {
    name: 'Real estate offer',
    input: email(
      'Offer on your property at 123 Main St',
      'We are pleased to offer $450,000 for your property. This offer is contingent upon inspection. Please review and sign the attached offer letter. The compensation includes closing costs.',
      'agent@realestate.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Real estate offer mimicking job offer language',
  },
  {
    name: 'Property assessment notice',
    input: email(
      'Assessment of your property',
      'Your annual property assessment has been completed. The assessment deadline for appeals is March 15th. Please complete the assessment review form if you wish to contest the valuation.',
      'noreply@county.gov',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Property tax assessment using "assessment" and "deadline"',
  },
  {
    name: 'University application',
    input: email(
      'Application received - Fall 2026 Admission',
      'Thank you for your interest in our MBA program. We have received your application for Fall 2026 admission. Your application is under review by the admissions committee.',
      'admissions@stanford.edu',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'University admissions using job application language',
  },
  {
    name: 'Scholarship offer',
    input: email(
      'Scholarship offer from State University',
      'We are pleased to offer you a merit-based scholarship of $15,000 per year. This offer of employment... just kidding, this is an academic scholarship. Please review and sign by April 1st.',
      'finaid@stateuniversity.edu',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Scholarship using "pleased to offer" and "review and sign"',
  },
  {
    name: 'Gym membership application',
    input: email(
      'Your membership application has been received',
      'Thank you for applying to join FitLife Gym. Your application has been submitted successfully. We will review your application and schedule your assessment session within 48 hours.',
      'info@fitlifegym.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Gym membership using "application received" and "schedule assessment"',
  },
  {
    name: 'Podcast interview episode',
    input: email(
      'New episode: Interview with the CEO of TechCorp',
      'This week\'s episode features an exclusive interview with TechCorp CEO about the future of hiring. We scheduled this interview months ago. Listen now on all platforms.',
      'podcast@techpodcast.fm',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Podcast using "interview" and "scheduled"',
  },
  {
    name: 'Mock interview coaching',
    input: email(
      'Let\'s schedule your mock interview',
      'Your career coaching session is coming up. Let\'s schedule your mock interview for next week. We will also review your resume and discuss interview techniques. Please share your availability.',
      'coach@careerservices.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Career coaching with "schedule interview" and "availability"',
  },
  {
    name: 'Insurance claim assessment',
    input: email(
      'Assessment of your insurance claim',
      'We have completed the assessment of your auto insurance claim #12345. The claims assessment deadline for additional documentation is March 20th. Please complete the assessment review.',
      'claims@insurance.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Insurance using "assessment" and "deadline" heavily',
  },
  {
    name: 'Volunteer application',
    input: email(
      'Application received - Volunteer Program',
      'Thank you for applying to our volunteer program at Habitat for Humanity. We received your application and appreciate your interest. We will review your qualifications and be in touch.',
      'volunteer@habitat.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Volunteer program using exact job application language',
  },
  {
    name: 'Customer feedback interview',
    input: email(
      'We\'d like to schedule a call with you',
      'As a valued customer, we would like to schedule a 30-minute feedback interview. Would you be available this week? Please share your availability. We\'d love to chat about your experience.',
      'research@saasproduct.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Customer research using "schedule", "interview", "availability"',
  },
  {
    name: 'Auto loan offer approved',
    input: email(
      'Your offer has been approved',
      'Congratulations! Your auto loan application has been approved. We are pleased to offer you financing at 4.9% APR. This offer is valid for 30 days. Please review and sign the agreement.',
      'loans@autofinance.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Auto loan using "offer approved", "pleased to offer", "review and sign"',
  },
  {
    name: 'Interview skills workshop',
    input: email(
      'Interview Techniques Workshop - Register Now',
      'Master your interview skills at our upcoming workshop. Practice with mock panel interviews, phone screen simulations, and learn to negotiate your offer. Free for members. Unsubscribe.',
      'events@professionaldev.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Workshop about interviews, not an actual interview invitation',
  },
  {
    name: 'Internal hiring newsletter',
    input: email(
      'New openings in Engineering',
      'The Engineering team is hiring for 5 new positions. If you know anyone who would be a great match, please refer them. We are excited to move forward with growing the team. Manage your notifications.',
      'internal@myemployer.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Internal company newsletter about hiring, not addressed to candidate',
  },
  {
    name: 'Political volunteer outreach',
    input: email(
      'Reaching out regarding an exciting opportunity',
      'We are reaching out regarding an exciting opportunity to volunteer for the upcoming campaign. Your profile caught our attention and we think you would be a perfect fit for our canvassing team.',
      'outreach@campaign2026.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Political campaign using recruiter language',
  },
  {
    name: 'Apartment application received',
    input: email(
      'Application received for Unit 4B',
      'We have received your application for the apartment at 555 Oak Street, Unit 4B. Your application is under review. We will be in touch with next steps after reviewing your qualifications.',
      'leasing@apartments.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Apartment rental using "application received" and "under review"',
  },
  {
    name: 'Offer expires sale email',
    input: email(
      'This offer expires at midnight!',
      'Don\'t miss out! This exclusive offer ends tonight. We are thrilled to offer you 40% off everything. Compensation for your loyalty: extra 10% off with code LOYAL. Welcome aboard the savings train!',
      'deals@retailstore.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'E-commerce sale using "offer", "thrilled to offer", "welcome aboard"',
  },
  {
    name: 'Health screening assessment',
    input: email(
      'Schedule your health assessment',
      'It\'s time for your annual health assessment. Please complete the online assessment at the link below. You have 14 days to complete this assessment. Skills test for cognitive health included.',
      'wellness@healthplan.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Health screening using "assessment", "complete", "skills test"',
  },
  {
    name: 'Conference speaker invitation',
    input: email(
      'Invitation to speak at TechSummit 2026',
      'We would like to invite you to a panel discussion at TechSummit 2026. We came across your profile and were impressed by your background. Would you be open to exploring this opportunity?',
      'speakers@techsummit.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Speaker invitation using recruiter outreach language',
  },
  {
    name: 'Pet adoption application',
    input: email(
      'Application submitted - Dog Adoption',
      'Thank you for submitting your application to adopt Max. Your application has been submitted successfully and is being reviewed. We look forward to reviewing your application.',
      'adoptions@shelter.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Pet adoption using "application submitted" heavily',
  },
  {
    name: 'Offer to buy your business',
    input: email(
      'Offer to acquire your company',
      'We are pleased to offer to acquire your SaaS business. The compensation package includes $2M upfront plus an equity grant in the parent company. Contingent upon due diligence. Please review and sign.',
      'deals@acquirer.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Business acquisition using offer + compensation + equity language',
  },
  {
    name: 'Freelance platform notification',
    input: email(
      'New project opportunity matching your skills',
      'A client on Upwork is hiring for a project that matches your profile. This potential opportunity pays $150/hr. Would you be interested in connecting? Talent acquisition is competitive.',
      'notifications@upwork.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Freelance platform using recruiter and hiring language',
  },
  {
    name: 'Job search tips with interview language',
    input: email(
      'Your weekly job search update',
      'Here are 10 new jobs matching your search. Tips for this week: how to schedule an interview, what to do when you receive your application confirmation, and how to negotiate an offer letter. View in browser. Unsubscribe.',
      'alerts@jobboard.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Job board newsletter stuffed with every event type keyword',
  },
];

// ─── STRESS BALANCED (50 tests, even split across categories) ─────

export const STRESS_BALANCED_FIXTURES: TestFixture[] = [
  // APPLICATION_RECEIVED × 7
  {
    name: 'SmartRecruiters auto-confirmation',
    input: email(
      'Application Received - Backend Engineer',
      'Thank you for applying to the Backend Engineer role at Shopify. We received your application and our recruiting team will review your qualifications shortly.',
      'noreply@smartrecruiters.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Shopify',
    description: 'SmartRecruiters ATS confirmation',
  },
  {
    name: 'iCIMS confirmation with position',
    input: email(
      'Your application for Senior Platform Engineer at Cloudflare',
      'Your application has been submitted. Thank you for your interest in the Senior Platform Engineer position at Cloudflare. We are reviewing your application and will be in touch.',
      'careers@icims.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Cloudflare',
    description: 'iCIMS ATS with company in body',
  },
  {
    name: 'Jobvite application confirmed',
    input: email(
      'Application Confirmation - Vercel',
      'Your application for the Frontend Engineer position has been confirmed. We appreciate your interest in Vercel and will review your qualifications carefully.',
      'jobs@jobvite.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Vercel',
    description: 'Jobvite ATS confirmation',
  },
  {
    name: 'BambooHR receipt',
    input: email(
      'Application Received',
      'Thank you for applying to Linear. Your application has been forwarded to the hiring team for review. We will be in touch regarding next steps.',
      'noreply@bamboohr.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Linear',
    description: 'BambooHR ATS with manual review note',
  },
  {
    name: 'Small company manual reply',
    input: email(
      'Thanks for your application',
      'Hi Tyler, thank you for applying to the Full Stack Engineer role at Retool. We have received your application and our team is reviewing your application this week. We appreciate your interest. Best, Morgan',
      'morgan@retool.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Retool',
    description: 'Manual HR reply from named person',
  },
  {
    name: 'Ashby ATS confirmation',
    input: email(
      'Application submitted successfully',
      'You have successfully submitted your application for the Software Engineer role at Ramp. We appreciate your interest and will review your qualifications.',
      'noreply@ashbyhq.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.4,
    expectedCompany: 'Ramp',
    description: 'Ashby ATS confirmation',
  },
  {
    name: 'Internal referral application',
    input: email(
      'Your application via employee referral',
      'Thank you for applying to Airtable through our employee referral program. Your application is under review. We will reach out with next steps soon.',
      'talent@airtable.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Airtable',
    description: 'Employee referral application',
  },

  // INTERVIEW_REQUEST × 7
  {
    name: 'Availability request from recruiter',
    input: email(
      'Next steps in your application',
      'Hi Tyler, we would like to schedule an interview with you for the Software Engineer role. Please share your availability for next week.',
      'recruiter@datadog.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Datadog',
    description: 'Availability request from known company',
  },
  {
    name: 'Set up a call',
    input: email(
      'Scheduling your interview',
      'We enjoyed reviewing your application and would like to set up a time for an initial call. What times work for you this week?',
      'recruiter@mongodb.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Mongodb',
    description: 'Initial call scheduling',
  },
  {
    name: 'Technical interview invitation',
    input: email(
      'Interview invitation - Technical round',
      'We would like to invite you to interview for the Backend Engineer position. Please share your availability for the technical round next week.',
      'recruiting@figma.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.4,
    expectedCompany: 'Figma',
    description: 'Technical interview invite',
  },
  {
    name: 'Panel interview scheduling',
    input: email(
      'Interview Request - Panel Round',
      'We are excited to move forward with your candidacy. We would like to schedule an interview with a panel of engineers. Please provide your availability.',
      'talent@anthropic.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.4,
    description: 'Panel interview coordination',
  },
  {
    name: '30-min chat request',
    input: email(
      'Would love to chat about your application',
      'Hi Tyler, we reviewed your application and would love to chat for 30 minutes. Please select a time that works for you next week.',
      'hiring@supabase.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Supabase',
    description: 'Informal 30-min chat request',
  },
  {
    name: 'Onsite interview invite',
    input: email(
      'Onsite Interview Invitation',
      'We would like to invite you to an onsite interview at our HQ. Please book a time to speak with our team. Looking forward to meeting you.',
      'careers@gitlab.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.4,
    expectedCompany: 'Gitlab',
    description: 'Onsite interview invite',
  },
  {
    name: 'Recruiter screen scheduling',
    input: email(
      'Phone screen for Senior Engineer role',
      'We would like to schedule a phone screen with you for the Senior Engineer position. Please share your availability for a 30 minute initial call.',
      'people@brex.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Brex',
    description: 'Recruiter phone screen request',
  },

  // INTERVIEW_SCHEDULED × 7
  {
    name: 'Zoom calendar invite',
    input: email(
      'Interview Confirmed: Tuesday 3pm',
      'Your interview is confirmed for Tuesday at 3pm PT. Zoom link: https://zoom.us/j/12345. Meeting has been scheduled. Interview details attached.',
      'calendar@stripe.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    description: 'Zoom confirmation with time',
  },
  {
    name: 'Google Meet confirmation',
    input: email(
      'Upcoming interview - Wednesday',
      'Your interview is confirmed for Wednesday, March 18th at 2pm. Google Meet link: https://meet.google.com/abc-defg-hij. Please join 5 minutes early.',
      'recruiting@notion.so',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Notion',
    description: 'Google Meet scheduled interview',
  },
  {
    name: 'Microsoft Teams scheduled',
    input: email(
      'Interview scheduled for Thursday',
      'Your interview is scheduled for Thursday at 10am. Microsoft Teams meeting link will be sent shortly. Interview agenda attached.',
      'hiring@github.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Github',
    description: 'Teams meeting scheduled',
  },
  {
    name: 'Onsite agenda',
    input: email(
      'Your interview on Monday',
      'Your interview is confirmed for Monday at 9am at our San Francisco office. Interview agenda: 9am System Design, 10:30am Coding, 12pm Lunch. You will be meeting with the engineering team.',
      'careers@plaid.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Plaid',
    description: 'Onsite with detailed agenda',
  },
  {
    name: 'Reschedule confirmation',
    input: email(
      'Meeting confirmed - new time',
      'Per your request, the interview has been moved. Your interview is confirmed for Friday at 1pm. Calendar invite sent. Zoom link included.',
      'people@discord.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Discord',
    description: 'Reschedule still confirms new slot',
  },
  {
    name: 'Interview details sent',
    input: email(
      'Calendar invite for your interview',
      'Calendar invite sent. The interview will take place on Tuesday at 11am via Zoom. Interview details: 45 minutes with the hiring manager followed by 45 minutes coding.',
      'talent@cloudflare.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Cloudflare',
    description: 'Interview details confirmation',
  },
  {
    name: 'Panel meeting Friday',
    input: email(
      'Your interview on Friday - Panel Round',
      'Your interview is confirmed for Friday at 2pm. You will be meeting with the following panel: Jane (EM), John (Staff), Kim (Director). Zoom link included.',
      'recruiting@discord.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.4,
    expectedCompany: 'Discord',
    description: 'Panel interview with names',
  },

  // ASSESSMENT × 7
  {
    name: 'HackerRank coding challenge',
    input: email(
      'Technical Assessment - Coding Challenge',
      'Please complete the coding challenge at https://www.hackerrank.com/test/xyz123. You have 72 hours to complete this timed assessment.',
      'assessments@hackerrank.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'HackerRank coding challenge',
  },
  {
    name: 'Codility take-home',
    input: email(
      'Take-home assignment',
      'Please complete the following coding test on Codility: https://app.codility.com/test/abc. Assessment deadline is in 7 days.',
      'noreply@codility.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    description: 'Codility take-home',
  },
  {
    name: 'Take-home project',
    input: email(
      'Coding Challenge - Take-home',
      'As part of our interview process, please complete the take-home assignment. You have been invited to take this exercise. The coding challenge link is in the attached PDF.',
      'careers@stripe.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    description: 'Company-native take-home',
  },
  {
    name: 'Product case study',
    input: email(
      'Skills Assessment - Case Study',
      'Please complete this case study for the Product Manager role. Complete the following case study and share your analysis within 1 week. Assessment deadline attached.',
      'recruiting@notion.so',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    expectedCompany: 'Notion',
    description: 'Product case study',
  },
  {
    name: 'System design exercise',
    input: email(
      'Technical Assessment - System Design',
      'Please complete the system design exercise. This is a timed assessment. Complete this exercise and share your approach via the assessment link.',
      'people@airbnb.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    expectedCompany: 'Airbnb',
    description: 'System design take-home',
  },
  {
    name: 'Leetcode online assessment',
    input: email(
      'Online Assessment Invite',
      'You have been invited to take an online assessment. Please complete the coding test on Leetcode. You have 48 hours to submit your solution.',
      'talent@coinbase.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    expectedCompany: 'Coinbase',
    description: 'Leetcode online assessment',
  },
  {
    name: 'Pair programming session',
    input: email(
      'Coding Challenge - Pair Programming',
      'We would like to invite you to a pair programming session. Please complete the coding test live with our engineer. This is a timed technical assessment.',
      'hiring@linear.app',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.4,
    expectedCompany: 'Linear',
    description: 'Pair programming session',
  },

  // OFFER × 6
  {
    name: 'Formal offer letter',
    input: email(
      'Offer Letter - Senior Engineer',
      'We are pleased to extend an offer for the Senior Engineer position. Please review and sign. Your base salary will be $180,000 with a signing bonus of $20,000.',
      'people@vercel.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Vercel',
    description: 'Formal offer with comp',
  },
  {
    name: 'Compensation package details',
    input: email(
      'Offer of Employment',
      'We are thrilled to offer you the position of Staff Engineer. Your compensation package includes a base salary of $220,000, an equity grant, and a signing bonus.',
      'talent@stripe.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Stripe',
    description: 'Full comp package',
  },
  {
    name: 'Verbal offer follow-up',
    input: email(
      'Your offer from Figma',
      'Following up on our conversation, we are pleased to offer you the Senior Product Designer role. Formal offer letter attached. Please review and sign.',
      'people@figma.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Figma',
    description: 'Verbal offer follow-up',
  },
  {
    name: 'Equity-heavy startup offer',
    input: email(
      'Offer Letter - Founding Engineer',
      'We would like to extend an offer for the Founding Engineer role. Your starting salary is $160,000 plus a significant equity grant. Please review the attached offer letter.',
      'ceo@seedstartup.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    description: 'Startup founding offer',
  },
  {
    name: 'Signing bonus notice',
    input: email(
      'Welcome to the team!',
      'We are thrilled to offer you the position at Ramp. Your base salary of $170,000 includes a $25,000 signing bonus. Contingent upon background check. Please review and sign.',
      'hr@ramp.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Ramp',
    description: 'Welcome with signing bonus',
  },
  {
    name: 'Offer extension deadline',
    input: email(
      'Offer Letter - Please Review',
      'Please find attached the formal offer for the Software Engineer role. We are pleased to inform you of your compensation package. Base salary $175,000. Please review and sign by Friday.',
      'recruiting@airtable.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Airtable',
    description: 'Offer with decision deadline',
  },

  // REJECTION × 6
  {
    name: 'Straightforward not moving forward',
    input: email(
      'Update on your application',
      'Thank you for your interest in our open position. Unfortunately, we have decided to move forward with other candidates at this time. We wish you all the best.',
      'recruiting@stripe.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Stripe',
    description: 'Canonical rejection',
  },
  {
    name: 'Position filled',
    input: email(
      'Your application status',
      'Thank you for applying. Unfortunately, the position has been filled. We encourage you to apply again in the future. Wish you success in your search.',
      'careers@mongodb.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Mongodb',
    description: 'Role filled',
  },
  {
    name: 'Not selected for further consideration',
    input: email(
      'Regarding your application',
      'After careful consideration, we regret to inform you that you have not been selected for further consideration. We appreciate your time and effort.',
      'people@datadog.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Datadog',
    description: 'After careful consideration',
  },
  {
    name: 'Role closed / eliminated',
    input: email(
      'Application Update - Senior Engineer',
      'Thank you for your interest in our open position. Unfortunately, this role has been closed and we will not be moving forward. We are unable to offer you the position at this time.',
      'talent@coinbase.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Coinbase',
    description: 'Role was closed',
  },
  {
    name: 'Not a fit currently',
    input: email(
      'Update on your application',
      'We appreciate your interest. After careful consideration, we have decided not to move forward at this time. You are not the right fit for this specific role.',
      'hiring@notion.so',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Notion',
    description: 'Gentle not-a-fit',
  },
  {
    name: 'Kept on file',
    input: email(
      'Application update from Brex',
      'Thank you for applying to Brex. Unfortunately, we will not be extending an offer at this time. We will keep your resume on file and encourage you to apply again.',
      'recruiting@brex.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Brex',
    description: 'Kept on file + re-apply',
  },

  // RECRUITER_OUTREACH × 6
  {
    name: 'LinkedIn cold message',
    input: email(
      'Your profile caught my eye',
      'I came across your profile on LinkedIn and was impressed by your background. Would you be open to exploring new opportunities? I represent a top-tier company hiring for senior roles.',
      'jen.recruiter@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'LinkedIn cold outreach',
  },
  {
    name: 'Agency recruiter',
    input: email(
      'Exciting opportunity - Senior Engineer',
      'I am reaching out on behalf of my client, a fast-growing fintech company. We have an exciting opportunity that might interest you. Competitive compensation and equity.',
      'alex@topstaffingfirm.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Agency recruiter outreach',
  },
  {
    name: 'Internal talent sourcing',
    input: email(
      'Reaching out about a role at Stripe',
      'Hi Tyler, I came across your profile and thought of you for a Senior Engineer role on our payments team. Would you be open to exploring this opportunity?',
      'sarah@stripe.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.2,
    expectedCompany: 'Stripe',
    description: 'Internal sourcing from known company',
  },
  {
    name: 'Boutique firm ping',
    input: email(
      'Opportunity at a top-tier company',
      'Hello, I am recruiting for a confidential search on behalf of my client. I represent a top-tier company looking for a Staff Engineer. Potential opportunity pays very competitively.',
      'partner@boutiquerecruiter.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Boutique / confidential search',
  },
  {
    name: 'Indeed recruiter message',
    input: email(
      'A role you might be interested in',
      'I saw your resume on Indeed and thought this potential opportunity could be a great match for you. Are you currently looking? Would you be open to a quick conversation?',
      'recruiter@indeed.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Indeed recruiter outreach',
  },
  {
    name: 'Passive candidate pitch',
    input: email(
      'Perfect fit for our Senior Engineer role',
      'I came across your LinkedIn profile. Your background looks like a great match for our Senior Engineer opening. Would you be open to exploring new opportunities? Happy to share more.',
      'talent@recruitingpartners.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Passive candidate pitch',
  },

  // OTHER × 4
  {
    name: 'Generic greeting from friend',
    input: email(
      'Hey, long time no chat',
      'Hope you are doing well! Want to grab dinner sometime next week? Let me know what works for you.',
      'friend@gmail.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Friendly non-career email',
  },
  {
    name: 'Package shipping notification',
    input: email(
      'Your order has shipped',
      'Your order #12345 has shipped and will arrive Thursday. Track your package at the link below.',
      'orders@amazon.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Shipping notification',
  },
  {
    name: 'Github notification',
    input: email(
      '[repo/project] New pull request opened',
      'A new pull request was opened on repo/project. View the diff and leave a review at the link below.',
      'notifications@github.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Github PR notification',
  },
  {
    name: 'Receipt for payment',
    input: email(
      'Your receipt from Stripe',
      'Thank you for your payment of $29.99. Your receipt is attached. This is an automated email, please do not reply.',
      'receipts@stripe.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Payment receipt (not job-related)',
  },
];

// ─── STRESS TRICKY (50 tests designed to trip weak parsers) ──────

export const STRESS_TRICKY_FIXTURES: TestFixture[] = [
  // ~10 real job with misleading/minimal surface cues
  {
    name: 'Gentle rejection without "unfortunately"',
    input: email(
      'Update on your application',
      'Thank you for the thoughtful conversations. After careful consideration, we have decided to pursue other candidates whose experience more closely aligns with this role. We wish you success.',
      'people@supabase.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Supabase',
    description: 'Rejection without unfortunately/regret',
  },
  {
    name: 'Minimal offer "welcome aboard"',
    input: email(
      'Welcome to the team',
      'Welcome aboard! We are thrilled to offer you the role. Formal offer letter attached with your starting salary and benefits. Please review and sign.',
      'people@replit.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Replit',
    description: 'Minimal welcome-aboard offer',
  },
  {
    name: 'Coffee chat phrased as interview request',
    input: email(
      'Would love to chat about your application',
      'Hi Tyler, we would love to chat with you about the Senior Engineer role. Please share your availability for a 30-minute conversation next week.',
      'hiring@recruiter.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.2,
    description: 'Coffee chat invite as interview request',
  },
  {
    name: 'Minimal scheduled: time + Zoom',
    input: email(
      'Your interview on Thursday',
      'Your interview is confirmed for Thursday at 2pm PT. Zoom link: https://zoom.us/j/999. Please join 5 minutes early. Interview details attached.',
      'calendar@supabase.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    expectedCompany: 'Supabase',
    description: 'Terse time + Zoom + details',
  },
  {
    name: 'Rejection after praise',
    input: email(
      'Regarding your application',
      'You impressed our team during the interview loop. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches this specific role. We encourage you to apply again.',
      'recruiting@airtable.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Airtable',
    description: 'Rejection wrapped in praise',
  },
  {
    name: 'Casual "got it" confirmation',
    input: email(
      'We got your application',
      'Got your application for the Engineer role at Fly. Thank you for applying. Your application is under review and we will be in touch.',
      'hello@fly.io',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.2,
    expectedCompany: 'Fly',
    description: 'Casual ack wording',
  },
  {
    name: 'Assessment as "quick exercise"',
    input: email(
      'Quick technical assessment',
      'As part of our process, please complete this exercise. The coding challenge should take about 90 minutes. This is a timed assessment.',
      'recruiting@anthropic.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    expectedCompany: 'Anthropic',
    description: 'Assessment described as quick exercise',
  },
  {
    name: 'Offer with soft comp mention',
    input: email(
      'Your offer from Linear',
      'We are pleased to offer you the Software Engineer position. Details on base salary and equity grant are in the attached offer letter. Please review and sign.',
      'people@linear.app',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Linear',
    description: 'Offer with light comp language',
  },
  {
    name: 'Rejection without regret/unfortunately',
    input: email(
      'Application update',
      'Thank you for your time. We have decided to pursue other candidates for this opportunity. We encourage you to apply again for future roles that match your background.',
      'careers@retool.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Retool',
    description: 'Decided-to-pursue rejection',
  },
  {
    name: 'Interview request without "interview" word',
    input: email(
      'Next steps in your application',
      'We would like to set up a time to speak about your application. Please share your availability for the initial call. When are you free next week?',
      'talent@figma.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Figma',
    description: 'Initial call request, no "interview" word',
  },

  // ~10 real job with keyword collision
  {
    name: 'Rejection that mentions next steps',
    input: email(
      'Update on your application',
      'Thank you for your interest in our open position. Unfortunately, we will not be moving forward. For your next steps, we encourage you to apply again for future openings. We wish you success.',
      'people@vercel.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Vercel',
    description: 'Rejection body contains "next steps"',
  },
  {
    name: 'Offer pending background check',
    input: email(
      'Offer of Employment - Contingent',
      'We are pleased to extend an offer for the Senior Engineer position. Your base salary is $190,000. This offer is contingent upon background check. Please review and sign.',
      'hr@datadog.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Datadog',
    description: 'Offer with contingency language',
  },
  {
    name: 'Interview request with "unfortunately" disclaimer',
    input: email(
      'Interview invitation',
      'We would like to invite you to interview. Unfortunately we cannot do Friday, but please share your availability for the rest of the week.',
      'recruiting@mongodb.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.2,
    expectedCompany: 'Mongodb',
    description: 'Interview invite with unfortunately for scheduling',
  },
  {
    name: 'Application confirmed that mentions interview',
    input: email(
      'Application Received',
      'Thank you for applying to the Engineer role at Notion. We received your application. If selected for interview, we will reach out to schedule. Your application is under review.',
      'careers@notion.so',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Notion',
    description: 'App confirmation that mentions interview',
  },
  {
    name: 'Assessment with "not a test" phrasing',
    input: email(
      'Coding Challenge',
      'We want you to have fun with this take-home assignment. While this is not a test of every skill, please complete the coding challenge at your own pace. You have 5 days.',
      'hiring@stripe.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    expectedCompany: 'Stripe',
    description: 'Assessment called "not a test"',
  },
  {
    name: 'Offer that mentions "no guarantees" for start date',
    input: email(
      'Offer Letter - Staff Engineer',
      'We are pleased to inform you of your offer. Base salary $210,000 plus equity grant. While no guarantees on exact start, we target the first of the month. Please review and sign.',
      'people@airbnb.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.4,
    expectedCompany: 'Airbnb',
    description: 'Offer body says "no guarantees"',
  },
  {
    name: 'Recruiter outreach with "offer" verb',
    input: email(
      'Exciting opportunity',
      'I came across your profile and wanted to reach out. I can offer context on a fast-growing startup. Would you be open to exploring this opportunity? I represent a top-tier company.',
      'recruiter@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Outreach uses "offer" verb contextually',
  },
  {
    name: 'Rejection that says "please apply again"',
    input: email(
      'Your application status',
      'Thank you for applying. Unfortunately, we will not be moving forward at this time. Please apply again for future openings. We wish you all the best.',
      'careers@plaid.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Plaid',
    description: 'Rejection + please apply again',
  },
  {
    name: 'Interview scheduled with generic subject',
    input: email(
      'Confirmed',
      'Your interview is confirmed for Monday at 10am. Google Meet link included. Interview details and agenda attached. You will be meeting with the team.',
      'scheduling@supabase.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    expectedCompany: 'Supabase',
    description: 'Generic subject but clear scheduled body',
  },
  {
    name: 'Application receipt mentions offer policy',
    input: email(
      'Application Confirmation',
      'Thank you for applying to Brex. Your application has been submitted. FYI: offer letters, if extended, include standard compensation and equity details. We will review your application.',
      'careers@brex.com',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Brex',
    description: 'App receipt mentions offer language in FAQ tone',
  },

  // ~10 junk (heavy job-keyword overlap, expected OTHER)
  {
    name: 'Podcast interview request',
    input: email(
      'Interview request - Dev Podcast',
      'Hi Tyler, we would love to invite you to interview on our podcast. Would you be available for a 45-minute conversation? This week\'s episode features engineers like you. Listen now.',
      'host@devpodcast.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Podcast interview = not job',
  },
  {
    name: 'Academic paper submission confirmation',
    input: email(
      'Submission Received - ICML Paper',
      'Your submission has been received. Thank you for your interest in submitting to ICML. Your application for conference inclusion is under review. The admissions committee will evaluate your paper.',
      'submissions@icml.cc',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Academic paper submission uses application language',
  },
  {
    name: 'Real estate offer on property',
    input: email(
      'Offer on your property',
      'We are pleased to offer you the compensation of $750,000 for your property. Closing costs are covered. Please review and sign the attached. Your home has been assessed.',
      'broker@realestate.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Real estate offer letter',
  },
  {
    name: 'Auto loan rejection',
    input: email(
      'Update on your loan application',
      'We regret to inform you that we are unable to offer you the requested auto loan at this time. Unfortunately, after careful consideration, your loan application has been declined. APR terms attached.',
      'loans@bigbank.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Loan rejection using job-rejection phrasing',
  },
  {
    name: 'Scholarship acceptance (not job offer)',
    input: email(
      'Congratulations - Scholarship Offer',
      'We are pleased to offer you a merit scholarship. Your financial aid package includes full tuition for the fall semester. The admissions committee has reviewed your application.',
      'financial-aid@university.edu',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Scholarship offer (tuition + admissions)',
  },
  {
    name: 'Grad school application received',
    input: email(
      'Your Application for Fall Admission',
      'Thank you for your interest in our graduate program. Your application has been received. The admissions committee will review your materials for fall semester enrollment.',
      'admissions@university.edu',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Grad school admissions application',
  },
  {
    name: 'Apartment lease application confirmed',
    input: email(
      'Rental Application Submitted',
      'Thank you for submitting your rental application for unit 4B. Your application has been received and is under review. Please allow 2 business days for our leasing team to respond.',
      'leasing@apartments.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Apartment application uses review language',
  },
  {
    name: 'Research study recruitment',
    input: email(
      'Invitation to participate - Research Study',
      'You may be a great match for our research study. We came across your profile. Would you be open to exploring participation? Competitive compensation for your time (customer feedback).',
      'recruit@researchlab.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Research study uses recruiter language',
  },
  {
    name: 'HOA board volunteer position',
    input: email(
      'Application for HOA Board',
      'Thank you for submitting your application for the HOA board volunteer position. Your application is under review. The volunteer opportunity requires a 1-year commitment.',
      'board@hoa.org',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'HOA volunteer position application',
  },
  {
    name: 'Gym membership "offer"',
    input: email(
      'Exclusive offer - Gym Membership',
      'We are pleased to offer you an exclusive membership application with no sign-up fee. Your fitness journey starts today. Promo code attached. 50% off everything for the first month.',
      'deals@gym.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Gym membership promo',
  },

  // ~10 subject/body conflict (body signal should dominate)
  {
    name: 'Subject "Update" + body clearly REJECTION',
    input: email(
      'Update',
      'Thank you for your interest in our open position. Unfortunately, after careful consideration, we have decided to move forward with other candidates. We wish you success in your job search.',
      'recruiting@coinbase.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.3,
    expectedCompany: 'Coinbase',
    description: 'Generic subject, clear rejection body',
  },
  {
    name: 'Subject "Your application" + body is OFFER',
    input: email(
      'Your application',
      'Good news — we are pleased to extend an offer for the Senior Engineer role. Your base salary is $195,000 plus an equity grant. Please review and sign the attached offer letter.',
      'people@ramp.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Ramp',
    description: 'Application-style subject, offer body',
  },
  {
    name: 'Subject "Following up" + body INTERVIEW_REQUEST',
    input: email(
      'Following up',
      'Following up on your application for the Engineer role. We would like to invite you to interview. Please share your availability for a phone screen next week.',
      'recruiting@brex.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Brex',
    description: 'Vague subject, clear interview ask',
  },
  {
    name: 'Subject "Quick question" + body ASSESSMENT',
    input: email(
      'Quick question',
      'Quick question — can you complete a coding challenge for our Senior Engineer role? The technical assessment is timed. Please complete the assessment link within 72 hours.',
      'recruiting@figma.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    expectedCompany: 'Figma',
    description: 'Disarming subject, assessment body',
  },
  {
    name: 'Subject "Thanks" + body is OFFER',
    input: email(
      'Thanks for your time',
      'Thanks for your time during the interview loop. We are thrilled to offer you the Staff Engineer role. Your compensation package includes a starting salary and equity grant. Please review and sign.',
      'hr@plaid.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Plaid',
    description: 'Polite subject, clear offer body',
  },
  {
    name: 'Subject "Hi Tyler" + body is RECRUITER',
    input: email(
      'Hi Tyler',
      'I came across your profile on LinkedIn and was impressed by your background. I represent a top-tier company hiring for Senior Engineers. Would you be open to exploring new opportunities?',
      'sourcer@linkedin.com',
    ),
    expectedType: 'RECRUITER_OUTREACH',
    minConfidence: 0.3,
    description: 'Greeting subject, outreach body',
  },
  {
    name: 'Subject "Next steps" + body is REJECTION',
    input: email(
      'Next steps in your application',
      'Thank you for your interest in our open position. Unfortunately, after careful consideration, we will not be moving forward. We have decided to pursue other candidates. We wish you success.',
      'people@stripe.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Stripe',
    description: 'Interview-style subject, rejection body',
  },
  {
    name: 'Subject "Exciting news" + body is REJECTION',
    input: email(
      'Exciting news',
      'Thank you for your interest in the position. Unfortunately, we have made a difficult decision: we have decided not to move forward. We encourage you to apply again for future openings. We wish you all the best.',
      'talent@mongodb.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Mongodb',
    description: 'Misleading positive subject, rejection body',
  },
  {
    name: 'Subject "Regarding your application" + body OFFER',
    input: email(
      'Regarding your application',
      'Regarding your application for the Senior Engineer role — we are pleased to extend an offer. Your base salary is $185,000 plus equity. Please review the attached offer letter and sign.',
      'hr@airtable.com',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Airtable',
    description: 'Rejection-style subject, offer body',
  },
  {
    name: 'Subject "Action required" + body INTERVIEW_SCHEDULED',
    input: email(
      'Action required: confirm attendance',
      'Your interview is confirmed for Tuesday at 4pm PT. Zoom link: https://zoom.us/j/111. Please confirm attendance. Interview details: 45 min system design followed by 45 min behavioral.',
      'scheduling@notion.so',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    expectedCompany: 'Notion',
    description: 'Urgent-sounding subject, clear scheduled body',
  },

  // ~10 terse/minimal emails
  {
    name: 'Terse application receipt',
    input: email(
      'Application received',
      'Your application for the Engineer role at Fly was received. We will review your qualifications.',
      'hiring@fly.io',
    ),
    expectedType: 'APPLICATION_RECEIVED',
    minConfidence: 0.3,
    expectedCompany: 'Fly',
    description: 'Short but clear receipt',
  },
  {
    name: 'Two-line offer',
    input: email(
      'Offer Letter',
      'We are pleased to offer you the Software Engineer position. Please review and sign the attached offer letter with your base salary details.',
      'people@linear.app',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Linear',
    description: 'Two-line offer letter',
  },
  {
    name: 'Terse rejection',
    input: email(
      'Application Update',
      'Unfortunately we will not be moving forward. We wish you all the best in your job search.',
      'careers@retool.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Retool',
    description: 'Very short rejection',
  },
  {
    name: 'Minimal scheduled invite',
    input: email(
      'Interview scheduled',
      'Your interview is confirmed for Monday 2pm. Zoom link https://zoom.us/j/222 included. Interview details below.',
      'cal@stripe.com',
    ),
    expectedType: 'INTERVIEW_SCHEDULED',
    minConfidence: 0.3,
    expectedCompany: 'Stripe',
    description: 'Minimal interview confirmation',
  },
  {
    name: 'Minimal interview request',
    input: email(
      'Interview Request',
      'We would like to schedule an interview. Please share your availability for a 30-minute call next week.',
      'talent@vercel.com',
    ),
    expectedType: 'INTERVIEW_REQUEST',
    minConfidence: 0.3,
    expectedCompany: 'Vercel',
    description: 'Two-sentence interview ask',
  },
  {
    name: 'Minimal offer line',
    input: email(
      'Offer of Employment',
      'We are pleased to offer you the Senior Engineer role at Notion. Please review the attached formal offer letter.',
      'recruiting@notion.so',
    ),
    expectedType: 'OFFER',
    minConfidence: 0.3,
    expectedCompany: 'Notion',
    description: 'Single-paragraph offer',
  },
  {
    name: 'Minimal assessment link',
    input: email(
      'Coding Challenge',
      'Please complete the coding challenge at https://www.hackerrank.com/test/xyz. You have 72 hours for this timed assessment.',
      'assessments@hackerrank.com',
    ),
    expectedType: 'ASSESSMENT',
    minConfidence: 0.3,
    description: 'Short HackerRank assessment',
  },
  {
    name: 'Minimal "decided to go another direction"',
    input: email(
      'Regarding your application',
      'Thank you for your time. We have decided to pursue other candidates for this role. We wish you success.',
      'people@supabase.com',
    ),
    expectedType: 'REJECTION',
    minConfidence: 0.2,
    expectedCompany: 'Supabase',
    description: 'Minimal decided-to-pursue rejection',
  },
  {
    name: 'Just "Hi!" from random sender',
    input: email(
      'Hi!',
      'Hope you are well. Talk soon.',
      'random@gmail.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'Almost-empty friendly ping',
  },
  {
    name: 'One-word "Thanks"',
    input: email(
      'Thanks',
      'Thanks for the note earlier. Catch up soon.',
      'colleague@gmail.com',
    ),
    expectedType: 'OTHER',
    minConfidence: 0,
    description: 'One-word subject, non-job body',
  },
];

