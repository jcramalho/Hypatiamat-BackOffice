CREATE TABLE `hypati67_aplicacoes`.`comunidades` (
  `id` INT NOT NULL,
  `codigo` VARCHAR(15) NOT NULL,
  `nome` VARCHAR(30) NOT NULL,
  `municipio` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


ALTER TABLE `hypati67_aplicacoes`.`comunidades` 
CHANGE COLUMN `id` `id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `hypati67_testeconhecimentos`.`campeonatosid` 
ADD COLUMN `comunidade` VARCHAR(15) NULL DEFAULT NULL AFTER `municipio`,
ADD COLUMN `descricaoBackOffice` MEDIUMTEXT NOT NULL AFTER `comunidade`;

UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `comunidade` = 'comu_001', `descricaoBackOffice` = 'Campeonato 3 (06-06-2020) - CIM do Ave' WHERE (`cod` = 'camhy003');
UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `descricaoBackOffice` = 'Campeonato 1 (27-03-2020)' WHERE (`cod` = 'camhy001');
UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `descricaoBackOffice` = 'Campeonato 2 (04-05, 06-05, 08-05 de 2020)' WHERE (`cod` = 'camhy002');
UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `descricaoBackOffice` = 'Campeonato 4 (09-06-2020) - Vila Verde' WHERE (`cod` = 'camhy004');
UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `descricaoBackOffice` = 'Campeonato 5 (19-06-2020) - Braga' WHERE (`cod` = 'camhy005');
UPDATE `hypati67_testeconhecimentos`.`campeonatosid` SET `descricaoBackOffice` = 'Campeonato 6 (21-01, 22-01 de 2021)' WHERE (`cod` = 'camhy006');



Insert into hypati67_aplicacoes.comunidades (`codigo`, `nome`, `municipio`) Values ('comu_001', 'CIM do Ave', 'Fafe'), ('comu_001', 'CIM do Ave', 'Guimarães'),
														('comu_001', 'CIM do Ave', 'Vila Nova de Famalicão'), ('comu_001', 'CIM do Ave', 'Cabeceiras de Basto'),
                                                        ('comu_001', 'CIM do Ave', 'Mondim de Basto'), ('comu_001', 'CIM do Ave', 'Póvoa de Lanhoso'), 
                                                        ('comu_001', 'CIM do Ave', 'Vieira do Minho'), ('comu_001', 'CIM do Ave', 'Vizela');