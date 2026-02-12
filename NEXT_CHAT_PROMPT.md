# Prompt for New Chat Session

Copy and paste this into your new Claude chat:

---

I'm continuing work on my **job-inbox-os** project. Here's the context:

## Project
MVP monorepo that converts job-related emails into structured events with a review queue UI.

**Current State**: ✅ Complete and working
- Mock email ingestion API
- Rule-based email classifier (8 event types)
- PostgreSQL + Prisma ORM
- Review Queue UI with confirm/reject
- Deployed and tested

**Tech Stack**: Next.js 16, TypeScript, Tailwind 4, Prisma 5, Postgres 16 (Docker)

**Repo**: [Add your GitHub URL here after pushing]

## What I Need

I want to **improve the email classifier to 95%+ accuracy**.

Currently it uses simple keyword matching with ~60-90% accuracy. I need you to:

1. **Generate 100 diverse test emails** (10-15 per event type)
   - Different wording styles (formal, casual, terse, verbose)
   - Different senders (recruiters, HR, hiring managers, automated)
   - Edge cases and ambiguous examples

2. **Build automated test suite**
   - Load test emails from JSON
   - Run through classifier
   - Compare predicted vs expected
   - Generate accuracy report + confusion matrix
   - List all misclassifications

3. **Iteratively improve the classifier**
   - Analyze each misclassification
   - Update keyword patterns in `web/lib/classifier.ts`
   - Re-run full test suite
   - Track accuracy improvement
   - Repeat until 95%+ accuracy

## Event Types
- APPLICATION_RECEIVED
- INTERVIEW_REQUEST
- INTERVIEW_SCHEDULED
- ASSESSMENT
- OFFER
- REJECTION
- RECRUITER_OUTREACH
- OTHER

## Key Files
- `web/lib/classifier.ts` - Email classification engine (this needs improvement)
- `web/prisma/schema.prisma` - Database schema
- `web/app/api/mock-ingest/route.ts` - Email ingestion endpoint

## Reference Files
See `MEMORY.md` in the repo root for full project context, architecture, and technical decisions.

---

**Let's improve the classifier to 95% accuracy!**

---

# Additional Context (if needed)

If Claude asks for more details, you can reference:
- Full project memory: `/job-inbox-os/MEMORY.md`
- Setup instructions: `/job-inbox-os/README.md`
- Current classifier code: `/job-inbox-os/web/lib/classifier.ts`