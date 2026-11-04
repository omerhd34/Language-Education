-- AlterTable
ALTER TABLE `UserVocabularyWord` ADD COLUMN `passedMultipleChoice` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `UserVocabularyWord` ADD COLUMN `passedFillBlank` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `UserVocabularyWord` ADD COLUMN `passedListening` BOOLEAN NOT NULL DEFAULT false;
