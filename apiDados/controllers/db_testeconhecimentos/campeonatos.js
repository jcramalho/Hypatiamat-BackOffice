const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');
const anoletivoAtual = require('../../config/confs').anoletivo
const jogosCampeonatosDescricao = require('../../config/confs').jogosCampeonatosDescricao

module.exports.getCampeonatos= function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM campeonatosID order by di desc;`, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatosFromComunidade = function(comunidade){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM campeonatosID where comunidade=? order by di;`, [comunidade], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatosComMunicipio= function(municipio){
    return new Promise(function(resolve, reject) {
        sql.query(`select * from ${bdTesteConhecimentos}.campeonatosID where municipio is null or municipio=? order by di;`, [municipio], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatosAlunoParticipou= function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM campeonatosID where cod in (select campeonatoID from campeonatos where user=?) order by di desc;`, user,
         function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatosAlunoParticipouAnoLetivo= function(user){
    var args = [user, anoletivoAtual]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM campeonatosID where cod in (select campeonatoID from campeonatos where user=?) and anoletivo=? order by di desc;`, args,
         function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoMunicipios = function(campeonato){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    ${bdAplicacoes}.Escolas esc where camp.user = al.user and al.escola = esc.cod
                    group by esc.localidade, camp.jogo
                    Order by esc.localidade, camp.jogo;`, [campeonato], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoMunicipiosTotais = function(campeonato){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    ${bdAplicacoes}.Escolas esc where camp.user = al.user and al.escola = esc.cod
                    group by esc.localidade
                    Order by esc.localidade;`, [campeonato], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoMunicipiosGerais = function(campeonato){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT count(distinct esc.localidade) as nmunicipios, count(distinct esc.cod) as nescolas,count(distinct al.codprofessor) as nprofessores, 
		sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
					FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    ${bdAplicacoes}.Escolas esc where camp.user = al.user and al.escola = esc.cod;`, [campeonato], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}


module.exports.getCampeonatoMunicipio = function(campeonato, municipio){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    (select * from ${bdAplicacoes}.Escolas where localidade=?) esc where camp.user = al.user and al.escola = esc.cod
                    group by camp.jogo
                    Order by camp.jogo;`, [campeonato, municipio], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoComunidade = function(campeonato, comunidade){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) esc 
                    where camp.user = al.user and al.escola = esc.cod
                    group by esc.localidade, camp.jogo
                    Order by esc.localidade, camp.jogo;`, [campeonato, comunidade], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}
module.exports.getCampeonatoComunidadeTotais = function(campeonato, comunidade){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) esc 
                    where camp.user = al.user and al.escola = esc.cod
                    group by esc.localidade
                    Order by esc.localidade;`, [campeonato, comunidade], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoMunicipioGerais = function(campeonato, municipio){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT count(distinct esc.cod) as nescolas,count(distinct al.codprofessor) as nprofessores, sum(camp.njogos) as njogos, 
		count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
					FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
						(select * from ${bdAplicacoes}.Escolas where localidade=?) esc where camp.user = al.user and al.escola = esc.cod;`, 
        [campeonato, municipio], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

module.exports.getCampeonatoComunidadeGerais = async function(campeonato, comunidade){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT count(distinct esc.localidade) as nmunicipios, count(distinct esc.cod) as nescolas,count(distinct al.codprofessor) as nprofessores, 
        sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
					FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
						(select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) esc 
                        where camp.user = al.user and al.escola = esc.cod;`, 
        [campeonato, comunidade], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

module.exports.getCampeonatoMunicipioAgrupamentos = function(campeonato, municipio){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.cod, esc.nome, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    (select * from ${bdAplicacoes}.Escolas where localidade=?) esc where camp.user = al.user and al.escola = esc.cod
                    group by esc.cod, camp.jogo
                    Order by esc.cod, camp.jogo;`, [campeonato, municipio], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoAgrupamento = function(campeonato, escola){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.cod, esc.nome, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, (select * from ${bdAplicacoes}.alunos where escola=?) al,
                    (select * from ${bdAplicacoes}.Escolas where cod=?) esc where camp.user = al.user and al.escola = esc.cod
                    group by camp.jogo
                    Order by camp.jogo;`, [campeonato, escola, escola], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}


module.exports.getCampeonatoAgrupamentoProfessores = function(campeonato, escola){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT camp.codprofessor, (select nome from ${bdAplicacoes}.professores where codigo=camp.codprofessor) as nome , camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, 
                    (select user from ${bdAplicacoes}.alunos where escola=?) al
                    where camp.user = al.user
					group by camp.codprofessor, camp.jogo
                    Order by camp.codprofessor, camp.jogo;`, [campeonato, escola], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoTurma = function(campeonato, escola, turma, codprofessor, jogo){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    campeonato, jogo, codprofessor, turma,
                    campeonato, jogo, escola,
                    campeonato, jogo]
        sql.query(`select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
		posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, posicaoturma.pontuacao, posicaoturma.njogos
		from ((SELECT a.*
                    FROM ${bdAplicacoes}.alunos a
                    Where escola=? and turma=?)
                UNION
                (SELECT a.*
                    FROM (select * from ${bdAplicacoes}.alunos where escola=?) a
                    RIGHT JOIN (select * from ${bdAplicacoes}.turmasold where codProfessor=? and turma=?) aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select user, pontuacao, njogos
						from ${bdTesteConhecimentos}.campeonatos, (SELECT @rownum := 0) AS r
						where campeonatoID=? and jogo=? and codprofessor=? and turma=?
                        order by pontuacao desc, njogos desc) ranking) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select camp.user, camp.pontuacao, camp.njogos
							from (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID = ? and jogo=?) camp, 
                            (select * from ${bdAplicacoes}.professores where escola=?) profs, (SELECT @rownumesc := 0) AS r
							where profs.codigo = camp.codprofessor
							order by pontuacao desc, njogos desc) ranking) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select user, pontuacao, njogos
							from ${bdTesteConhecimentos}.campeonatos, (SELECT @rownumhypatia := 0) AS r
							where campeonatoID = ? and jogo=?
							order by pontuacao desc, njogos desc) ranking) posicaoHypatia
					where posicaoescola.user = a.user and posicaoturma.user = a.user and posicaoHypatia.user = a.user
                    order by a.numero;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoInfoAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT distinct campeonatoID, jogo, (select descricaoBackOffice from campeonatosID where cod=campeonatoID) as descricaoBackOffice, turma, codprofessor
             FROM campeonatos where user=? Order by campeonatoID desc;`, user, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getCampeonatoInfoTurma = function(turma, codprofessor){
    var args = [turma, codprofessor]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT distinct campeonatoID, jogo, (select descricaoBackOffice from campeonatosID where cod=campeonatoID) as descricaoBackOffice, turma, codprofessor
             FROM campeonatos where turma=? and codprofessor=? Order by campeonatoID desc;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res)
            }
        })
    })
}

module.exports.getJogosFromCampeonato = function(campeonato){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT distinct jogo FROM campeonatos where campeonatoID=? Order by jogo asc;`, campeonato, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                var resultado = []
                for(var i = 0; i < res.length; i++)
                    resultado.push(jogosCampeonatosDescricao.find(e => e.jogo == res[i].jogo))
                resolve(resultado)
            }
        })
    })
}


module.exports.getDesempenhoAlunoCampeonato = function(campeonato, jogo, escola, codprofessor, turma, user){
    return new Promise(function(resolve, reject) {
        var args = [escola, turma, escola, codprofessor, turma,
                    campeonato, jogo, codprofessor, turma,
                    campeonato, jogo, escola,
                    campeonato, jogo]
        sql.query(`select a.numero, a.user, a.nome, posicaoturma.posicao as posTurma, 	
		posicaoescola.posicao as posEscola, posicaoHypatia.posicao as posHypatia, posicaoturma.pontuacao, posicaoturma.njogos
		from ((SELECT a.*
                    FROM ${bdAplicacoes}.alunos a
                    Where escola=? and turma=?)
                UNION
                (SELECT a.*
                    FROM (select * from ${bdAplicacoes}.alunos where escola=?) a
                    RIGHT JOIN (select * from ${bdAplicacoes}.turmasold where codProfessor=? and turma=?) aold ON a.user = aold.codAluno)) a,
			 (select ranking.*, @rownum := @rownum + 1 AS posicao 
				from (select user, pontuacao, njogos
						from ${bdTesteConhecimentos}.campeonatos, (SELECT @rownum := 0) AS r
						where campeonatoID=? and jogo=? and codprofessor=? and turma=?
                        order by pontuacao desc, njogos desc) ranking) posicaoturma,
				(select @rownumesc := @rownumesc + 1 AS posicao, ranking.*  
					from (select camp.user, camp.pontuacao, camp.njogos
							from (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID = ? and jogo=?) camp, 
                            (select * from ${bdAplicacoes}.professores where escola=?) profs, (SELECT @rownumesc := 0) AS r
							where profs.codigo = camp.codprofessor
							order by pontuacao desc, njogos desc) ranking) posicaoescola,
				(select @rownumhypatia := @rownumhypatia + 1 AS posicao, ranking.*  
					from (select user, pontuacao, njogos
							from ${bdTesteConhecimentos}.campeonatos, (SELECT @rownumhypatia := 0) AS r
							where campeonatoID = ? and jogo=?
							order by pontuacao desc, njogos desc) ranking) posicaoHypatia
					where posicaoescola.user = a.user and posicaoturma.user = a.user and posicaoHypatia.user = a.user
                    order by a.numero;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                var result = res.find(e => e.user == user)
                if(result) resolve(result)
                else resolve(undefined)
            }
        })
    })
}