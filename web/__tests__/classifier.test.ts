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

  describe('INTERVIEW_REQUEST', () => {
    runFixtures(INTERVIEW_REQUEST_FIXTURES);
  });

  describe('INTERVIEW_SCHEDULED', () => {
    runFixtures(INTERVIEW_SCHEDULED_FIXTURES);
  });

  describe('ASSESSMENT', () => {
    runFixtures(ASSESSMENT_FIXTURES);
  });

  describe('OFFER', () => {
    runFixtures(OFFER_FIXTURES);
  });

  describe('REJECTION', () => {
    runFixtures(REJECTION_FIXTURES);
  });

  describe('RECRUITER_OUTREACH', () => {
    runFixtures(RECRUITER_OUTREACH_FIXTURES);
  });

  describe('edge cases', () => {
    runFixtures(EDGE_CASE_FIXTURES);
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
      // Both should classify as APPLICATION_RECEIVED
      expect(subjectOnly.eventType).toBe('APPLICATION_RECEIVED');
      expect(bodyOnly.eventType).toBe('APPLICATION_RECEIVED');
      // Subject match should have higher confidence
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
  });
});
