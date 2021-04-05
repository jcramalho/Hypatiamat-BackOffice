-- cromosdb
CREATE TABLE `hypati67_testeconhecimentos`.`cromosdb` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `numero` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `descricao` VARCHAR(100) NOT NULL,
  `imagem` VARCHAR(45) NOT NULL,
  `campeonatos` INT NULL,
  `apps` INT NULL,
  `jogos` INT NULL,
  `dias` INT NULL, 
  `diferentes` INT NULL,
  `estrelas` BOOLEAN NOT NULL,
  `anoletivo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

Insert into hypati67_testeconhecimentos.cromosdb (`numero`,`nome`, `descricao`, `imagem`, `campeonatos`, `apps`, `jogos`, `dias`, `diferentes`, `estrelas`, `anoletivo`)
			Values 
	(1, 'Regular - iniciado', '3 dias consecutivos – apps de conteúdos – mais de 25 tarefas resolvidas corretamente por dia', 'cromo1.png', null, 25, null, 3, null, true,'20/21'),
    (2, 'Regular - médio', '3 dias consecutivos – apps de conteúdos – mais de 50 tarefas resolvidas corretamente por dia', 'apps2.png', null, 50, null, 3, null, true,'20/21'),
    (3, 'Regular - TOP', '3 dias consecutivos – apps de conteúdos – mais de 100 tarefas resolvidas corretamente por dia', 'apps3.png', null, 100, null, 3, null, true,'20/21'),
    (4, 'Persistente - iniciado', '5 dias consecutivos – apps de conteúdos – mais de 20 tarefas resolvidas corretamente por dia', 'apps4.png', null, 20, null, 5, null, true,'20/21'),
    (5, 'Persistente - médio', '5 dias consecutivos – apps de conteúdos – mais de 50 tarefas resolvidas corretamente por dia', 'apps5.png', null, 50, null, 5, null, true, '20/21'),
    (6, 'Persistente - TOP', '5 dias consecutivos – apps de conteúdos – mais de 80 tarefas resolvidas corretamente por dia', 'apps6.png', null, 80, null, 5, null, true,'20/21'),
    (7, 'Jogador regular - iniciado', '3 dias consecutivos – jogos – mais de 20 jogos por dia', 'jogos1.png', null, null, 20, 3, null, true, '20/21'),
    (8, 'Jogador regular - médio', '3 dias consecutivos – jogos – mais de 30 jogos por dia', 'jogos2.png', null, null, 30, 3, null, true, '20/21'),
    (9, 'Jogador regular - TOP', '3 dias consecutivos – jogos – mais de 75 jogos por dia', 'jogos3.png', null, null, 75, 3, null, true, '20/21'),
    (10, 'Jogador persistente - iniciado', '5 dias consecutivos – jogos – mais de 15 jogos por dia', 'jogos4.png', null, null, 15, 5, null, true, '20/21'),
    (11, 'Jogador persistente - médio', '5 dias consecutivos – jogos – mais de 30 jogos por dia', 'jogos5.png', null, null, 30, 5, null, true, '20/21'),
    (12, 'Jogador persistente - avançado', '5 dias consecutivos – jogos – mais de 60 jogos por dia', 'jogos6.png', null, null, 60, 5, null, true, '20/21'),
    (13, '“atleta” regular', 'Participou nos campeonatos – 1 campeonato', 'campeonatos1.png', 1, null, null, null, null, false, '20/21'),
    (14, '“atleta” persistente', 'Participou nos campeonatos – 2 campeonatos ou mais', 'campeonatos2.png', 2, null, null, null, null, false, '20/21'),
    (15, 'Aplicado', '2 apps diferentes – apps de conteúdos – mais de 500 tarefas resolvidas corretamente', 'apps7.png', null, 500, null, null, 2, false,'20/21'),
    (16, 'Muito aplicado', '5 apps diferentes – apps de conteúdos – mais de 750 tarefas resolvidas corretamente', 'apps8.png', null, 750, null, null, 5, false,'20/21'),
    (17, 'Aplicado TOP', '9 apps diferentes – apps de conteúdos – mais de 1000 tarefas resolvidas corretamente', 'apps9.png', null, 1000, null, null, 8, false,'20/21'),
    (18, 'Muito Aplicado TOP', '12+ apps diferentes – apps de conteúdos – mais de 1500 tarefas resolvidas corretamente', 'apps10.png', null, 1500, null, null, 12, false,'20/21'),
    (19, 'Jogador +', '5 jogos diferentes –  jogos – mais de 1500 jogos', 'jogos7.png', null, null, 1500, null, 5, false, '20/21'),
    (20, 'Jogador TOP +', '+7 jogos diferentes –  jogos – mais de 2500 jogos', 'jogos8.png', null, null, 2500, null, 7, false, '20/21');

-- cromos dos users
CREATE TABLE `hypati67_testeconhecimentos`.`cromos_alunos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(20) NOT NULL,
  `idcromo` INT NOT NULL,
  `oldfrequencia` INT NULL,
  `frequencia` INT NULL,
  `lastdate` DATE NOT NULL,
  `lastcalculo` DATE NOT NULL,
  `virado` BOOLEAN NOT NULL,
  `anoletivo` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- rascunho apps ('aluno1', 'hypatiatmp')
Select userid, sum(ncertas) as ncertas, count(distinct appid, grupo) as napps 
		from appsinfoall 
        where lastdate between '2020-09-01' and '2021-09-01'
        group by userid 
        order by ncertas desc, napps desc;


