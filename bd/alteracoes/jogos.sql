ALTER TABLE `hypati67_samd`.`coorHypatia` 
ADD COLUMN `horario` TIME NOT NULL DEFAULT '00:00:00' AFTER `turma`;

ALTER TABLE `hypati67_samd`.`PlusFireNew` 
ADD COLUMN `horario` TIME NOT NULL DEFAULT '00:00:00' AFTER `turma`;

ALTER TABLE `hypati67_samd`.`jogo24Hypatia` 
ADD COLUMN `horario` TIME NOT NULL DEFAULT '00:00:00' AFTER `turma`;

ALTER TABLE `hypati67_samd`.`lotofractions` 
ADD COLUMN `horario` TIME NOT NULL DEFAULT '00:00:00' AFTER `turma`;
