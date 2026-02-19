# Job Inbox OS - Project Memory

## Project Overview
MVP monorepo for converting job-related emails into structured, actionable events with a review queue UI.

## Current State (✅ COMPLETE + Classifier V2)

### Working Features
- ✅ Mock email ingestion via POST /api/mock-ingest
- ✅ Rule-based email classifier V2 (8 event types, 150+ keywords)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Review Queue UI at /review
- ✅ Confirm/Reject event actions
- ✅ Complete API endpoints
- ✅ Vitest test suite (61 tests, all passing)

### Tech Stack
- **Frontend**: Next.js 16.1.6 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS 4.1.18 with @tailwindcss/postcss
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 5.22.0
- **Testing**: Vitest 4.0.18
- **Runtime**: Node.js 18+

### Architecture
```
Root/
  docker-compose.yml         # Postgres on port 5434
  web/                       # Next.js app
    vitest.config.ts         # Test runner config
    app/
      page.tsx              # Landing page
      review/page.tsx       # Review Queue UI
      api/
        mock-ingest/route.ts  # Email ingestion
        review/route.ts       # Fetch events
        review/confirm/route.ts  # Confirm/reject
    lib/
      prisma.ts             # DB client singleton
      classifier.ts         # Orchestrator (thin wrapper)
      classifier/
        types.ts            # Shared interfaces
        keywords.ts         # 150+ keywords across 8 event types
        domains.ts          # ATS/recruiter domain lists + helpers
        extraction.ts       # Multi-strategy regex extraction
        scoring.ts          # Weighted scoring engine
    prisma/
      schema.prisma         # DB models + enums
      seed.ts              # Dev user seeding
    __tests__/
      classifier.test.ts   # 61 integration tests
      fixtures/
        emails.ts          # Test email fixtures
```

## Database Schema

### Models
1. **User** - id, email, name
2. **Job** - company, position, userId (unique constraint)
3. **JobEvent** - type, status, jobId, emailMessageId, extractedData, rawData
4. **EmailMessage** - subject, body, sender

### Enums
- **EventType**: APPLICATION_RECEIVED, INTERVIEW_REQUEST, INTERVIEW_SCHEDULED, ASSESSMENT, OFFER, REJECTION, RECRUITER_OUTREACH, OTHER
- **EventStatus**: PENDING, CONFIRMED, REJECTED

### Key Relationships
- Job ← User (many-to-one)
- JobEvent ← Job (many-to-one)
- JobEvent ← EmailMessage (one-to-one)
- Unique constraint: Job(userId, company, position)

## Classifier V2 Design

### Architecture
Modular design split into 5 files under `web/lib/classifier/`:
- **types.ts** — ClassifierInput, ClassifierOutput, EventPattern, ScoringResult
- **keywords.ts** — EVENT_PATTERNS record with subjectKeywords, keywords, negativeKeywords per type
- **domains.ts** — ATS domains (Greenhouse, Lever, Workday, etc.), recruiter domains, noreply detection
- **extraction.ts** — Multi-strategy regex for company, position, date, salary, assessment links, deadlines
- **scoring.ts** — Weighted scoring engine with subject weighting, domain bonuses, ambiguity resolution

### Public API (unchanged)
```typescript
classifyEmail(input: { subject: string; body: string; sender: string }): ClassifierOutput
```
The sole consumer `web/app/api/mock-ingest/route.ts` requires ZERO changes.

### Scoring Algorithm
- **Subject-specific keywords**: weight 2.0 per match
- **General keywords in subject**: weight 1.5 per match
- **Body keywords**: weight 1.0 per match
- **Negative keywords**: -1.5 penalty (e.g., "unfortunately" penalizes INTERVIEW_REQUEST)
- **ATS domain bonus**: +1.0 for non-recruiter types
- **Recruiter domain bonus**: +2.0 for RECRUITER_OUTREACH
- **Noreply bonus**: +0.5 for APPLICATION_RECEIVED
- **Confidence**: Smooth exponential curve `1 - e^(-0.25 * rawScore)`, capped at 0.95
- **Threshold**: < 0.25 confidence → OTHER

### Ambiguity Resolution (tie-breaking)
When top 2 scores are within 20%, priority hierarchy applies:
REJECTION > OFFER > INTERVIEW_SCHEDULED > INTERVIEW_REQUEST > ASSESSMENT > APPLICATION_RECEIVED > RECRUITER_OUTREACH

### Pre-filters
- **Newsletter detection**: 2+ signals (unsubscribe, job alert, manage notifications) → OTHER
- **Forwarded email stripping**: Removes "Fwd:", forwarded message headers

### Extraction Patterns
- **Company**: 7 regex patterns + sender-domain fallback + post-processing cleanup
- **Position**: 9 regex patterns (for the X role, position of X, as a X, etc.)
- **Date**: 8 patterns (scheduled for, on Monday, ISO dates, relative dates)
- **Assessment links**: 12+ platforms (HackerRank, Codility, CoderPad, Karat, etc.)
- **Salary**: Range ($X-$Y), base salary, $XK format
- **Deadline**: complete by, deadline:, you have X hours/days

### False Positive Protections
- Removed overly generic OFFER keywords: "congratulations", "stock options", "benefits package", "start date"
- Newsletter pre-filter catches job alert digests
- Negative keywords prevent misclassification (e.g., rejection emails mentioning interviews)

## Test Suite (61 tests)

### Structure
```
web/__tests__/
  classifier.test.ts        # Integration tests
  fixtures/emails.ts         # All test fixtures
```

### Coverage
| Category | Tests |
|---|---|
| APPLICATION_RECEIVED | 6 |
| INTERVIEW_REQUEST | 5 |
| INTERVIEW_SCHEDULED | 4 |
| ASSESSMENT | 5 |
| OFFER | 4 |
| REJECTION | 6 |
| RECRUITER_OUTREACH | 4 |
| Edge cases | 10 |
| False positive guards | 5 |
| Scoring behavior | 5 |
| Extraction | 7 |

### Run Tests
```bash
cd web && npm test        # Single run
cd web && npm run test:watch  # Watch mode
```

## Environment Variables

```env
# web/.env
DATABASE_URL="postgresql://jobinbox:devpassword@localhost:5434/jobinbox_dev"
DEV_USER_ID="dev-user-1"
NODE_ENV="development"
```

## Git History

1. `3c3df94` - Initial commit
2. `d1ecedc` - Add complete MVP scaffolding
3. `9ea399b` - Fix Prisma and Tailwind compatibility
4. `22763c7` - Add comprehensive README
5. `360d419` - Update .gitignore
6. `5c04e0c` - Add project memory, new chat prompt, push script
7. `0821dec` - Add .env.example
8. `d3c63ef` - Improve email classifier with expanded keywords, weighted scoring, and test suite
9. `bc126e8` - Fix false positives: remove generic OFFER keywords and add false-positive test guards

## Important Files

### Classifier (core logic)
- `web/lib/classifier.ts` — Orchestrator (public API)
- `web/lib/classifier/types.ts` — Interfaces
- `web/lib/classifier/keywords.ts` — All keyword lists
- `web/lib/classifier/domains.ts` — ATS/recruiter domain helpers
- `web/lib/classifier/extraction.ts` — Regex extraction
- `web/lib/classifier/scoring.ts` — Scoring engine

### Tests
- `web/__tests__/classifier.test.ts` — Test runner
- `web/__tests__/fixtures/emails.ts` — Test fixtures + factory

### API Routes
- `web/app/api/mock-ingest/route.ts` — Email ingestion
- `web/app/api/review/route.ts` — Fetch events
- `web/app/api/review/confirm/route.ts` — Confirm/reject

### UI
- `web/app/review/page.tsx` — Review Queue

### Configuration
- `docker-compose.yml` — Database (port 5434)
- `web/.env` — Environment variables
- `web/vitest.config.ts` — Test config
- `web/prisma/schema.prisma` — DB schema

## Development Commands

```bash
# Start everything
docker compose up -d
cd web && npm run dev

# Database
npx prisma studio
npx prisma migrate dev
npx prisma db seed
npx prisma generate

# Testing
cd web && npm test
cd web && npm run test:watch

# Send test email
node -e '
const http = require("http");
const data = JSON.stringify({ subject: "...", body: "...", sender: "..." });
const req = http.request({ hostname: "localhost", port: 3000, path: "/api/mock-ingest", method: "POST", headers: { "Content-Type": "application/json" } }, (res) => { let b=""; res.on("data",(c)=>b+=c); res.on("end",()=>console.log(JSON.parse(b))); });
req.write(data); req.end();
'
```

---

Last Updated: 2026-02-19
Status: ✅ MVP Complete, Classifier V2 with 61 tests passing
