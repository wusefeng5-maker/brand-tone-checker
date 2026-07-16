-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'AGENCY');

-- CreateEnum
CREATE TYPE "AiCallStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audience" TEXT,
    "toneTags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "forbiddenWords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "requiredWords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "exampleCopy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandProfileId" TEXT,
    "inputText" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "issues" JSONB NOT NULL DEFAULT '[]',
    "rewrite" TEXT,
    "tagHits" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Check_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Check_score_range" CHECK ("score" >= 0 AND "score" <= 100)
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCallLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "AiCallStatus" NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCallLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_clerkUserId_key" ON "UserProfile"("clerkUserId");

-- CreateIndex
CREATE INDEX "UserProfile_createdAt_idx" ON "UserProfile"("createdAt");

-- CreateIndex
CREATE INDEX "BrandProfile_userId_idx" ON "BrandProfile"("userId");

-- CreateIndex
CREATE INDEX "BrandProfile_userId_createdAt_idx" ON "BrandProfile"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Check_userId_createdAt_idx" ON "Check"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Check_brandProfileId_createdAt_idx" ON "Check"("brandProfileId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UsageLog_userId_day_key" ON "UsageLog"("userId", "day");

-- CreateIndex
CREATE INDEX "UsageLog_userId_idx" ON "UsageLog"("userId");

-- CreateIndex
CREATE INDEX "AiCallLog_userId_createdAt_idx" ON "AiCallLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiCallLog_checkId_idx" ON "AiCallLog"("checkId");

-- CreateIndex
CREATE INDEX "AiCallLog_provider_model_idx" ON "AiCallLog"("provider", "model");

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_brandProfileId_fkey" FOREIGN KEY ("brandProfileId") REFERENCES "BrandProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCallLog" ADD CONSTRAINT "AiCallLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCallLog" ADD CONSTRAINT "AiCallLog_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE SET NULL ON UPDATE CASCADE;
