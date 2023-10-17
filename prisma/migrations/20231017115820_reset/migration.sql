/*
  Warnings:

  - You are about to drop the `AccountTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PeriodicTransactionTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccountTag` DROP FOREIGN KEY `AccountTag_accountName_fkey`;

-- DropForeignKey
ALTER TABLE `AccountTag` DROP FOREIGN KEY `AccountTag_tagName_fkey`;

-- DropForeignKey
ALTER TABLE `PeriodicTransactionTag` DROP FOREIGN KEY `PeriodicTransactionTag_periodicTransactionId_fkey`;

-- DropForeignKey
ALTER TABLE `PeriodicTransactionTag` DROP FOREIGN KEY `PeriodicTransactionTag_tagName_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionTag` DROP FOREIGN KEY `TransactionTag_tagName_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionTag` DROP FOREIGN KEY `TransactionTag_transactionId_fkey`;

-- DropTable
DROP TABLE `AccountTag`;

-- DropTable
DROP TABLE `PeriodicTransactionTag`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `TransactionTag`;

-- CreateTable
CREATE TABLE `PeriodicTransactionRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `periodicTransactionId` INTEGER NOT NULL,
    `transactionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PeriodicTransactionRecord` ADD CONSTRAINT `PeriodicTransactionRecord_periodicTransactionId_fkey` FOREIGN KEY (`periodicTransactionId`) REFERENCES `PeriodicTransaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicTransactionRecord` ADD CONSTRAINT `PeriodicTransactionRecord_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
