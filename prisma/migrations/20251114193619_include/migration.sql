-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailOtpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerificationOtp" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "loginOtp" TEXT,
ADD COLUMN     "loginOtpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "loginOtpExpiry" TIMESTAMP(3);
