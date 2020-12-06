var sql = require('../../models/db_aplicacoes');
var sqlSAMD = require('../../models/db_samd')

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

Turma.deleteTurma = function (id){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From turmas where turma = ?", id, function (err, res) {
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

module.exports = Turma