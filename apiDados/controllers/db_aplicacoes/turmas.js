var sql = require('../../models/db_aplicacoes');
var sqlSAMD = require('../../models/db_samd')
var Alunos = require('./alunos')
var Jogos = require('../db_samd/jogos');
const { bdSAMD, bdAplicacoes } = require('../../models/conf');
const { minutenewDef, calcrapidDef } = require('../../config/configsJogos');

var Turma = function(turma){
    this.id = turma.id;
    this.idprofessor = turma.idprofessor;
    this.turma = turma.turma
};

Turma.insertTurma = function (turma) {    
    return new Promise(function(resolve, reject) {
    var args = [turma.idprofessor, turma.turma, turma.anoletivo]
    sql.query("INSERT INTO turmas (`idprofessor`, `turma`, `anoletivo`) VALUES (?, ?, ?)", 
                args, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                reject(err);
            }
            else{
                console.log(res.insertId);
                resolve(res);
            }
        });   
    })       
};

Turma.getTurmas = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas", function(err, res){
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

Turma.getCodigosTurmas = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select turma from turmas", function(err, res){
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

Turma.getTurmas = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select distinct turma from turmas", function(err, res){
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

Turma.getTurmasFromAnoLetivo = function(anoletivo){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where anoletivo=?", anoletivo, function(err, res){
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

Turma.getTurmasSemAlunos = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`Select t.*, profs.nome, escola.nome as agrupamento from (
            Select t.* from	(SELECT t.*
                    FROM turmas t
                    LEFT JOIN alunos a ON a.turma = t.turma and a.codprofessor = t.idprofessor
                    WHERE a.turma IS NULL) t
                LEFT JOIN turmasold told ON told.turma = t.turma and t.idprofessor = told.codprofessor
                    where told.turma IS NULL) t, professores profs, Escolas escola
            where t.idprofessor = profs.codigo and profs.escola = escola.cod;`, function(err, res){
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

Turma.getTurmasSemAlunosFromAnoletivo = function(anoletivo){
    return new Promise(function(resolve, reject) {
        sql.query(`Select t.*, profs.nome, escola.nome as agrupamento from (
            Select t.* from	(SELECT t.*
                    FROM turmas t
                    LEFT JOIN alunos a ON a.turma = t.turma and a.codprofessor = t.idprofessor
                    WHERE a.turma IS NULL) t
                LEFT JOIN turmasold told ON told.turma = t.turma and t.idprofessor = told.codprofessor
                    where told.turma IS NULL) t, professores profs, Escolas escola
            where t.idprofessor = profs.codigo and profs.escola = escola.cod and t.anoletivo = ?;`, anoletivo, function(err, res){
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

Turma.getTurmaById = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where id=?", id, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length!=0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getTurmasByProfessor = function (idprofessor) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where idprofessor=? Order by anoletivo DESC", idprofessor, function(err, res){
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

Turma.getTurmasByProfessorAno = function (idprofessor, anoletivo) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where idprofessor=? and anoletivo=?", [idprofessor, anoletivo], function(err, res){
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

Turma.getTurmaByNome = function (turma) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where turma=?", turma, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length!=0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getTurmaByNomeProfessor = function (turma, codprofessor) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmas where turma=? and idprofessor=?", [turma, codprofessor], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length!=0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getTurmaByNomeEscola = function (turma, escola) {
    return new Promise(function(resolve, reject) {
        sql.query("Select t.* from (select * from turmas where turma=?) t, (select * from professores where escola=?) p where p.codigo = t.idprofessor", [turma, escola], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length!=0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getTurmasByEscola = function (escola){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT t.* FROM ${bdAplicacoes}.turmas t, ${bdAplicacoes}.professores p where p.codigo=t.idprofessor and p.escola = ? ;`, escola, function(err, res){
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

Turma.updateTurma = function(id, turma){
    return new Promise(function(resolve, reject) {
        var args = [turma.turma, id]
        sql.query("UPDATE turmas SET turma = ? Where id = ?", args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    console.log(res.insertId);
                    resolve(res);
                }
            });   
    })
}

Turma.jogou = async function(jogoTable, jogoTipo, turma, escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`Select idaluno from ${bdSAMD}.${jogoTable} where tipo = ? and turma = ? and idescola = ? and (data between ? and ?)`, [jogoTipo, turma, escola, dataInicio, dataFim], function(err, res){
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

Turma.jogouCalcRapid = async function(turma, escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`Select idaluno from ${bdSAMD}.calcRapidHypatia where turma = ? and idescola = ? and (data between ? and ?)`, [turma, escola, dataInicio, dataFim], function(err, res){
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

Turma.jogouCalculus = async function(turma, escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`Select user from ${bdSAMD}.minutenew where turma = ? and escola = ? and (data between ? and ?)`, [turma, escola, dataInicio, dataFim], function(err, res){
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

Turma.getJogos = async function(turma, escola, dataInicio, dataFim){
    var jogos = await Jogos.getJogosDB()
    var result = []
    
    //calcrapid
    var turmaCalcRapid = await Turma.jogouCalcRapid(turma, escola, dataInicio, dataFim)
    if(turmaCalcRapid.length > 0) result.push(calcrapidDef)
    
    //calculus
    var turmaCalculus = await Turma.jogouCalculus(turma, escola, dataInicio, dataFim)
    if(turmaCalculus.length > 0) result.push(minutenewDef)

    for(var i = 0; i < jogos.length; i++){
        var turmaJogou = await Turma.jogou(jogos[i].jogotable, jogos[i].tipo, turma, escola, dataInicio, dataFim)
        if(turmaJogou.length > 0) result.push(jogos[i])
    }
    return result
}

Turma.getEstatisticasFromTurma = async function(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`SELECT min(pontuacao) as min, max(pontuacao) as max, Round(avg(pontuacao), 0) as media, count(pontuacao) as number 
		FROM ${bdSAMD}.${tableJogo} 
         WHERE turma!='99' AND turma = ? AND tipo=? AND idescola=? and (data BETWEEN ? and ?);`, [turma, jogoTipo, escola, dataInicio, dataFim], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if (res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getEstatisticasFromEscola = async function(dataInicio, dataFim, jogoTipo, tableJogo, escola){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`SELECT min(pontuacao) as min, max(pontuacao) as max, Round(avg(pontuacao), 0) as media, count(pontuacao) as number 
		FROM ${bdSAMD}.${tableJogo} 
         WHERE turma!='99' AND tipo=? AND idescola=? and (data BETWEEN ? and ?);`, [jogoTipo, escola, dataInicio, dataFim], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if (res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getEstatisticasFromHypatia = async function(dataInicio, dataFim, jogoTipo, tableJogo){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query(`SELECT min(pontuacao) as min, max(pontuacao) as max, Round(avg(pontuacao), 0) as media, count(pontuacao) as number 
		FROM ${bdSAMD}.${tableJogo} 
         WHERE turma!='99' AND tipo=? and (data BETWEEN ? and ?);`, [jogoTipo, dataInicio, dataFim], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if (res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Turma.getEstatisticasGlobais = async function (dataInicio, dataFim, jogoTipo, tableJogo, turma, escola){
    var turmaEst = await Turma.getEstatisticasFromTurma(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola)
    var escolaEst = await Turma.getEstatisticasFromEscola(dataInicio, dataFim, jogoTipo, tableJogo, escola)
    var hypatiaEst = await Turma.getEstatisticasFromHypatia(dataInicio, dataFim, jogoTipo, tableJogo)
    return {turma: turmaEst, escola: escolaEst, hypatia: hypatiaEst}
}

Turma.apagar = async function(turma, codprofessor){
    var alunos = await Alunos.getAlunosFromTurma(turma, codprofessor)
    if(alunos.length == 0){
        return await Turma.deleteTurma(turma, codprofessor)
    }
    else{
        return {removed: false, message:"A turma não pode ser eliminada, dado que existem alunos que fazem parte da turma."}
    }
}

Turma.deleteTurma = function (turma, codprofessor){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From turmas where turma = ? and idprofessor = ?", [turma, codprofessor], function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.affectedRows == 0){ resolve({removed: false, message:"A turma não pode ser eliminada, dado que existem alunos que fazem parte da turma ou jogos que foram realizados pela turma."})}
                    else {resolve({message: "A turma foi removida com sucesso.", removed: true})}
                }
            });   
    })    
}

module.exports = Turma