var sql = require('../../models/db_aplicacoes');

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