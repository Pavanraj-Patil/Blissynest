-- CreateTable
CREATE TABLE `PendingCheckout` (
    `id` VARCHAR(191) NOT NULL,
    `razorpayOrderId` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `PendingCheckout_razorpayOrderId_key`(`razorpayOrderId`),
    INDEX `PendingCheckout_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CreateIndex
CREATE UNIQUE INDEX `Order_razorpayOrderId_key` ON `Order`(`razorpayOrderId`);
