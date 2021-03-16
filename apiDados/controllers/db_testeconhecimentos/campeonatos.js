const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');

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

module.exports.getCampeonatoMunicipios = function(campeonato){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, camp.jogo, max(camp.pontuacao) as max, min(camp.pontuacao) as min, 
        Round(avg(camp.pontuacao), 0) as media, sum(camp.njogos) as njogos, count(distinct camp.user) as nusers, Round(sum(camp.njogos)/count(distinct camp.user), 0) as jogosAluno
                FROM (select * from ${bdTesteConhecimentos}.campeonatos where campeonatoID=?) camp, ${bdAplicacoes}.alunos al,
                    ${bdAplicacoes}.Escolas esc where camp.user = al.user and al.escola = esc.cod
                    group by esc.localidade, camp.jogo
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
                    group by camp.jogo;`, [campeonato, municipio], function(err, res){
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
                    group by esc.localidade, camp.jogo;`, [campeonato, comunidade], function(err, res){
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
                    group by esc.cod, camp.jogo;`, [campeonato, municipio], function(err, res){
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
                    group by camp.jogo;`, [campeonato, escola, escola], function(err, res){
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
					group by camp.codprofessor, camp.jogo;`, [campeonato, escola], function(err, res){
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

module.exports.getCampeonatoTurma = function(campeonato, escola, turma, professor){
    return new Promise(function(resolve, reject) {
        var args = [campeonato, turma, professor]
        sql.query(`SELECT al.user, al.numero, al.nome, camp.pontuacao, sum(camp.njogos) as njogos
        FROM (select user, pontuacao, njogos from ${bdTesteConhecimentos}.campeonatos where campeonatoID=? and turma=? and codprofessor=?) camp,
                ${bdAplicacoes}.alunos al
            where camp.user = al.user
                group by al.user;`, args, function(err, res){
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

