-- AlterTable
ALTER TABLE `ContentBlock` MODIFY `type` ENUM('TEXT', 'IMAGE', 'LINK', 'LIST', 'NESTED_LIST') NOT NULL;
