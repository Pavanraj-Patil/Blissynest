-- AlterTable
ALTER TABLE `Product`
  ADD COLUMN `corporateOnly` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `corporateNeeds` JSON NULL;

-- Backfill: every existing row gets an empty array, matching how
-- audience/category were backfilled when they became required JSON arrays.
UPDATE `Product` SET `corporateNeeds` = JSON_ARRAY() WHERE `corporateNeeds` IS NULL;

ALTER TABLE `Product` MODIFY `corporateNeeds` JSON NOT NULL;
