import { describe, it, expect } from 'vitest';
import { classifyEmail } from '../lib/classifier';
import {
  APPLICATION_RECEIVED_FIXTURES,
  INTERVIEW_REQUEST_FIXTURES,
  INTERVIEW_SCHEDULED_FIXTURES,
  ASSESSMENT_FIXTURES,
  OFFER_FIXTURES,
  REJECTION_FIXTURES,
  RECRUITER_OUTREACH_FIXTURES,
  EDGE_CASE_FIXTURES,
  APPLICATION_RECEIVED_EXPANDED,
  INTERVIEW_REQUEST_EXPANDED,
  INTERVIEW_SCHEDULED_EXPANDED,
  ASSESSMENT_EXPANDED,
  OFFER_EXPANDED,
  REJECTION_EXPANDED,
  RECRUITER_OUTREACH_EXPANDED,
  FALSE_POSITIVE_FIXTURES,
  EDGE_CASE_EXPANDED,
  ADDITIONAL_FIXTURES,
  TestFixture,
} from './fixtures/emails';

function runFixtures(fixtures: TestFixture[]) {
  for (const fixture of fixtures) {
    it(`${fixture.name}: ${fixture.description}`, () => {
      const result = classifyEmail(fixture.input);

      expect(result.eventType).toBe(fixture.expectedType);
      expect(result.confidence).toBeGreaterThanOrEqual(fixture.minConfidence);

      if (fixture.expectedCompany) {
        expect(result.extractedData.company).toBe(fixture.expectedCompany);
      }
      if (fixture.expectedPosition) {
        expect(result.extractedData.position).toBe(fixture.expectedPosition);
      }
    });
  }
}

describe('classifyEmail', () => {
  describe('APPLICATION_RECEIVED', () => {
    runFixtures(APPLICATION_RECEIVED_FIXTURES);
  });

  describe('APPLICATION_RECEIVED (expanded)', () => {
    runFixtures(APPLICATION_RECEIVED_EXPANDED);
  });

  describe('INTERVIEW_REQUEST', () => {
    runFixtures(INTERVIEW_REQUEST_FIXTURES);
  });

  describe('INTERVIEW_REQUEST (expanded)', () => {
    runFixtures(INTERVIEW_REQUEST_EXPANDED);
  });

  describe('INTERVIEW_SCHEDULED', () => {
    runFixtures(INTERVIEW_SCHEDULED_FIXTURES);
  });

  describe('INTERVIEW_SCHEDULED (expanded)', () => {
    runFixtures(INTERVIEW_SCHEDULED_EXPANDED);
  });

  describe('ASSESSMENT', () => {
    runFixtures(ASSESSMENT_FIXTURES);
  });

  describe('ASSESSMENT (expanded)', () => {
    runFixtures(ASSESSMENT_EXPANDED);
  });

  describe('OFFER', () => {
    runFixtures(OFFER_FIXTURES);
  });

  describe('OFFER (expanded)', () => {
    runFixtures(OFFER_EXPANDED);
  });

  describe('REJECTION', () => {
    runFixtures(REJECTION_FIXTURES);
  });

  describe('REJECTION (expanded)', () => {
    runFixtures(REJECTION_EXPANDED);
  });

  describe('RECRUITER_OUTREACH', () => {
    runFixtures(RECRUITER_OUTREACH_FIXTURES);
  });

  describe('RECRUITER_OUTREACH (expanded)', () => {
    runFixtures(RECRUITER_OUTREACH_EXPANDED);
  });

  describe('edge cases', () => {
    runFixtures(EDGE_CASE_FIXTURES);
  });

  describe('edge cases (expanded)', () => {
    runFixtures(EDGE_CASE_EXPANDED);
  });

  describe('false positive guards', () => {
    runFixtures(FALSE_POSITIVE_FIXTURES);
  });

  describe('additional coverage', () => {
    runFixtures(ADDITIONAL_FIXTURES);
  });

  describe('scoring behavior', () => {
    it('subject-only match scores higher than body-only match', () => {
      const subjectOnly = classifyEmail({
        subject: 'Application Received',
        body: 'Please see details below.',
        sender: 'hr@company.com',
      });
      const bodyOnly = classifyEmail({
        subject: 'Update',
        body: 'We received your application and will review.',
        sender: 'hr@company.com',
      });
      expect(subjectOnly.eventType).toBe('APPLICATION_RECEIVED');
      expect(bodyOnly.eventType).toBe('APPLICATION_RECEIVED');
      expect(subjectOnly.confidence).toBeGreaterThan(bodyOnly.confidence);
    });

    it('ATS domain boosts confidence', () => {
      const withATS = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying.',
        sender: 'no-reply@greenhouse.io',
      });
      const withoutATS = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying.',
        sender: 'hr@randomcompany.com',
      });
      expect(withATS.confidence).toBeGreaterThan(withoutATS.confidence);
    });

    it('multiple matches produce higher confidence than single match', () => {
      const single = classifyEmail({
        subject: 'Update',
        body: 'Unfortunately, we have decided.',
        sender: 'hr@company.com',
      });
      const multiple = classifyEmail({
        subject: 'Update on your application',
        body: 'Unfortunately, we have decided to move forward with other candidates. We are not moving forward. We wish you all the best.',
        sender: 'hr@company.com',
      });
      expect(multiple.confidence).toBeGreaterThan(single.confidence);
    });

    it('confidence never exceeds 0.95', () => {
      const result = classifyEmail({
        subject: 'Application Received - Application Confirmation',
        body: 'Thank you for applying. We received your application. Application confirmed. Submitted successfully. Application is under review. Reviewing your application. We appreciate your interest. Your application is being reviewed.',
        sender: 'no-reply@greenhouse.io',
      });
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });

    it('no-signal email returns OTHER with low confidence', () => {
      const result = classifyEmail({
        subject: 'Hey there',
        body: 'How is the weather today?',
        sender: 'friend@gmail.com',
      });
      expect(result.eventType).toBe('OTHER');
      expect(result.confidence).toBeLessThan(0.25);
    });

    it('negative keyword reduces confidence', () => {
      const withoutNeg = classifyEmail({
        subject: 'Interview Invitation',
        body: 'We invite you to interview. Please share your availability for next week.',
        sender: 'hr@company.com',
      });
      const withNeg = classifyEmail({
        subject: 'Interview Invitation',
        body: 'Unfortunately, we invite you to interview. Please share your availability for next week.',
        sender: 'hr@company.com',
      });
      expect(withoutNeg.confidence).toBeGreaterThan(withNeg.confidence);
    });

    it('newsletter pre-filter: 1 signal is NOT filtered', () => {
      const result = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying. We received your application. Unsubscribe from emails.',
        sender: 'hr@company.com',
      });
      // Only 1 newsletter signal, should NOT trigger newsletter filter
      expect(result.eventType).toBe('APPLICATION_RECEIVED');
    });

    it('newsletter pre-filter: 2 signals IS filtered', () => {
      const result = classifyEmail({
        subject: 'New jobs for you',
        body: 'Here are new Software Engineer jobs. Manage your notifications. Unsubscribe from job alerts.',
        sender: 'alerts@jobboard.com',
      });
      expect(result.eventType).toBe('OTHER');
    });

    it('recruiter domain boosts RECRUITER_OUTREACH score', () => {
      const withDomain = classifyEmail({
        subject: 'Exciting opportunity',
        body: 'I came across your profile. Would you be open to exploring new opportunities?',
        sender: 'recruiter@linkedin.com',
      });
      const withoutDomain = classifyEmail({
        subject: 'Exciting opportunity',
        body: 'I came across your profile. Would you be open to exploring new opportunities?',
        sender: 'recruiter@randomcompany.com',
      });
      expect(withDomain.confidence).toBeGreaterThan(withoutDomain.confidence);
    });

    it('noreply sender boosts APPLICATION_RECEIVED score', () => {
      const withNoreply = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying.',
        sender: 'noreply@company.com',
      });
      const withoutNoreply = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying.',
        sender: 'john@company.com',
      });
      expect(withNoreply.confidence).toBeGreaterThan(withoutNoreply.confidence);
    });

    it('confidence monotonically increases with more keyword matches', () => {
      const one = classifyEmail({
        subject: 'Update',
        body: 'Unfortunately we have decided.',
        sender: 'hr@company.com',
      });
      const two = classifyEmail({
        subject: 'Update',
        body: 'Unfortunately we have decided to move forward with other candidates.',
        sender: 'hr@company.com',
      });
      const three = classifyEmail({
        subject: 'Update on your application',
        body: 'Unfortunately we have decided to move forward with other candidates. We wish you all the best.',
        sender: 'hr@company.com',
      });
      expect(three.confidence).toBeGreaterThanOrEqual(two.confidence);
      expect(two.confidence).toBeGreaterThanOrEqual(one.confidence);
    });
  });

  describe('extraction', () => {
    it('extracts company from "at Company"', () => {
      const result = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying to the role at Google. We received your application.',
        sender: 'hr@google.com',
      });
      expect(result.extractedData.company).toBe('Google');
    });

    it('extracts company from sender domain as fallback', () => {
      const result = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying. We received your application.',
        sender: 'noreply@stripe.com',
      });
      expect(result.extractedData.company).toBe('Stripe');
    });

    it('extracts position from "for the X role"', () => {
      const result = classifyEmail({
        subject: 'Application Update',
        body: 'Thank you for applying for the Senior Software Engineer role. We received your application.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.position).toBe('Senior Software Engineer');
    });

    it('extracts salary from offer email', () => {
      const result = classifyEmail({
        subject: 'Offer Letter',
        body: 'We are pleased to offer you the position. Your base salary of $150,000 with benefits.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.salary).toBeDefined();
    });

    it('extracts HackerRank assessment link', () => {
      const result = classifyEmail({
        subject: 'Technical Assessment',
        body: 'Please complete the coding challenge at https://www.hackerrank.com/test/abc123 within 72 hours.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.assessmentLink).toContain('hackerrank');
    });

    it('extracts interview date', () => {
      const result = classifyEmail({
        subject: 'Interview Confirmed',
        body: 'Your interview is confirmed for Monday, January 20th at 2pm. Meeting has been scheduled.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.interviewDate).toBeDefined();
    });

    it('does not extract company from generic email domains', () => {
      const result = classifyEmail({
        subject: 'Hello',
        body: 'Just checking in.',
        sender: 'someone@gmail.com',
      });
      expect(result.extractedData.company).toBeUndefined();
    });

    it('extracts company from "team at X" pattern', () => {
      const result = classifyEmail({
        subject: 'Application Received',
        body: 'The team at Datadog is reviewing your application. We received your application.',
        sender: 'hr@datadog.com',
      });
      expect(result.extractedData.company).toBe('Datadog');
    });

    it('extracts company from "on behalf of X" pattern', () => {
      const result = classifyEmail({
        subject: 'Exciting opportunity',
        body: 'I am reaching out on behalf of Netflix regarding a potential opportunity. I came across your profile.',
        sender: 'recruiter@agency.com',
      });
      expect(result.extractedData.company).toBe('Netflix');
    });

    it('extracts company from non-generic sender domain fallback', () => {
      const result = classifyEmail({
        subject: 'Application Received',
        body: 'Thank you for applying. We received your application.',
        sender: 'careers@twilio.com',
      });
      expect(result.extractedData.company).toBe('Twilio');
    });

    it('extracts position from "position of X" pattern', () => {
      const result = classifyEmail({
        subject: 'Offer Letter',
        body: 'We are pleased to offer you the position of Staff Engineer at our company. Your base salary is $200,000.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.position).toBe('Staff Engineer');
    });

    it('extracts position from "as a X" pattern', () => {
      const result = classifyEmail({
        subject: 'Offer Letter',
        body: 'We are pleased to offer you a role as a Senior Data Scientist at our company. Your base salary is $180,000.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.position).toBe('Senior Data Scientist');
    });

    it('extracts salary in $XK format', () => {
      const result = classifyEmail({
        subject: 'Offer Letter',
        body: 'We are pleased to offer you the position. Your starting salary is $150K with benefits. Please review and sign.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.salary).toBeDefined();
      expect(result.extractedData.salary).toContain('150');
    });

    it('extracts salary range format', () => {
      const result = classifyEmail({
        subject: 'Offer Details',
        body: 'The compensation range for this role is $120,000 - $160,000. We are pleased to offer you a position. Please review and sign.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.salary).toBeDefined();
      expect(result.extractedData.salary).toContain('120,000');
    });

    it('extracts base salary of $X format', () => {
      const result = classifyEmail({
        subject: 'Offer Letter',
        body: 'We are pleased to offer you the position. Your base salary of $180,000 includes comprehensive benefits. Please review and sign.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.salary).toBeDefined();
      expect(result.extractedData.salary).toContain('180,000');
    });

    it('extracts Codility assessment link', () => {
      const result = classifyEmail({
        subject: 'Online Assessment',
        body: 'Please complete the assessment at https://app.codility.com/test/abc123. This is a timed assessment.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.assessmentLink).toContain('codility');
    });

    it('extracts CoderPad assessment link', () => {
      const result = classifyEmail({
        subject: 'Technical Assessment',
        body: 'Please join the live coding session at https://app.coderpad.io/session/xyz789 for the coding challenge.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.assessmentLink).toContain('coderpad');
    });

    it('extracts deadline from "you have X hours"', () => {
      const result = classifyEmail({
        subject: 'Technical Assessment',
        body: 'Please complete the coding challenge. You have 72 hours to submit your solution. This is a timed assessment.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.deadline).toBeDefined();
      expect(result.extractedData.deadline).toContain('72 hours');
    });

    it('extracts ISO date format', () => {
      const result = classifyEmail({
        subject: 'Interview Confirmed',
        body: 'Your interview is scheduled for 2026-03-15. Meeting has been scheduled. Interview details below.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.interviewDate).toBeDefined();
    });

    it('extracts "this Thursday" relative date', () => {
      const result = classifyEmail({
        subject: 'Interview Confirmed',
        body: 'Your interview is confirmed for this Thursday at 3pm. Meeting has been scheduled.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.interviewDate).toBeDefined();
    });

    it('extracts "tomorrow" relative date', () => {
      const result = classifyEmail({
        subject: 'Interview Confirmed',
        body: 'Your interview is confirmed for tomorrow at 10am. Meeting has been scheduled.',
        sender: 'hr@company.com',
      });
      expect(result.extractedData.interviewDate).toBeDefined();
    });
  });
});
