
CREATE TABLE IF NOT EXISTS `UserRoles` (`name` VARCHAR(255) NOT NULL UNIQUE , `description` VARCHAR(255), PRIMARY KEY (`name`));
CREATE TABLE IF NOT EXISTS `Users` (`username` VARCHAR(255) NOT NULL UNIQUE , `name` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `roleId` VARCHAR(255) NOT NULL, PRIMARY KEY (`username`), FOREIGN KEY (`roleId`) REFERENCES `UserRoles` (`name`) ON DELETE NO ACTION ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS `AuditEvents` (`id` INTEGER UNSIGNED auto_increment , `entity` VARCHAR(255) NOT NULL, `entityId` VARCHAR(255) NOT NULL, `datetime` DATETIME NOT NULL, `action` VARCHAR(255), `username` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`username`) REFERENCES `Users` (`username`) ON DELETE NO ACTION ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS `ProtectionAreas` (`id` INTEGER UNSIGNED auto_increment , `name` VARCHAR(255) NOT NULL UNIQUE, `lat` FLOAT, `long` FLOAT, `radius` INTEGER, PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `SuperHeroes` (`id` INTEGER UNSIGNED auto_increment , `name` VARCHAR(255) NOT NULL UNIQUE, `alias` VARCHAR(255), `protectionAreaId` INTEGER UNSIGNED NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`protectionAreaId`) REFERENCES `ProtectionAreas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE);
CREATE TABLE IF NOT EXISTS `SuperPowers` (`id` INTEGER UNSIGNED auto_increment , `name` VARCHAR(255) NOT NULL UNIQUE, `description` VARCHAR(255), PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `SuperHeroesPowers` (`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `superHeroId` INTEGER UNSIGNED , `superPowerId` INTEGER UNSIGNED NOT NULL , PRIMARY KEY (`superHeroId`, `superPowerId`), FOREIGN KEY (`superHeroId`) REFERENCES `SuperHeroes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (`superPowerId`) REFERENCES `SuperPowers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);

INSERT INTO UserRoles (name, description)
	SELECT 'Admin', 'Admin users can list and modify contents'
	FROM dual
	WHERE NOT EXISTS (
		SELECT name FROM UserRoles WHERE name='Admin'
	);

INSERT INTO UserRoles (name, description)
	SELECT 'Standard', 'Standard users can just list contents'
	FROM dual
	WHERE NOT EXISTS (
		SELECT name FROM UserRoles WHERE name='Standard'
	);

INSERT INTO Users (username, name, password, roleId)
	SELECT 'admin', 'Administrator', '$2b$10$WRi/8imxDHDY1KioI/TMLuiyAWgg9S8eB8rUKmJnLLl8OZvuTVrwy', 'Admin'
	FROM dual
	WHERE NOT EXISTS (
		SELECT name FROM Users WHERE username='admin'
	);
