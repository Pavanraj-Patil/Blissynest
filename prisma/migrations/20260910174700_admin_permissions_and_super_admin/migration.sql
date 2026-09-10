-- Add the new column as nullable first (existing rows have no value yet),
-- and widen the enum to include the new role -- existing CUSTOMER/ADMIN
-- rows are still valid members of the widened enum, no rewrite needed for
-- that part.
ALTER TABLE `User`
  ADD COLUMN `adminPermissions` JSON NULL,
  MODIFY `role` ENUM('CUSTOMER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- Backfill: give every row an empty permissions array, and promote existing
-- ADMIN rows to SUPER_ADMIN -- that's what ADMIN meant before this
-- migration (full, unscoped access), and there's no way to infer a scoped
-- permission set for them from nothing, so preserving their current full
-- access is the only non-destructive choice.
UPDATE `User` SET `adminPermissions` = JSON_ARRAY();
UPDATE `User` SET `role` = 'SUPER_ADMIN' WHERE `role` = 'ADMIN';

-- Every row now has a real value, so the column can be required -- matches
-- how occasionTags/recipientTags/audience/category are already declared.
ALTER TABLE `User` MODIFY `adminPermissions` JSON NOT NULL;
