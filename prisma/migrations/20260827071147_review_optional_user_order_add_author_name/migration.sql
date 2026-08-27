-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_userId_fkey`;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `authorName` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NULL,
    MODIFY `orderId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
