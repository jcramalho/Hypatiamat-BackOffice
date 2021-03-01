CREATE TABLE `hypat_aplicacoes`.`parametrosprof` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codProfessor` VARCHAR(15) NOT NULL,
  `limiteTurmas` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;
