-- AlterTable
ALTER TABLE `Product` ADD COLUMN `attribute` VARCHAR(191) NULL,
    ADD COLUMN `badge` ENUM('BESTSELLER', 'NEW') NULL;
