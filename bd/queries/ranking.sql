SELECT * FROM hypati67_aplicacoes.turmasold where anoletivo="19/20";

    
Select user, (select sum(jogo.pontuacao) as total
		from hypati67_samd.batalhanaval jogo
        where jogo.idaluno = a.user
        order by total desc) as rankTurma
	from alunos a where turma="3A-20-1" and codprofessor="hprof2";
    
select idaluno, sum(pontuacao) as total 
		from hypati67_samd.batalhanaval
        where idescola="hypatia01" and turma="3A-20-1" 
        group by idaluno order by total desc;
        
select ranking.*, @rownum := @rownum + 1 AS posicao 
	from (select idaluno, sum(pontuacao) as total 
			from hypati67_samd.batalhanaval
			where idescola="hypatia01" and turma="3A-20-1" 
			group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r;

select @rownum := @rownum + 1 AS posicao, ranking.*  
	from (select idaluno, sum(pontuacao) as total
			from hypati67_samd.batalhanaval
			where idescola="hypatia01"
			group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r;

-- query ranking final jogos anoletivo="2020/2021"
select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
		posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, posicaoturma.total
		from ((SELECT a.*
				FROM hypati67_aplicacoes.alunos a
				Where escola="150253" and turma="4M-21-4")
			UNION
			 (SELECT a.*
				FROM (select * from alunos where escola="150253") a
				RIGHT JOIN (select * from turmasold where codProfessor="heliafreit" and turma="4M-21-4") aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select idaluno, sum(pontuacao) as total 
						from hypati67_samd.batalhanaval
						where idescola="150253" and turma="4M-21-4" and data between '2020-09-01' and '2021-09-01' 
						group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from hypati67_samd.batalhanaval
							where idescola="150253" and data between '2020-09-01' and '2021-09-01'
							group by idaluno order by total desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from hypati67_samd.batalhanaval
							where data between '2020-09-01' and '2021-09-01'
							group by idaluno order by total desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.idaluno = a.user and posicaoturma.idaluno = a.user and posicaoHypatia.idaluno = a.user
                    Order by a.numero;
			 
-- query ranking final jogos anoletivo="2020/2021"

-- alunos old e alunos
(SELECT a.*
	FROM hypati67_aplicacoes.alunos a
    Where escola="120297" and turma="6D-21-6")
UNION
 (SELECT a.*
	FROM (select * from alunos where escola="120297") a
    RIGHT JOIN (select * from turmasold where codProfessor="jnrs2019" and turma="6D-21-6") aold ON a.user = aold.codAluno);