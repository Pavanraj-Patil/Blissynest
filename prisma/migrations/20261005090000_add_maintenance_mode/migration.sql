-- AlterTable
ALTER TABLE `SiteSettings` ADD COLUMN `maintenanceMessage` TEXT NULL,
    ADD COLUMN `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `maintenanceReturnAt` DATETIME(3) NULL;

