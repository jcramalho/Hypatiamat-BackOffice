SELECT * FROM hypat_testeconhecimentos.base_dados;

/* monotorizacao por municipios/localidade */
SELECT esc.localidade, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, avg(jogo.pontuacao) as media, count(jogo.pontuacao) as number 
		FROM hypat_samd.batalhanaval jogo, hypat_aplicacoes.escolas esc
        WHERE jogo.turma!='99' AND jogo.tipo='2' AND jogo.idescola=esc.cod and (jogo.data BETWEEN '2019-09-01' and '2020-09-01')
        Group by esc.localidade
        Order by esc.localidade;

/* monotorizacao por escolas/agrupamentos */
SELECT esc.cod, esc.nome, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, avg(jogo.pontuacao) as media, count(jogo.pontuacao) as number 
		FROM hypat_samd.batalhanaval jogo, hypat_aplicacoes.escolas esc
        WHERE jogo.turma!='99' AND jogo.tipo='2' AND jogo.idescola=esc.cod and (jogo.data BETWEEN '2019-09-01' and '2020-09-01') AND esc.localidade = "Braga"
        Group by jogo.idescola
        Order by esc.nome;
        
/* monotorizacao por professores */

SELECT al.codprofessor, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, avg(jogo.pontuacao) as media, count(jogo.pontuacao) as number 
		FROM hypat_samd.batalhanaval jogo, hypat_aplicacoes.alunos al
        WHERE jogo.turma!='99' and jogo.idescola="hypatia01" and jogo.tipo='2' AND al.user = jogo.idaluno and (jogo.data BETWEEN '2019-09-01' and '2020-09-01') 
        Group by al.codprofessor
        Order by al.codprofessor;