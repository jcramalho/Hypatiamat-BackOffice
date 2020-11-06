var sql = require('../../models/db_aplicacoes');

var Exame = function(exame){
    this.id = exame.id;
    this.user = exame.user
    this.examenumber = exame.examenumber;
    this.nota = exame.nota;
    this.data = exame.data
    this.turma = exame.turma
    this.codProfessor = exame.codProfessor
};

Exame.insertExame = function (exame) {    
    return new Promise(function(resolve, reject) {
    var args = [exame.id, exame.user, exame.examenumber, exame.nota, exame.data, exame.turma, exame.codProfessor]
    sql.query("INSERT INTO exames (`id`, `user`, `examenumber`, `nota`, `data`, `turma`, `codProfessor`)"+ 
                " VALUES (?, ?, ?, ?, ?, ?, ?)", 
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

Exame.getExames = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from exames", function(err, res){
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


Exame.getExame = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from exames where id=?", id, function(err, res){
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

Exame.getExamesFromTurma = function (turma) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from exames where turma=?", turma, function(err, res){
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

Exame.getExamesFromUser = function (user) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from exames where user=?", user, function(err, res){
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

Exame.getExamesFromExameNumber = function(examenumber){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from exames where examenumber=?", examenumber, function(err, res){
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


Exame.deleteExame = function (id){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From exames where id = ?", id, function (err, res) {
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

module.exports = Exame