ALTER TABLE `user`
    ADD COLUMN `avatarData` LONGBLOB NULL,
    ADD COLUMN `avatarMimeType` VARCHAR(64) NULL;
