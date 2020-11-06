var sql = require('../../models/db_aplicacoes');
var md5 = require('md5')

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
    this.codprofessor = aluno.codprofessor
    this.pais = aluno.pais
    this.confirmacao = aluno.confirmacao 

};

Aluno.insertAluno = function (aluno) {    
    return new Promise(function(resolve, reject) {
    var args = [aluno.user, aluno.numero, aluno.nome, aluno.datanascimento, 
                aluno.escola, aluno.turma, aluno.email, md5(aluno.password), 
                aluno.codprofessor, aluno.pais, aluno.confirmacao]
    sql.query("INSERT INTO alunos (`user`, `numero`, `nome`, `datanascimento`, `escola`, `turma`, `email`, `password`," 
                + " `codprofessor`, `pais`, `confirmacao`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
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


Aluno.getPassword = function (user){
    return new Promise(function(resolve, reject) {
        var args = []
        sql.query("Select password from alunos where user=?", user, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length != 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Aluno.getAlunos = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos", function(err, res){
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
        sql.query("Select user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where user=?", user, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length != 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}

Aluno.getAlunosFromTurma = function(turma){
    return new Promise(function(resolve, reject) {
        sql.query("Select user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where turma=?", turma, function(err, res){
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
        sql.query("Select user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where escola=?", escola, function(err, res){
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

Aluno.updateAluno = function(id, aluno){
    return new Promise(function(resolve, reject) {
        var args = [aluno.numero, aluno.nome, aluno.datanascimento, 
            aluno.escola, aluno.turma, aluno.email, aluno.confirmacao, id]
        sql.query("UPDATE alunos SET numero = ?, nome = ?, datanascimento = ?, escola = ?, turma = ?, email = ?, confirmacao = ? Where user = ?", args, function (err, res) {
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

Aluno.updatePassword = function(user, password){
    return new Promise(function(resolve, reject) {
        var args = [md5(password), user]
        sql.query("UPDATE alunos SET password = ? Where user = ?", args, function (err, res) {
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

// ??
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