var sql = require('../../models/db_aplicacoes');
var sqlSamd = require('../../models/db_samd')
var Jogos = require('../db_samd/jogos')
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
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos", function(err, res){
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

Aluno.getAluno = function(id){
    return new Promise(function(resolve, reject) {
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, codprofessor, pais, confirmacao from alunos where id=?", id, function(err, res){
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

Aluno.getJogosFromAluno  = function (dataInicio, dataFim, jogoTipo, tableJogo, user){
    return new Promise(function(resolve, reject) {
        sql.query("Select al.numero, jogo.idaluno, al.nome, jogo.pontuacao, jogo.data, jogo.horario " +
        "from hypat_samd." + tableJogo + " jogo, hypat_aplicacoes.alunos al " +  
        "where jogo.tipo = ? and jogo.idaluno = ? and al.user = jogo.idaluno and (jogo.data between ? and ?) Order by jogo.data DESC;"
        , [jogoTipo, user, dataInicio, dataFim], function(err, res){
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

Aluno.getJogosGlobalFromAluno  = function (dataInicio, dataFim, jogoTipo, tableJogo, user){
    return new Promise(function(resolve, reject) {
        sql.query("Select al.numero, jogo.idaluno, al.nome, AVG(jogo.pontuacao) as media, MAX(jogo.pontuacao) as maximo, MIN(jogo.pontuacao) as minimo, count(jogo.pontuacao) as count " +
        "from hypat_samd." + tableJogo + " jogo, hypat_aplicacoes.alunos al " +  
        "where jogo.tipo = ? and jogo.idaluno = ? and al.user = jogo.idaluno and (jogo.data between ? and ?) "+ 
        "Group by idaluno", [jogoTipo, user, dataInicio, dataFim], function(err, res){
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

Aluno.getAlunoByUser = function(user){
    return new Promise(function(resolve, reject) {
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where user=?", user, function(err, res){
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

Aluno.getAlunosFromTurma = function(turma, codprofessor){
    return new Promise(function(resolve, reject) {
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where turma=? and codprofessor=?", [turma, codprofessor], function(err, res){
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
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where escola=?", escola, function(err, res){
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

Aluno.getAlunosByProfessor = function(codigo){
    return new Promise(function(resolve, reject) {
        sql.query("Select id, user, numero, nome, datanascimento, escola, turma, email, confirmacao from alunos where codprofessor=?", codigo, function(err, res){
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
        var args = [aluno.numero, aluno.nome, aluno.datanascimento, aluno.email, aluno.confirmacao, id]
        sql.query("UPDATE alunos SET numero = ?, nome = ?, datanascimento = ?, email = ?, confirmacao = ? Where id = ?", args, function (err, res) {
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

Aluno.updateTurma = function(id, turma){
    return new Promise(function(resolve, reject) {
        var args = [turma, id]
        sql.query("UPDATE alunos SET turma = ? Where id = ?", args, function (err, res) {
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

Aluno.updatePassword = function(id, password){
    return new Promise(function(resolve, reject) {
        var args = [md5(password), id]
        sql.query("UPDATE alunos SET password = ? Where id = ?", args, function (err, res) {
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

Aluno.getApps = function(user){
    return new Promise(function(resolve, reject) {
        sqlSamd.query("Select * from appsinfoall where userid = ? ;", user, function(err, res){
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

Aluno.getJogosFromJogo = function(user, tableJogo, jogoTipo){
    return new Promise(function(resolve, reject) {
        sqlSamd.query("Select id from hypat_samd." + tableJogo + " where tipo = ? and idaluno = ? ;"
        , [jogoTipo, user], function(err, res){
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

Aluno.jogou = async function(typeJogos, user){
    for(var i = 0; i < typeJogos.length; i++){
        var jogo = await Aluno.getJogosFromJogo(user, typeJogos[i].jogotable, typeJogos[i].tipo)
        if(jogo.length == 0) return true
    }
    return false
}

Aluno.apagar = async function(user){
    var apps = await Aluno.getApps(user)
    if(apps.length == 0){
        var typeJogos = await Jogos.getJogos()
        var jogou = await Aluno.jogou(typeJogos, user)
        if(jogou){
            return {removed: false, message: "O aluno já jogou alguns jogos, logo não pode ser removido."}
        }
        else{
            return await Aluno.deleteAluno(user)
        }
    }
    else{
        return {removed: false, message: "O aluno já fez algumas aplicações, logo não pode ser removido."}
    }

}

// ??
Aluno.deleteAluno = function(id){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From alunos where user = ?", id, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.affectedRows == 0){ resolve({removed: false, message:"O aluno não pode ser eliminado, visto que já realizou jogos na plataforma."})}
                    else {resolve({message: "O aluno foi removido com sucesso.", removed: true})}
                }
            });   
    })    
}

module.exports = Aluno