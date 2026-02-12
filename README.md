# Job Inbox OS

MVP project to convert job-related emails into structured job events.

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Node.js 18+** and npm
- **Git**

### Setup (Any Platform)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd job-inbox-os

# 2. Start Postgres database
docker compose up -d

# 3. Install dependencies and setup database
cd web
npm install
npx prisma migrate deploy  # Apply migrations
npx prisma db seed          # Seed dev user

# 4. Start development server
npm run dev
```

Visit **http://localhost:3000** - Done! 🎉

---

## 📁 Project Structure

```
job-inbox-os/
├── docker-compose.yml          # Postgres database
├── web/                        # Next.js application
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── review/page.tsx    # Review Queue UI
│   │   └── api/               # API routes
│   │       ├── mock-ingest/   # Email ingestion
│   │       └── review/        # Review endpoints
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   └── classifier.ts      # Email classifier
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       └── seed.ts            # Dev user seeding
```

---

## 🎯 MVP Features

✅ Mock email ingestion via API
✅ Rule-based email classification (8 event types)
✅ Job + JobEvent database models
✅ Review Queue UI with Confirm/Reject
✅ Postgres data persistence
✅ Hardcoded dev user (no auth)

### Event Types

- `APPLICATION_RECEIVED` - Application confirmation emails
- `INTERVIEW_REQUEST` - Interview scheduling requests
- `INTERVIEW_SCHEDULED` - Confirmed interview appointments
- `ASSESSMENT` - Coding challenges, technical tests
- `OFFER` - Job offer letters
- `REJECTION` - Rejection notifications
- `RECRUITER_OUTREACH` - Cold recruiter messages
- `OTHER` - Everything else

---

## 🧪 Testing

### Ingest Test Emails

```bash
# Interview Request
curl -X POST http://localhost:3000/api/mock-ingest \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Interview Invitation - Software Engineer",
    "body": "We would like to schedule an interview with you for the Software Engineer position.",
    "sender": "recruiter@company.com"
  }'

# Rejection
curl -X POST http://localhost:3000/api/mock-ingest \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Application Update",
    "body": "Unfortunately, we have decided to move forward with other candidates.",
    "sender": "hr@startup.io"
  }'

# Offer
curl -X POST http://localhost:3000/api/mock-ingest \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Offer Letter - Senior Developer",
    "body": "We are pleased to offer you the position of Senior Developer.",
    "sender": "offers@bigcorp.com"
  }'
```

### View Results

- **UI**: http://localhost:3000/review
- **API**: http://localhost:3000/api/review
- **Database**: `cd web && npx prisma studio`

---

## 🔧 Development

### Environment Variables

Create `web/.env`:
```env
DATABASE_URL="postgresql://jobinbox:devpassword@localhost:5433/jobinbox_dev"
DEV_USER_ID="dev-user-1"
NODE_ENV="development"
```

### Database Management

```bash
# Apply new migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View data in browser
npx prisma studio

# Regenerate Prisma Client after schema changes
npx prisma generate
```

### Useful Commands

```bash
# View logs
docker compose logs -f postgres

# Stop services
docker compose down

# Rebuild after changes
docker compose up -d --force-recreate

# Check running containers
docker ps
```

---

## 🪟 Platform-Specific Notes

### Windows
- Use **PowerShell** or **Git Bash** for commands
- Docker Desktop must be running before `docker compose up`
- Port conflicts: Check Task Manager if port 5433 is in use

### Linux
- Install Docker Engine + Docker Compose plugin
- May need `sudo` for Docker commands (or add user to docker group)
- Use `docker compose` (not `docker-compose`)

### macOS
- Docker Desktop required
- Port 5432 might conflict with existing Postgres (we use 5433)

---

## 🐛 Troubleshooting

**Port 5433 already in use:**
```bash
# Find process using port
lsof -i :5433  # Mac/Linux
netstat -ano | findstr :5433  # Windows

# Change port in docker-compose.yml and web/.env
```

**Prisma Client not found:**
```bash
cd web
npx prisma generate
```

**Database connection failed:**
```bash
# Check Postgres is running
docker ps | grep job-inbox-postgres

# Check logs
docker compose logs postgres
```

**Next.js won't start:**
```bash
# Clear Next.js cache
rm -rf web/.next
cd web && npm run dev
```

---

## 📊 Database Schema

```prisma
User
  - id, email, name
  - → jobs[], jobEvents[]

Job
  - id, company, position, status
  - → events[]
  - Unique constraint: (userId, company, position)

JobEvent
  - id, type, status, extractedData, rawData
  - → job, user, emailMessage
  - Status: PENDING → CONFIRMED/REJECTED

EmailMessage
  - id, subject, body, sender
  - → jobEvent (1:1)
```

---

## 🔒 Security Notes

⚠️ **This is an MVP - NOT production ready!**

- No authentication (hardcoded dev user)
- Database credentials in plain text
- No input validation/sanitization
- No rate limiting
- No HTTPS

For production deployment, add:
- OAuth authentication
- Environment variable secrets
- Input validation
- CORS configuration
- SSL/TLS certificates

---

## 🛣️ Roadmap (Out of Scope for MVP)

- [ ] Gmail OAuth integration
- [ ] Multi-user authentication
- [ ] LLM-based classifier (GPT-4)
- [ ] Email threading
- [ ] Calendar integration
- [ ] Mobile UI
- [ ] Background job processing
- [ ] Analytics dashboard

---

## 📝 License

MIT

## 🤝 Contributing

This is an MVP project. For major changes, please open an issue first.

---

Built with [Claude Code](https://claude.com/claude-code) 🤖