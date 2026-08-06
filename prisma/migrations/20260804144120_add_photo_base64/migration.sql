/*
  Warnings:

  - You are about to drop the column `photo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `produteurId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `producteurId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_produteurId_fkey`;

-- DropIndex
DROP INDEX `Product_produteurId_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `photo`,
    DROP COLUMN `produteurId`,
    ADD COLUMN `photoData` VARCHAR(191) NULL,
    ADD COLUMN `photoMimeType` VARCHAR(191) NULL,
    ADD COLUMN `producteurId` INTEGER NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Product_producteurId_fkey` ON `Product`(`producteurId`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_producteurId_fkey` FOREIGN KEY (`producteurId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
