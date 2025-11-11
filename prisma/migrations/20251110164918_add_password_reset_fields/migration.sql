-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordRestToken" TEXT,
ADD COLUMN     "passwordRestTokenExpiry" TIMESTAMP(3);
