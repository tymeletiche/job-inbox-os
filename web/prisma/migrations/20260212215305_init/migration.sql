-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('APPLICATION_RECEIVED', 'INTERVIEW_REQUEST', 'INTERVIEW_SCHEDULED', 'ASSESSMENT', 'OFFER', 'REJECTION', 'RECRUITER_OUTREACH', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEvent" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailMessageId" TEXT,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "extractedData" JSONB,
    "rawData" JSONB,
    "confirmedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawHeaders" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_company_position_idx" ON "Job"("company", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Job_userId_company_position_key" ON "Job"("userId", "company", "position");

-- CreateIndex
CREATE UNIQUE INDEX "JobEvent_emailMessageId_key" ON "JobEvent"("emailMessageId");

-- CreateIndex
CREATE INDEX "JobEvent_userId_status_idx" ON "JobEvent"("userId", "status");

-- CreateIndex
CREATE INDEX "JobEvent_jobId_idx" ON "JobEvent"("jobId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_emailMessageId_fkey" FOREIGN KEY ("emailMessageId") REFERENCES "EmailMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
