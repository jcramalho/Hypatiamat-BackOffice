const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');

const Rankings = module.exports


Rankings.calculaRankingTurma = async function(jogo, jogoTipo, turma, escola, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    jogoTipo, escola, turma, dataInicio, dataFim, 
                    jogoTipo, escola, dataInicio, dataFim,
                    jogoTipo, dataInicio, dataFim]
        sql.query(`select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
		posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, posicaoturma.total
		from ((SELECT a.*
                    FROM ${bdAplicacoes}.alunos a
                    Where escola=? and turma=?)
                UNION
                (SELECT a.*
                    FROM (select * from ${bdAplicacoes}.alunos where escola=?) a
                    RIGHT JOIN (select * from ${bdAplicacoes}.turmasold where codProfessor=? and turma=?) aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select idaluno, sum(pontuacao) as total 
						from ${bdSAMD}.${jogo}
						where tipo = ? and idescola=? and turma=? and data between ? and ? 
						group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from ${bdSAMD}.${jogo}
							where tipo = ? and idescola=? and data between ? and ?
							group by idaluno order by total desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from ${bdSAMD}.${jogo}
							where tipo = ? and data between ? and ?
							group by idaluno order by total desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.idaluno = a.user and posicaoturma.idaluno = a.user and posicaoHypatia.idaluno = a.user
                    Order by a.numero;`, args, function (err, res) {            
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })  
}

Rankings.calculaRankingTurmaCalcRapid = async function(turma, escola, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    jogoTipo, escola, turma, dataInicio, dataFim, 
                    jogoTipo, escola, dataInicio, dataFim,
                    jogoTipo, dataInicio, dataFim]
        sql.query(`select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
		posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, posicaoturma.total
		from ((SELECT a.*
                    FROM ${bdAplicacoes}.alunos a
                    Where escola=? and turma=?)
                UNION
                (SELECT a.*
                    FROM (select * from ${bdAplicacoes}.alunos where escola=?) a
                    RIGHT JOIN (select * from ${bdAplicacoes}.turmasold where codProfessor=? and turma=?) aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select idaluno, sum(pontuacao) as total 
						from ${bdSAMD}.${jogo}
						where tipo = ? and idescola=? and turma=? and data between ? and ? 
						group by idaluno order by total desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from ${bdSAMD}.${jogo}
							where tipo = ? and idescola=? and data between ? and ?
							group by idaluno order by total desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select idaluno, sum(pontuacao) as total
							from ${bdSAMD}.${jogo}
							where tipo = ? and data between ? and ?
							group by idaluno order by total desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.idaluno = a.user and posicaoturma.idaluno = a.user and posicaoHypatia.idaluno = a.user
                    Order by a.numero;`, args, function (err, res) {            
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })  
}
