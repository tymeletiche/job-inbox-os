# Job Inbox OS — MVP

## Mission

Turn job-related emails into swipeable job event cards that users can confirm.

## Current Scope (STRICT)

- Mock email ingestion only
- Rule-based classifier (no LLM calls)
- Postgres via docker-compose
- Prisma ORM
- Hardcoded dev user
- Review Queue page
- Confirm / Reject event

## Not Allowed (Out of Scope)

- OAuth
- Gmail integration
- Stripe
- Authentication
- Calendar integration
- Animations
- Complex styling
- Background workers

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind
- Prisma
- Postgres (Docker)

## Architecture

Monorepo:
Root/
docker-compose.yml
CLAUDE.md
web/

## Event Types

APPLICATION_RECEIVED
INTERVIEW_REQUEST
INTERVIEW_SCHEDULED
ASSESSMENT
OFFER
REJECTION
RECRUITER_OUTREACH
OTHER

## Development Rule

Prefer smallest working implementation over elegance.

## Goal of MVP

A working pipeline where:

1. Mock emails are ingested
2. Classified
3. Job + JobEvent stored
4. Displayed in Review Queue
5. User can Confirm or Reject
6. Data persists in Postgres
