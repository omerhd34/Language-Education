-- CreateTable
CREATE TABLE `UserVocabularyWord` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `wordId` VARCHAR(191) NOT NULL,
    `status` ENUM('KNOWN', 'LEARNING') NOT NULL,
    `statusSetAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserVocabularyWord_userId_idx`(`userId`),
    INDEX `UserVocabularyWord_userId_status_statusSetAt_idx`(`userId`, `status`, `statusSetAt`),
    UNIQUE INDEX `UserVocabularyWord_userId_wordId_key`(`userId`, `wordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserVocabularyWord` ADD CONSTRAINT `UserVocabularyWord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
