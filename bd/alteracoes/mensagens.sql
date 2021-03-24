CREATE TABLE `hypati67_aplicacoes`.`mensagens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codprofessor` VARCHAR(15) NOT NULL,
  `user` VARCHAR(15) NOT NULL,
  `idMensagem` INT NOT NULL,
  `data` DATETIME NOT NULL,
  `visto` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));
  
  CREATE TABLE `hypati67_aplicacoes`.`mensagem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mensagem` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`));
