-- DropForeignKey
ALTER TABLE `TransactionTag` DROP FOREIGN KEY `TransactionTag_transactionId_fkey`;

-- AddForeignKey
ALTER TABLE `TransactionTag` ADD CONSTRAINT `TransactionTag_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
