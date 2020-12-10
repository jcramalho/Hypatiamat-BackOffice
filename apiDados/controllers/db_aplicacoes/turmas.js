var sql = require('../../models/db_aplicacoes');
var sqlSAMD = require('../../models/db_samd')
var Alunos = require('./alunos')
var Jogos = require('../db_samd/jogos')

var Turma = function(turma){
    this.id = turma.id;
    this.idprofessor = turma.idprofessor;
    this.turma = turma.turma
};

Turma.insertTurma = function (turma) {    
    return new Promise(function(resolve, reject) {
    var args = [turma.idprofessor, turma.turma]
    sql.query("INSERT INTO turmas (`idprofessor`, `turma`) VALUES (?, ?)", 
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
        sql.query("Select * from turmas where idprofessor=?", idprofessor, function(err, res){
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

Turma.getTurmasByEscola = function (escola){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT t.* FROM hypat_aplicacoes.turmas t, hypat_aplicacoes.professores p where p.codigo=t.idprofessor and p.escola = ? ;", escola, function(err, res){
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

Turma.getJogosFromTurma  = function (dataInicio, dataFim, jogoTipo, tableJogo, turma, escola){
        return new Promise(function(resolve, reject) {
            sql.query("Select al.numero, jogo.idaluno, al.nome, AVG(jogo.pontuacao) as media, MAX(jogo.pontuacao) as maximo, MIN(jogo.pontuacao) as minimo, count(jogo.pontuacao) as count " +
            "from hypat_samd." + tableJogo + " jogo, hypat_aplicacoes.alunos al " +  
            "where jogo.tipo = ? and jogo.turma = ? and jogo.idescola = ? and al.user = jogo.idaluno and (jogo.data between ? and ?) "+ 
            "Group by idaluno Order by al.numero", [jogoTipo, turma, escola, dataInicio, dataFim], function(err, res){
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

Turma.jogou = async function(jogoTable, jogoTipo, turma, escola){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query("Select idaluno from hypat_samd." + jogoTable + " where tipo = ? and turma = ? and idescola = ?", [jogoTipo, turma, escola], function(err, res){
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

Turma.getJogos = async function(turma, escola){
    var jogos = await Jogos.getJogos()
    var result = []
    for(var i = 0; i < jogos.length; i++){
        var turmaJogou = await Turma.jogou(jogos[i].jogotable, jogos[i].tipo, turma, escola)
        if(turmaJogou.length > 0) result.push(jogos[i])
    }
    return result
}

Turma.getEstatisticasFromTurma = async function(dataInicio, dataFim, jogoTipo, tableJogo, turma, escola){
    return new Promise(function(resolve, reject) {
        sqlSAMD.query("SELECT min(pontuacao) as min, max(pontuacao) as max, avg(pontuacao) as media, count(pontuacao) as number " +
		"FROM hypat_samd." + tableJogo + 
        " WHERE turma!='99' AND turma = ? AND tipo=? AND idescola=? and (data BETWEEN ? and ?);", [turma, jogoTipo, escola, dataInicio, dataFim], function(err, res){
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
        sqlSAMD.query("SELECT min(pontuacao) as min, max(pontuacao) as max, avg(pontuacao) as media, count(pontuacao) as number " +
		"FROM hypat_samd." + tableJogo + 
        " WHERE turma!='99' AND tipo=? AND idescola=? and (data BETWEEN ? and ?);", [jogoTipo, escola, dataInicio, dataFim], function(err, res){
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
        sqlSAMD.query("SELECT min(pontuacao) as min, max(pontuacao) as max, avg(pontuacao) as media, count(pontuacao) as number " +
		"FROM hypat_samd." + tableJogo + 
        " WHERE turma!='99' AND tipo=? and (data BETWEEN ? and ?);", [jogoTipo, dataInicio, dataFim], function(err, res){
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