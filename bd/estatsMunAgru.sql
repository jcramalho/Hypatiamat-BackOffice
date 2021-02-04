SELECT * FROM hypat_aplicacoes.professores WHERE codigo="hprof2";

-- Municipio
select count(distinct t.turma) as nturmas, count(distinct t.idprofessor) as nprofessores, count(distinct a.user) as nalunos, 
			-- 	(select ta.* from hypat_testeconhecimentos.tasks ta) as ta,
				(select (SUM(apps.onpeak) + SUM(apps.offpeak)) from hypat_testeconhecimentos.appsinfoall apps where apps.turma = t.turma) as freqapps
			 from (select * from turmas where anoletivo = "19/20") t, (select * from escolas where localidade = "Braga") e, professores p,
			(select * from alunos) a
			 where  t.idprofessor = p.codigo and e.cod = p.escola and a.turma = t.turma;

-- turmas
select t.turma
		from (select * from turmas where anoletivo="20/21") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by t.id;

-- professores
select p.codigo
		from (select * from turmas where anoletivo="20/21") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by p.codigo;
        
-- alunos
select count(a.user) 
		from alunos a 
        where a.codprofessor in (select p.codigo
		from (select * from turmas where anoletivo="20/21") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by p.codigo)
		And a.turma in (select t.turma
		from (select * from turmas where anoletivo="20/21") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by t.turma
        );
        
SELECT count(codAluno) as numAlunosOld 
	FROM hypat_aplicacoes.turmasold
    where turma in (select t.turma
		from (select * from turmas where anoletivo="19/20") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by t.turma)
        and codProfessor in (select p.codigo
		from (select * from turmas where anoletivo="19/20") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by p.codigo);
-- tarefas 

select count(distinct ta.id) as ntarefas
		from (select * from turmas where anoletivo="19/20") t, (select * from turmasold where anoletivo = "19/20") told, (select * from escolas where localidade = "Braga") e, alunos a,
        hypat_testeconhecimentos.tasks ta
        where t.idprofessor = a.codprofessor and told.codProfessor = a.codprofessor and e.cod = a.escola and ta.user = a.user;

-- apps

select sum(offpeak) + sum(onpeak) as numapps 
		from hypat_testeconhecimentos.appsinfoall
		where turma IN (select t.turma
		from (select * from turmas where anoletivo="19/20") t, (select * from escolas where localidade = "Braga") e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by t.id);


-- Agrupamento

-- turmas
select t.turma
		from (select * from turmas where anoletivo="20/21") t, professores p
        where t.idprofessor = p.codigo and p.escola = "hypatia01"
        Group by t.id;

-- professores
select p.codigo
		from (select * from turmas where anoletivo="20/21") t, professores p
        where t.idprofessor = p.codigo and p.escola = "hypatia01"
        Group by p.codigo;
	
-- alunos
