SELECT * FROM hypat_aplicacoes.professores WHERE codigo="hprof2";

-- Municipio
select count(t.turma) as nturmas, count(p.codigo) as nprofessores, (select count(a.user) from alunos a where a.escola = e.cod) as nalunos, 
				(select (SUM(apps.onpeak) + SUM(apps.offpeak)) from hypat_testeconhecimentos.appsinfoall apps where apps.turma = t.turma) as freqapps
			 from (select * from turmas where anoletivo = "20/21") t, (select * from escolas where localidade = "Braga") e, professores p 
			 where  e.cod = p.escola and t.idprofessor = p.codigo;
-- Agrupamento

select count(t.turma) as nturmas, count(p.codigo) as nprofessores, (select count(a.user) from alunos a where a.escola = "hypatia01") as nalunos,
				(select (SUM(apps.onpeak) + SUM(apps.offpeak)) from hypat_testeconhecimentos.appsinfoall apps where apps.codProf = p.codigo) as freqapps
			 from turmas t, professores p 
			 where p.escola = "hypatia01" and t.anoletivo = "20/21" and t.idprofessor = p.codigo;