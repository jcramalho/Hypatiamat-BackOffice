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
        
select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, posicaoescola.posicao as posEscola, posicaoturma.total
		from (select * from alunos where turma="3A-20-1" and codprofessor="hprof2") a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select idaluno, sum(pontuacao) as total 
						from hypati67_samd.batalhanaval
						where idescola="hypatia01" and turma="3A-20-1" 
						group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from hypati67_samd.batalhanaval
							where idescola="hypatia01"
							group by idaluno order by total desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola
					where posicaoescola.idaluno = a.user and posicaoturma.idaluno = a.user;
			 
        
        