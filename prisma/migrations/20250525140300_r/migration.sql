/*
  Warnings:

  - You are about to drop the `Case` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CaseLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Convict` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrimeArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investigator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Case` DROP FOREIGN KEY `Case_ID_SLIDCHY_fkey`;

-- DropForeignKey
ALTER TABLE `Case` DROP FOREIGN KEY `Case_ID_ZASUDZ_fkey`;

-- DropForeignKey
ALTER TABLE `CaseLink` DROP FOREIGN KEY `CaseLink_ID_SPRAVY_fkey`;

-- DropForeignKey
ALTER TABLE `CaseLink` DROP FOREIGN KEY `CaseLink_ID_STATYA_fkey`;

-- DropTable
DROP TABLE `Case`;

-- DropTable
DROP TABLE `CaseLink`;

-- DropTable
DROP TABLE `Convict`;

-- DropTable
DROP TABLE `CrimeArticle`;

-- DropTable
DROP TABLE `Investigator`;

-- CreateTable
CREATE TABLE `Convicts` (
    `ID_ZASUDZ` INTEGER NOT NULL AUTO_INCREMENT,
    `FIO_ZASUDZ` VARCHAR(191) NOT NULL,
    `DATE_NARODZH` DATETIME(3) NULL,
    `ADRESS_ZASUDZ` VARCHAR(191) NOT NULL,
    `CONTACT_ZASUDZ` VARCHAR(191) NULL,

    PRIMARY KEY (`ID_ZASUDZ`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Investigators` (
    `ID_SLIDCHY` INTEGER NOT NULL AUTO_INCREMENT,
    `FIO_SLIDCHY` VARCHAR(191) NOT NULL,
    `POSADA_SLIDCHY` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID_SLIDCHY`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CrimeArticles` (
    `ID_STATYA` INTEGER NOT NULL AUTO_INCREMENT,
    `NUMBER_STATYA` VARCHAR(191) NOT NULL,
    `DESCRIPTION_STATYA` VARCHAR(191) NULL,

    PRIMARY KEY (`ID_STATYA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cases` (
    `ID_SPRAVY` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_ZASUDZ` INTEGER NULL,
    `ID_SLIDCHY` INTEGER NULL,
    `STATUS_SPRAVY` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID_SPRAVY`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaseLinks` (
    `ID_SPRAVY` INTEGER NOT NULL,
    `ID_STATYA` INTEGER NOT NULL,
    `DATE_SPRAVY` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ID_SPRAVY`, `ID_STATYA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cases` ADD CONSTRAINT `Cases_ID_ZASUDZ_fkey` FOREIGN KEY (`ID_ZASUDZ`) REFERENCES `Convicts`(`ID_ZASUDZ`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cases` ADD CONSTRAINT `Cases_ID_SLIDCHY_fkey` FOREIGN KEY (`ID_SLIDCHY`) REFERENCES `Investigators`(`ID_SLIDCHY`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaseLinks` ADD CONSTRAINT `CaseLinks_ID_SPRAVY_fkey` FOREIGN KEY (`ID_SPRAVY`) REFERENCES `Cases`(`ID_SPRAVY`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaseLinks` ADD CONSTRAINT `CaseLinks_ID_STATYA_fkey` FOREIGN KEY (`ID_STATYA`) REFERENCES `CrimeArticles`(`ID_STATYA`) ON DELETE RESTRICT ON UPDATE CASCADE;
