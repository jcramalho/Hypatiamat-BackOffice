const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');
var dataInicioAno = require('../../config/confs').dataInicio1
var dataFimAno = require('../../config/confs').dataFim1
const Comunidades = require('../db_aplicacoes/comunidades')

const JogosGerais = module.exports


JogosGerais.getJogoMunicipios = async function(jogoTable, jogoTipo, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim]
        sql.query(`SELECT esc.localidade, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		    FROM (select idescola, pontuacao from ${bdSAMD}.${jogoTable} where turma!='99' and tipo=? and (data BETWEEN ? and ?)) jogo, 
            ${bdAplicacoes}.Escolas esc 
            WHERE jogo.idescola=esc.cod  
            Group by esc.localidade Order by number;`, args, function (err, res) {
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

JogosGerais.getJogoMunicipiosFreq = async function(jogoTable, jogoTipo, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim]
        sql.query(`SELECT esc.localidade, count(jogo.pontuacao) as number 
		FROM (select idescola, pontuacao from ${bdSAMD}.${jogoTable} where turma!='99' and tipo=? and (data BETWEEN ? and ?)) jogo, 
        ${bdAplicacoes}.Escolas esc 
        WHERE jogo.idescola=esc.cod Group by esc.localidade Order by esc.localidade;`, args, function (err, res) {
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

JogosGerais.getJogoComunidade = async function(comunidade, jogoTable, tipo, dataInicio, dataFim){
    var resultado = []
    var aux = await JogosGerais.getJogoMunicipios(jogoTable, tipo, dataInicio, dataFim)
    var municipios = await Comunidades.getMunicipiosFromComunidade(comunidade)

    for(var i = 0; i < aux.length; i++){
        var localidade = aux[i].localidade
        if(municipios.find(e => e.municipio == localidade)) resultado.push(aux[i])
    }

    await resultado.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return resultado;
}

JogosGerais.getJogoEscolas = async function(jogoTable, jogoTipo, dataInicio, dataFim, municipio){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim, municipio]
        sql.query(`SELECT esc.cod, esc.nome, ROUND(min(jogo.pontuacao),0) as min, Round(max(jogo.pontuacao), 0) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		FROM (select idescola, pontuacao from ${bdSAMD}.${jogoTable} where tipo=? and (data BETWEEN ? and ?)) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade=?) esc 
        WHERE jogo.idescola=esc.cod Group by jogo.idescola Order by number DESC;`, args, function (err, res) {
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

JogosGerais.getJogoEscolasFreq = async function(jogoTable, jogoTipo, dataInicio, dataFim, municipio){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim, municipio]
        sql.query(`SELECT esc.cod, esc.nome, count(jogo.pontuacao) as number 
		FROM (select idescola, pontuacao from ${bdSAMD}.${jogoTable} where tipo=? and (data BETWEEN ? and ?)) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade=?) esc 
        WHERE jogo.idescola=esc.cod Group by jogo.idescola Order by number DESC;`, args, function (err, res) {
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

JogosGerais.getJogoProfessores = async function(jogoTable, jogoTipo, dataInicio, dataFim, escola){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, escola, dataInicio, dataFim]
        sql.query(`SELECT al.codprofessor, (select nome from ${bdAplicacoes}.professores where codigo = al.codprofessor) as nome, min(jogo.pontuacao) as min, 
                    max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
                    FROM (select idaluno, pontuacao from ${bdSAMD}.${jogoTable} where tipo=? and idescola = ? and (data BETWEEN ? and ?)) jogo, 
                    ${bdAplicacoes}.alunos al 
                    WHERE al.user = jogo.idaluno 
                    Group by al.codprofessor Order by number;`, args, function (err, res) {
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

JogosGerais.getJogoProfessoresFreq = async function(jogoTable, jogoTipo, dataInicio, dataFim, escola){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, escola, dataInicio, dataFim]
        sql.query(`SELECT al.codprofessor, (select nome from ${bdAplicacoes}.professores where codigo = al.codprofessor) as nome, count(jogo.pontuacao) as number 
		FROM (select idaluno, pontuacao from ${bdSAMD}.${jogoTable} where tipo=? and idescola = ? and (data BETWEEN ? and ?)) jogo, 
        ${bdAplicacoes}.alunos al 
        WHERE al.user = jogo.idaluno  
        Group by al.codprofessor;`, args, function (err, res) {
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

JogosGerais.getJogoFromTurma  = function (dataInicio, dataFim, jogoTipo, tableJogo, turma, escola, horaInicio, horaFim){
    var args = [jogoTipo, turma, escola, dataInicio, dataFim, horaInicio, horaFim]
    return new Promise(function(resolve, reject) {
        sql.query(`Select al.numero, jogo.idaluno, al.nome, Round(AVG(jogo.pontuacao), 0) as media, 
                MAX(jogo.pontuacao) as maximo, MIN(jogo.pontuacao) as minimo, count(jogo.pontuacao) as count 
        from (select idaluno, pontuacao from ${bdSAMD}.${tableJogo} 
                    where tipo = ? and turma = ? and idescola = ? and (data between ? and ?) and (horario between ? and ?) ) jogo, 
            ${bdAplicacoes}.alunos al  
        where al.user = jogo.idaluno
        Group by idaluno Order by al.numero`, args, function(err, res){
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

JogosGerais.getJogoFromTurmaFreq = function (dataInicio, dataFim, jogoTipo, tableJogo, turma, escola, horaInicio, horaFim){
    var args = [jogoTipo, turma, escola, dataInicio, dataFim, horaInicio, horaFim]
    return new Promise(function(resolve, reject) {
        sql.query(`Select al.numero, jogo.idaluno, al.nome, count(jogo.pontuacao) as count 
        from (select idaluno, pontuacao from ${bdSAMD}.${tableJogo} where 
                tipo = ? and turma = ? and idescola = ? and (data between ? and ?) and (horario between ? and ?) ) jogo, 
        ${bdAplicacoes}.alunos al  
        where al.user = jogo.idaluno 
        Group by idaluno Order by al.numero`, args, function(err, res){
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

JogosGerais.getJogoPorDia = function (user, tableJogo, jogoTipo){
    return new Promise(function(resolve, reject) {
        sql.query(`Select jogo.data, Round(AVG(jogo.pontuacao),0) as media, MAX(jogo.pontuacao) as maximo, 
        MIN(jogo.pontuacao) as minimo, count(jogo.pontuacao) as count 
        from ${bdSAMD}.${tableJogo} jogo 
        where jogo.idaluno = ? and jogo.tipo = ?
        Group by jogo.data
        Order by jogo.data desc`, [user, jogoTipo], function(err, res){
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

JogosGerais.getFrequenciaAlunoPorDia = function (user, tableJogo, jogoTipo){
    var args = [user, jogoTipo, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`Select jogo.data, count(jogo.pontuacao) as frequencia 
        from ${bdSAMD}.${tableJogo} jogo 
        where jogo.idaluno = ? and jogo.tipo = ? and (jogo.data between ? and ?)
        Group by jogo.data
        Order by jogo.data asc`, args, function(err, res){
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

JogosGerais.getAlunoLast = function(tableJogo, tipo, user){
    return new Promise(function(resolve, reject) {
        sql.query(`select min(pontuacao) as min, max(pontuacao) as max, Round(avg(pontuacao), 0) as media, 
		count(pontuacao) as frequencia, max(concat(data, ' ', horario)) as lastdate
		from ${bdSAMD}.${tableJogo} where tipo=? and idaluno=? and (data between ? and ?);`, [tipo, user, dataInicioAno, dataFimAno], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length == 0) resolve(undefined)
                else resolve(res[0])
            }
        })
    })
}

JogosGerais.alunoJogou = function(user, dataInicio, dataFim, tableJogo, tipo){
    var args = [user, tipo, dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`Select id from ${bdSAMD}.${tableJogo} where idaluno = ? and tipo=? and (data between ? and ?);`, args, function(err, res){
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

JogosGerais.getAlunoFrequencia = function(user, tableJogo, tipo){
    var args = [user, tipo, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`Select count(pontuacao) as frequencia from ${bdSAMD}.${tableJogo} where idaluno = ? and tipo=? and (data between ? and ?);`, args, function(err, res){
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