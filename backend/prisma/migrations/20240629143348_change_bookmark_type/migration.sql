/*
  Warnings:

  - The `bookmarks` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bookmarks",
ADD COLUMN     "bookmarks" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
