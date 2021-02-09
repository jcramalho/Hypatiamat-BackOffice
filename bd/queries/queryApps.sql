SELECT * FROM hypat_testeconhecimentos.appsinfoall;
SELECT count(*) FROM hypat_testeconhecimentos.appsinfoall;
SELECT count(*) FROM hypat_testeconhecimentos.appsinfo;
/* temas */
SELECT tema, codtema FROM hypat_testeconhecimentos.subtemas WHERE codtema!=100 GROUP BY codtema;

SELECT tema,subtema, codtema, codsubtema FROM hypat_testeconhecimentos.subtemas WHERE codtema=100 GROUP BY codsubtema ;


/* todas as apps por municipios */
SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak
 FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between '2019-09-01' and '2020-09-01')) as apps, hypat_aplicacoes.professores prof,  
		hypat_aplicacoes.escolas esc
 WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo
 GROUP BY esc.localidade
 Order by esc.localidade;
 
 

/* todas as apps realizadas numa localidade por escola */

SELECT esc.cod, esc.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak
 FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between '2019-09-01' and '2020-09-01')) as apps, hypat_aplicacoes.professores prof,  
		(select * from hypat_aplicacoes.escolas where localidade="Braga") as esc
 WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo
 GROUP BY esc.cod
 Order by esc.nome;
 
 
 /* Todos os professores de uma escola*/

SELECT apps.codProf, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, (ncertas/ntotal)*100 as acerto, SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak
 FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between '2019-09-01' and '2020-09-01')) as apps, 
		(select * from hypat_aplicacoes.professores where escola="hypatia01") as prof
 WHERE  apps.codProf=prof.codigo
 GROUP BY apps.codProf
 Order by apps.codProf; 

/* todas as apps realizadas pelos alunos de uma dada turma */
SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, (sum(apps.ncertas)/sum(apps.ntotal))*100 as acerto, 
				SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak
 FROM (select * from hypat_testeconhecimentos.appsinfoall where turma='2H-20-1' AND codProf='hprof2' AND (lastdate between '2019-09-01' and '2020-09-01')) as apps,
		hypat_aplicacoes.alunos al
 where al.user = apps.userid
 GROUP BY apps.userid
 Order by al.numero;