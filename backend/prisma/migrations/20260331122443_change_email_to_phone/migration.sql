/*
  Warnings:

  - You are about to drop the column `email` on the `Message` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "email",
ADD COLUMN     "phone" TEXT NOT NULL;
