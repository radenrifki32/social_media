/*
  Warnings:

  - You are about to drop the column `flag_like` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Like` DROP COLUMN `flag_like`;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `flag_like` BOOLEAN NOT NULL DEFAULT false;
