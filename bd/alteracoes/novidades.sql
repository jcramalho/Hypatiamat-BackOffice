CREATE TABLE `hypati67_aplicacoes`.`novidades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(70) NOT NULL,
  `data` DATE NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `hypati67_aplicacoes`.`subnovidades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idNovidade` INT NOT NULL,
  `subnovidade` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `hypati67_aplicacoes`.`novidades` 
ADD COLUMN `link` VARCHAR(100) NULL AFTER `data`;
