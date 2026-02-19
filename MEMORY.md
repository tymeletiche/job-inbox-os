# Job Inbox OS - Project Memory

## Project Overview
MVP monorepo for converting job-related emails into structured, actionable events with a review queue UI. Now supports real Gmail integration with an email objectification framework.

## Current State (✅ MVP + Gmail Integration + Email Groups)

### Working Features
- ✅ Mock email ingestion via POST /api/mock-ingest
- ✅ Rule-based email classifier V2 (8 event types, 150+ keywords)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Review Queue UI at /review
- ✅ Confirm/Reject event actions
- ✅ Gmail OAuth integration (connect, sync, status)
- ✅ Real Gmail email sync (50 emails, zero errors on first test)
- ✅ Email objectification framework (EmailGroup model)
- ✅ Transaction-safe shared ingest pipeline
- ✅ Gmail message dedup via gmailMessageId
- ✅ HTML-to-text conversion for Gmail emails
- ✅ Vitest test suite (201 tests, all passing)

### Tech Stack
- **Frontend**: Next.js 16.1.6 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS 4.1.18 with @tailwindcss/postcss
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: Prisma 5.22.0
- **Gmail**: googleapis (OAuth2 + Gmail API)
- **HTML Parsing**: html-to-text
- **Testing**: Vitest 4.0.18
- **Runtime**: Node.js 18+

### Architecture
```
Root/
  docker-compose.yml         # Postgres on port 5434
  web/                       # Next.js app
    vitest.config.ts         # Test runner config
    app/
      page.tsx              # Landing page + Gmail connect/sync UI
      review/page.tsx       # Review Queue UI
      api/
        mock-ingest/route.ts       # Mock email ingestion (uses shared ingest)
        review/route.ts            # Fetch events
        review/confirm/route.ts    # Confirm/reject
        auth/gmail/route.ts        # OAuth start → redirect to Google
        auth/gmail/callback/route.ts  # OAuth callback → store tokens
        gmail/sync/route.ts        # POST: trigger manual sync
        gmail/status/route.ts      # GET: connection status
    lib/
      prisma.ts             # DB client singleton
      ingest.ts             # Shared ingest pipeline (classify → group → store)
      classifier.ts         # Orchestrator (thin wrapper)
      classifier/
        types.ts            # Shared interfaces
        keywords.ts         # 150+ keywords across 8 event types
        domains.ts          # ATS/recruiter domain lists + helpers
        extraction.ts       # Multi-strategy regex extraction
        scoring.ts          # Weighted scoring engine
      gmail/
        client.ts           # OAuth2 client factory + token refresh
        parse.ts            # MIME parser, From header parsing, base64url decode
        html-to-text.ts     # HTML→text for classifier
        sync.ts             # Fetch messages, dedup, classify, ingest
    prisma/
      schema.prisma         # DB models + enums
      seed.ts              # Dev user seeding
    __tests__/
      classifier.test.ts   # 201 integration tests
      fixtures/
        emails.ts          # Test email fixtures
```

## Database Schema

### Models
1. **User** - id, email, name + relations to jobs, events, gmailAccount, emailGroups
2. **GmailAccount** - userId (unique), gmailEmail, accessToken, refreshToken, tokenExpiry, lastSyncAt, lastHistoryId
3. **EmailGroup** - userId, jobId?, gmailThreadId?, companyKey?, emailCount, latestEventType, firstEmailAt, lastEmailAt
4. **Job** - company, position, userId (unique constraint) + emailGroups relation
5. **JobEvent** - type, status, jobId, emailMessageId, extractedData, rawData
6. **EmailMessage** - subject, body, sender, gmailMessageId? (unique), gmailThreadId?, groupId?

### Enums
- **EventType**: APPLICATION_RECEIVED, INTERVIEW_REQUEST, INTERVIEW_SCHEDULED, ASSESSMENT, OFFER, REJECTION, RECRUITER_OUTREACH, OTHER
- **EventStatus**: PENDING, CONFIRMED, REJECTED

### Key Relationships
- Job ← User (many-to-one)
- JobEvent ← Job (many-to-one)
- JobEvent ← EmailMessage (one-to-one)
- EmailMessage ← EmailGroup (many-to-one)
- EmailGroup ← Job (many-to-one, optional)
- GmailAccount ← User (one-to-one)
- Unique constraints: Job(userId, company, position), EmailGroup(userId, gmailThreadId), EmailMessage(gmailMessageId)

## Email Objectification Framework

### How It Works
Every email is assigned to an EmailGroup on ingest:
- **Gmail emails**: grouped by gmailThreadId (all emails in a conversation share one group)
- **Mock emails**: grouped by normalized company name (companyKey)
- **Unknown company**: standalone group (no piling into a single "Unknown" bucket)

### Shared Ingest Pipeline (`lib/ingest.ts`)
Both mock-ingest and Gmail sync call `ingestEmail()`:
1. Classify email (existing classifier, zero changes)
2. Find or create EmailGroup (by threadId or companyKey)
3. Create EmailMessage (body truncated to 5000 chars, full in rawHeaders)
4. Find or create Job (reuses group's existing Job if linked)
5. Create JobEvent
6. Update group metadata (emailCount, latestEventType, lastEmailAt)
All wrapped in `prisma.$transaction()`.

### Future Capabilities (no schema changes needed)
- "My Applications" view: list EmailGroups as application objects
- Timeline view: ordered emails per group
- Merge/split groups: update groupId FK
- Status progression: group's latestEventType shows current stage
- Re-classification at group level

## Gmail Integration

### OAuth Flow
1. GET /api/auth/gmail → redirect to Google consent screen
2. Google callback → GET /api/auth/gmail/callback → exchange code for tokens → store GmailAccount
3. `access_type: 'offline'` + `prompt: 'consent'` ensures refresh token
4. Automatic token refresh when expired (5-minute buffer)

### Sync Flow
1. POST /api/gmail/sync → fetch messages from last 7 days (max 50)
2. Dedup by gmailMessageId (skip if already in DB)
3. Parse MIME: recursive part walker, prefer text/plain, fall back to HTML→text
4. Parse From header: `"Name <email>"` → bare email
5. Call shared ingestEmail() with gmailMessageId + gmailThreadId
6. Update lastSyncAt

### Body Storage
- `EmailMessage.body`: first 5000 chars
- `EmailMessage.rawHeaders`: JSON with fullBody, gmailMessageId, gmailThreadId

## Classifier V2 Design

### Public API (unchanged)
```typescript
classifyEmail(input: { subject: string; body: string; sender: string }): ClassifierOutput
```

### Scoring Algorithm
- Subject-specific keywords: weight 2.0
- General keywords in subject: weight 1.5
- Body keywords: weight 1.0
- Negative keywords: -1.5 penalty
- ATS domain bonus: +1.0
- Recruiter domain bonus: +2.0
- Noreply bonus: +0.5
- Confidence: `1 - e^(-0.25 * rawScore)`, capped at 0.95
- Threshold: < 0.25 → OTHER

### Ambiguity Resolution
When top 2 scores within 20%, priority: REJECTION > OFFER > INTERVIEW_SCHEDULED > INTERVIEW_REQUEST > ASSESSMENT > APPLICATION_RECEIVED > RECRUITER_OUTREACH

## Environment Variables

```env
# web/.env
DATABASE_URL="postgresql://jobinbox:devpassword@localhost:5434/jobinbox_dev"
DEV_USER_ID="dev-user-1"
NODE_ENV="development"

# Gmail OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/gmail/callback"

# Gmail Sync
GMAIL_SYNC_MAX_RESULTS="50"
GMAIL_SYNC_QUERY="newer_than:7d"
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
10. `acf470a` - Expand classifier test suite from 61 to 201 tests
11. `[next]` - Add Gmail integration with email objectification framework

## Development Commands

```bash
# Start everything
docker compose up -d
cd web && npm run dev

# Database
npx prisma studio
npx prisma db push
npx prisma db seed
npx prisma generate

# Testing
cd web && npm test
cd web && npm run test:watch

# Gmail testing
curl -s http://localhost:3000/api/gmail/status | python3 -m json.tool
curl -s -X POST http://localhost:3000/api/gmail/sync | python3 -m json.tool

# Send test email
curl -X POST http://localhost:3000/api/mock-ingest \
  -H "Content-Type: application/json" \
  -d '{"subject":"...","body":"...","sender":"..."}'
```

---

Last Updated: 2026-02-19
Status: ✅ MVP + Gmail Integration + Email Objectification Framework (201 tests passing)
