ALTER TABLE `user`
    ADD COLUMN `vocabularyLearnLastSelectedAt` DATETIME(3) NULL,
    ADD COLUMN `vocabularyLearnLastUnlockedAt` DATETIME(3) NULL;

UPDATE `user` AS u
SET `vocabularyLearnLastSelectedAt` = (
    SELECT MAX(w.`statusSetAt`)
    FROM `UserVocabularyWord` AS w
    WHERE w.`userId` = u.`id` AND w.`status` = 'LEARNING'
)
WHERE u.`vocabularyLearnLastSelectedAt` IS NULL;
