ALTER TABLE `UserVocabularyWord` ADD COLUMN `studyStartedAt` DATETIME(3) NULL;

CREATE INDEX `UserVocabularyWord_userId_status_studyStartedAt_idx` ON `UserVocabularyWord`(`userId`, `status`, `studyStartedAt`);