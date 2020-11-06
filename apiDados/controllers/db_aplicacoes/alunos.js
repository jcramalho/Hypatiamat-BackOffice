var sql = require('../../models/db_aplicacoes');

var Aluno = function(aluno){
    this.id = aluno.id;
    this.user = aluno.user;
    this.numero = aluno.numero
    this.nome = aluno.nome;
    this.datanascimento = aluno.datanascimento;
    this.escola = aluno.escola;
    this.turma = aluno.turma;
    this.email = aluno.email;
    this.password = aluno.password;

};

Aluno.insertAluno = function (aluno) {    
    return new Promise(function(resolve, reject) {
    var args = [aluno.id, aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, aluno.password]
    sql.query("INSERT INTO alunos (`id`, `user`, `numero`, `nome`, `datanascimento`, `escola`, `turma`, `email`, `password`)" 
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
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


Aluno.getAlunos = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from alunos", function(err, res){
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

Aluno.getAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from alunos where user=?", user, function(err, res){
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

Aluno.getAlunosFromTurma = function(turma){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from alunos where turma=?", turma, function(err, res){
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

Aluno.getAlunosFromEscola = function(escola){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from alunos where escola=?", escola, function(err, res){
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


Aluno.updateTurma = function(user, turma){
    return new Promise(function(resolve, reject) {
        var args = [turma, user]
        sql.query("UPDATE alunos SET turma = ? Where user = ?", args, function (err, res) {
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

Aluno.deleteAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From alunos where user = ?", user, function (err, res) {
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

module.exports = Aluno