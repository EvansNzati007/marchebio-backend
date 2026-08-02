-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NULL,
    `numTel` VARCHAR(191) NOT NULL,
    `role` ENUM('PRODUCTEUR', 'ACHETEUR', 'ADMIN') NOT NULL DEFAULT 'ACHETEUR',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_numTel_key`(`numTel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `photo` VARCHAR(191) NULL,
    `produteurId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateCommande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `montantTotal` DOUBLE NOT NULL,
    `statut` ENUM('NOUVELLE', 'PREPAREE', 'LIVREE') NOT NULL DEFAULT 'NOUVELLE',
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LigneCommande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `prixUnitaire` DOUBLE NOT NULL,
    `productId` INTEGER NOT NULL,
    `commandeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` INTEGER NOT NULL,
    `commentaire` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `producteurId` INTEGER NOT NULL,
    `commandeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_produteurId_fkey` FOREIGN KEY (`produteurId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commande` ADD CONSTRAINT `Commande_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LigneCommande` ADD CONSTRAINT `LigneCommande_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LigneCommande` ADD CONSTRAINT `LigneCommande_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `Commande`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_producteurId_fkey` FOREIGN KEY (`producteurId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_commandeId_fkey` FOREIGN KEY (`commandeId`) REFERENCES `Commande`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
