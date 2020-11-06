var sql = require('../../models/db_aplicacoes');

var Turma = function(turma){
    this.id = turma.id;
    this.idprofessor = turma.idprofessor;
    this.turma = turma.turma
};

Turma.insertTurma = function (turma) {    
    return new Promise(function(resolve, reject) {
    var args = [turma.id, turma.idprofessor, turma.turma]
    sql.query("INSERT INTO turmas (`id`, `idprofessor`, `turma`) VALUES (?, ?, ?)", 
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
        sql.query("Select * from turmas where turma=?", id, function(err, res){
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
                resolve(res)
            }
        })
    })
}

Turma.updateTurma = function(turma){

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