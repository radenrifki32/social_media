-- CreateTable
CREATE TABLE `Menu` (
    `id` VARCHAR(191) NOT NULL,
    `name_menu` VARCHAR(191) NOT NULL,
    `url_menu` VARCHAR(191) NOT NULL,
    `icon_menu` VARCHAR(191) NOT NULL,
    `parent_menu_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_parent_menu_id_fkey` FOREIGN KEY (`parent_menu_id`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
