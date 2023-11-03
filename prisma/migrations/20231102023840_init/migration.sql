-- CreateTable
CREATE TABLE `Account` (
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `side` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `parentAccountName` VARCHAR(191) NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NULL,
    `debitAccountName` VARCHAR(191) NOT NULL,
    `creditAccountName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodicTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `amount` INTEGER NOT NULL,
    `interval` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NULL,
    `debitAccountName` VARCHAR(191) NOT NULL,
    `creditAccountName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodicTransactionRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `periodicTransactionId` INTEGER NOT NULL,
    `transactionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `transactionId` INTEGER NOT NULL,
    `tagName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_parentAccountName_fkey` FOREIGN KEY (`parentAccountName`) REFERENCES `Account`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_debitAccountName_fkey` FOREIGN KEY (`debitAccountName`) REFERENCES `Account`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_creditAccountName_fkey` FOREIGN KEY (`creditAccountName`) REFERENCES `Account`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicTransaction` ADD CONSTRAINT `PeriodicTransaction_debitAccountName_fkey` FOREIGN KEY (`debitAccountName`) REFERENCES `Account`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicTransaction` ADD CONSTRAINT `PeriodicTransaction_creditAccountName_fkey` FOREIGN KEY (`creditAccountName`) REFERENCES `Account`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicTransactionRecord` ADD CONSTRAINT `PeriodicTransactionRecord_periodicTransactionId_fkey` FOREIGN KEY (`periodicTransactionId`) REFERENCES `PeriodicTransaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicTransactionRecord` ADD CONSTRAINT `PeriodicTransactionRecord_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionTag` ADD CONSTRAINT `TransactionTag_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionTag` ADD CONSTRAINT `TransactionTag_tagName_fkey` FOREIGN KEY (`tagName`) REFERENCES `Tag`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
