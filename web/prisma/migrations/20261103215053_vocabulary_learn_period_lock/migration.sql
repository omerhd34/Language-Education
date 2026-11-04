-- AlterTable
ALTER TABLE `user` ADD COLUMN `vocabularyLearnLockedUntil` DATETIME(3) NULL,
    ADD COLUMN `vocabularyLearnSelectedCount` INTEGER NOT NULL DEFAULT 0;
