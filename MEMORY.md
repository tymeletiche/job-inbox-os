# Job Inbox OS - Project Memory

## Project Overview
MVP monorepo for converting job-related emails into structured, actionable events with a review queue UI.

## Current State (✅ COMPLETE)

### Working Features
- ✅ Mock email ingestion via POST /api/mock-ingest
- ✅ Rule-based email classifier (8 event types)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Review Queue UI at /review
- ✅ Confirm/Reject event actions
- ✅ Complete API endpoints
- ✅ Cross-platform deployment ready

### Tech Stack
- **Frontend**: Next.js 16.1.6 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS 4.1.18 with @tailwindcss/postcss
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 5.22.0 (downgraded from 7.4.0 for stability)
- **Runtime**: Node.js 18+

### Architecture
```
Root/
  docker-compose.yml         # Postgres on port 5433
  web/                       # Next.js app
    app/
      page.tsx              # Landing page
      review/page.tsx       # Review Queue UI
      api/
        mock-ingest/route.ts  # Email ingestion
        review/route.ts       # Fetch events
        review/confirm/route.ts  # Confirm/reject
    lib/
      prisma.ts             # DB client singleton
      classifier.ts         # Rule-based classifier
    prisma/
      schema.prisma         # DB models + enums
      seed.ts              # Dev user seeding
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

## Classifier Design

### Algorithm
- Keyword matching with confidence scoring
- Pattern matching for data extraction
- Confidence threshold: 0.3 minimum

### Scoring Rules
- 1 keyword match = 0.3 confidence
- 2+ matches = 0.6 confidence
- 3+ matches = 0.9 confidence
- Sender domain bonus = +0.2 confidence

### Extraction Patterns (Regex)
- Company: `/(?:from|at|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+team|\s+is|\.|\,)/`
- Position: `/(?:for the|position of|role of|as a)\s+([A-Z][A-Za-z\s]+?)(?:\s+position|\s+role|\.|\,)/`
- Interview Date: `/(?:on|scheduled for)\s+([A-Z][a-z]+,?\s+[A-Z][a-z]+\s+\d{1,2})/`
- Assessment Link: `/(https?:\/\/[^\s]+(?:hackerrank|codility|coderpad)[^\s]*)/`

## Technical Decisions Made

### Prisma Version
- **Started with**: Prisma 7.4.0 (latest)
- **Downgraded to**: Prisma 5.22.0 (LTS)
- **Reason**: Prisma 7 has breaking changes (requires adapters, removed `url` from schema)

### Tailwind CSS
- **Version**: 4.1.18
- **Plugin**: @tailwindcss/postcss (required for v4)
- **Config**: postcss.config.js uses '@tailwindcss/postcss'

### Database Port
- **Port**: 5433 (not default 5432)
- **Reason**: Port 5432 was already in use on the system

### Authentication
- **Current**: Hardcoded dev user (DEV_USER_ID="dev-user-1")
- **Future**: OAuth will be added later (out of MVP scope)

## Environment Variables

```env
# web/.env
DATABASE_URL="postgresql://jobinbox:devpassword@localhost:5433/jobinbox_dev"
DEV_USER_ID="dev-user-1"
NODE_ENV="development"
```

## Git Commits

1. `3c3df94` - Initial commit with documentation
2. `d1ecedc` - Add complete MVP scaffolding
3. `9ea399b` - Fix Prisma and Tailwind compatibility
4. `22763c7` - Add comprehensive README
5. `360d419` - Update .gitignore

## Testing Results

### Emails Tested (4 total)
1. ✅ INTERVIEW_REQUEST - "Schedule an interview..." (confidence: 0.3)
2. ✅ REJECTION - "Unfortunately, we have decided..." (confidence: 0.6)
3. ✅ OFFER - "Pleased to offer you..." (confidence: 0.9)
4. ✅ ASSESSMENT - "Coding challenge..." (confidence: 0.9)

### API Tests
- ✅ POST /api/mock-ingest - Creates Job + JobEvent
- ✅ GET /api/review?status=PENDING - Returns pending events
- ✅ POST /api/review/confirm - Updates event status

### UI Tests
- ✅ Landing page renders
- ✅ Review Queue displays events
- ✅ Filter tabs work (PENDING/CONFIRMED/REJECTED)
- ✅ Confirm button updates status
- ✅ Reject button updates status

## Known Issues / Limitations

1. **Classifier Accuracy**: Currently ~60-90% based on limited testing
2. **Data Extraction**: Regex patterns are basic, may miss edge cases
3. **No Validation**: API endpoints don't validate input thoroughly
4. **Hardcoded User**: Single dev user, no multi-user support
5. **No Tests**: No automated test suite (manual testing only)

## Next Steps (PRIORITY)

### Immediate: Improve Classifier to 95% Accuracy
1. Generate 100 diverse test emails (10-15 per event type)
2. Create automated test suite
3. Iteratively improve keyword patterns
4. Add edge case handling
5. Achieve 95%+ classification accuracy

### Future Enhancements (Out of Scope)
- Gmail OAuth integration
- Multi-user authentication
- LLM-based classification (GPT-4)
- Email threading
- Calendar integration
- Mobile UI optimization
- Background job processing
- Analytics dashboard

## Important Files to Reference

### Core Logic
- [web/lib/classifier.ts](web/lib/classifier.ts) - Email classification engine
- [web/lib/prisma.ts](web/lib/prisma.ts) - Database client
- [web/prisma/schema.prisma](web/prisma/schema.prisma) - Database schema

### API Routes
- [web/app/api/mock-ingest/route.ts](web/app/api/mock-ingest/route.ts)
- [web/app/api/review/route.ts](web/app/api/review/route.ts)
- [web/app/api/review/confirm/route.ts](web/app/api/review/confirm/route.ts)

### UI
- [web/app/review/page.tsx](web/app/review/page.tsx) - Review Queue

### Configuration
- [docker-compose.yml](docker-compose.yml) - Database
- [web/.env](web/.env) - Environment variables (not committed)
- [web/postcss.config.js](web/postcss.config.js) - Tailwind setup
- [web/prisma.config.ts](web/prisma.config.ts) - Prisma config

## Development Commands

```bash
# Start everything
docker compose up -d
cd web && npm run dev

# Database
npx prisma studio          # View data
npx prisma migrate dev     # Create migration
npx prisma db seed         # Seed dev user
npx prisma generate        # Regenerate client

# Testing
curl -X POST http://localhost:3000/api/mock-ingest -H "Content-Type: application/json" -d '...'
curl http://localhost:3000/api/review?status=PENDING
```

## Platform Notes

- ✅ Works on macOS (tested)
- ✅ Should work on Windows (Docker Desktop + PowerShell)
- ✅ Should work on Linux (Docker Engine)
- Port 5433 must be available
- Node.js 18+ required
- Docker Desktop/Engine required

## User Preferences

- Prefers minimal working code over elegance
- Focus on MVP functionality, avoid feature creep
- No authentication until later
- Simple UI, no animations
- Rule-based classifier (no LLM for now)

---

Last Updated: 2026-02-12
Status: ✅ MVP Complete, Ready for Classifier Improvement