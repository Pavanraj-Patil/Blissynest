-- AlterTable
ALTER TABLE `Product` ADD COLUMN `codAvailable` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `SiteSettings` ADD COLUMN `codEnabled` BOOLEAN NOT NULL DEFAULT true;
