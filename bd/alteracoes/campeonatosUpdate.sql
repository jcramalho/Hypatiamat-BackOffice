ALTER TABLE `hypati67_testeconhecimentos`.`campeonatos` 
ADD COLUMN `turma` VARCHAR(8) NOT NULL AFTER `njogos`,
ADD COLUMN `codprofessor` VARCHAR(20) NOT NULL AFTER `turma`;

ALTER TABLE `hypati67_testeconhecimentos`.`campeonatos` 
CHANGE COLUMN `turma` `turma` VARCHAR(8) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL ,
CHANGE COLUMN `codprofessor` `codprofessor` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_unicode_ci' NOT NULL ;
