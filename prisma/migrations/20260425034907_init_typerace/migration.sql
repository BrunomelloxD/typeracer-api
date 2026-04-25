-- CreateEnum
CREATE TYPE "typerace"."GameMode" AS ENUM ('SOLO', 'DUEL');

-- CreateEnum
CREATE TYPE "typerace"."Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "typerace"."RoomStatus" AS ENUM ('WAITING', 'RUNNING', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "typerace"."texts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" "typerace"."Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "language" TEXT NOT NULL DEFAULT 'pt-br',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typerace"."rooms" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "typerace"."RoomStatus" NOT NULL DEFAULT 'WAITING',
    "textId" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typerace"."scores" (
    "id" TEXT NOT NULL,
    "mode" "typerace"."GameMode" NOT NULL,
    "playerName" TEXT NOT NULL,
    "wpm" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "textId" TEXT,
    "roomId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "texts_difficulty_idx" ON "typerace"."texts"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_code_key" ON "typerace"."rooms"("code");

-- CreateIndex
CREATE INDEX "rooms_code_idx" ON "typerace"."rooms"("code");

-- CreateIndex
CREATE INDEX "rooms_status_idx" ON "typerace"."rooms"("status");

-- CreateIndex
CREATE INDEX "scores_mode_idx" ON "typerace"."scores"("mode");

-- CreateIndex
CREATE INDEX "scores_roomId_idx" ON "typerace"."scores"("roomId");

-- CreateIndex
CREATE INDEX "scores_createdAt_idx" ON "typerace"."scores"("createdAt");

-- AddForeignKey
ALTER TABLE "typerace"."rooms" ADD CONSTRAINT "rooms_textId_fkey" FOREIGN KEY ("textId") REFERENCES "typerace"."texts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typerace"."scores" ADD CONSTRAINT "scores_textId_fkey" FOREIGN KEY ("textId") REFERENCES "typerace"."texts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typerace"."scores" ADD CONSTRAINT "scores_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "typerace"."rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
