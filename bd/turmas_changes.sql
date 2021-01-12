ALTER TABLE `hypat_aplicacoes`.`turmas` 
ADD COLUMN `anoletivo` VARCHAR(10) NOT NULL AFTER `turma`;

ALTER TABLE `hypat_aplicacoes`.`turmasold` 
ADD COLUMN `anoletivo` VARCHAR(10) NOT NULL AFTER `codProfessor`;