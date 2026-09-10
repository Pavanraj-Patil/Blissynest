-- Drop the compound index; JSON columns can't be indexed the same way.
DROP INDEX `Product_audience_category_idx` ON `Product`;

-- Add new JSON columns alongside the old scalar ones.
ALTER TABLE `Product`
  ADD COLUMN `audience_new` JSON NULL,
  ADD COLUMN `category_new` JSON NULL;

-- Backfill: wrap each row's single audience value into a one-element array.
-- COLLEAGUES is being dropped as an audience entirely, so those rows clear
-- to an empty array (still shows under Shop -> All, just no longer pinned
-- to a specific audience page) rather than carrying a value the app no
-- longer recognizes.
UPDATE `Product`
SET `audience_new` = CASE
  WHEN `audience` IS NULL OR `audience` = 'COLLEAGUES' THEN JSON_ARRAY()
  ELSE JSON_ARRAY(`audience`)
END;

-- Backfill: wrap each row's single category value into a one-element array.
-- No vocabulary filtering here -- every existing value (including the small
-- number of legacy "bestsellers"/"birthday-gifts" rows that predate both the
-- shop-category and collection-category vocabularies) is preserved as-is.
UPDATE `Product`
SET `category_new` = JSON_ARRAY(`category`);

-- Swap the old scalar columns out for the new JSON ones.
ALTER TABLE `Product`
  DROP COLUMN `audience`,
  DROP COLUMN `category`;

ALTER TABLE `Product`
  RENAME COLUMN `audience_new` TO `audience`,
  RENAME COLUMN `category_new` TO `category`;

-- Every row now has a real (possibly empty) array, so both columns can be
-- required, matching how occasionTags/recipientTags are already declared.
ALTER TABLE `Product`
  MODIFY `audience` JSON NOT NULL,
  MODIFY `category` JSON NOT NULL;
