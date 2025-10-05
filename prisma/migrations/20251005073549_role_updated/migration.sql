/*
  Warnings:

  - You are about to drop the `_ReviewToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `studentId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_ReviewToUser" DROP CONSTRAINT "_ReviewToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ReviewToUser" DROP CONSTRAINT "_ReviewToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "studentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_ReviewToUser";

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
