const { bdAplicacoes, bdTesteConhecimentos } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');

const Rankings = module.exports

// ------------------------------------------------------- NTRC ---------------------------------------------------------------------

Rankings.calculaRankingTurmaNTRC = async function(turma, escola, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, 
                    dataInicio, dataFim, escola,
                    dataInicio, dataFim]
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
				from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and lastdate between ? and ?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as total, (sum(apps.ncertas)/sum(apps.ntotal)) as params
							from (select * from ${bdTesteConhecimentos}.appsinfoall where lastdate between ? and ?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params 
							from ${bdTesteConhecimentos}.appsinfoall
							where lastdate between ? and ?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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

Rankings.calculaRankingTurmaNTRCTema = async function(turma, escola, codprofessor, dataInicio, dataFim, codtema){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, codtema,
                    dataInicio, dataFim, codtema, escola,
                    dataInicio, dataFim, codtema]
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
				from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and (lastdate between ? and ?) and grupo=?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as total, (sum(apps.ncertas)/sum(apps.ntotal)) as params
							from (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params 
							from ${bdTesteConhecimentos}.appsinfoall
							where (lastdate between ? and ?) and grupo=?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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

Rankings.calculaRankingTurmaNTRCSubTema = async function(turma, escola, codprofessor, dataInicio, dataFim, codtema, codsubtema){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, codtema, codsubtema,
                    dataInicio, dataFim, codtema, codsubtema, escola,
                    dataInicio, dataFim, codtema, codsubtema]
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
				from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and (lastdate between ? and ?) and grupo=? and appid=?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as total, (sum(apps.ncertas)/sum(apps.ntotal)) as params
							from (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=? and appid=?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as total, (sum(ncertas)/sum(ntotal)) as params 
							from ${bdTesteConhecimentos}.appsinfoall
							where (lastdate between ? and ?) and grupo=? and appid=?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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

// ------------------------------------------------------- ACERTO ------------------------------------------------------------------

Rankings.calculaRankingTurmaAcerto = async function(turma, escola, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, 
                    dataInicio, dataFim, escola,
                    dataInicio, dataFim]
        sql.query(`select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
                posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, Round(posicaoturma.total*100, 0) as total
                from ((SELECT a.*
                    FROM ${bdAplicacoes}.alunos a
                    Where escola=? and turma=?)
                UNION
                (SELECT a.*
                    FROM (select * from ${bdAplicacoes}.alunos where escola=?) a
                    RIGHT JOIN (select * from ${bdAplicacoes}.turmasold where codProfessor=? and turma=?) aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and lastdate between ? and ?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as params, (sum(apps.ncertas)/sum(apps.ntotal)) as total
							from (select * from ${bdTesteConhecimentos}.appsinfoall where lastdate between ? and ?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total 
							from ${bdTesteConhecimentos}.appsinfoall
							where lastdate between ? and ?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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

Rankings.calculaRankingTurmaAcertoTema = async function(turma, escola, codprofessor, dataInicio, dataFim, codtema){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, codtema,
                    dataInicio, dataFim, codtema, escola,
                    dataInicio, dataFim, codtema]
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
				from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and (lastdate between ? and ?) and grupo=?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as params, (sum(apps.ncertas)/sum(apps.ntotal)) as total
							from (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total 
							from ${bdTesteConhecimentos}.appsinfoall
							where (lastdate between ? and ?) and grupo=?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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

Rankings.calculaRankingTurmaAcertoSubTema = async function(turma, escola, codprofessor, dataInicio, dataFim, codtema, codsubtema){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    codprofessor, turma, dataInicio, dataFim, codtema, codsubtema,
                    dataInicio, dataFim, codtema, codsubtema, escola,
                    dataInicio, dataFim, codtema, codsubtema]
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
				from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total  
						from ${bdTesteConhecimentos}.appsinfoall 
						where codProf=? and turma=? and (lastdate between ? and ?) and grupo=? and appid=?
						group by userid order by total desc, params desc) ranking, (SELECT @rownum := 0) AS r) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select apps.userid, sum(apps.ncertas) as params, (sum(apps.ncertas)/sum(apps.ntotal)) as total
							from (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=? and appid=?) apps,
								(select * from ${bdAplicacoes}.professores where escola = ?) profs
							where profs.codigo = apps.codProf
							group by apps.userid order by total desc, params desc) ranking, (SELECT @rownumesc := 0) AS r) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select userid, sum(ncertas) as params, (sum(ncertas)/sum(ntotal)) as total
							from ${bdTesteConhecimentos}.appsinfoall
							where (lastdate between ? and ?) and grupo=? and appid=?
							group by userid order by total desc, params desc) ranking, (SELECT @rownumhypatia := 0) AS r) posicaoHypatia
					where posicaoescola.userid = a.user and posicaoturma.userid = a.user and posicaoHypatia.userid = a.user
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