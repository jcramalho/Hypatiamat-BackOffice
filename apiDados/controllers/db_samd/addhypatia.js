var sql = require('../../models/db_samd');

var AddHypatia = function(addHypatia){
    this.id = addHypatia.id;
    this.idaluno = addHypatia.idaluno;
    this.idescola = addHypatia.idescola
    this.pontuacao = addHypatia.pontuacao
    this.data = addHypatia.data
    this.tipo = addHypatia.tipo
    this.turma = addHypatia.turma
    this.horario = addHypatia.horario
};

AddHypatia.insertRegisto = function(addHypatia){
return new Promise(function(resolve, reject) {
    var args = [addHypatia.id, addHypatia.idaluno, addHypatia.idescola, addHypatia.pontuacao,
                addHypatia.data, addHypatia.tipo, addHypatia.turma, addHypatia.horario]
    sql.query("INSERT INTO addhypatia (`id`, `idaluno`, `idescola`, `pontuacao`, `data`, `tipo`, `turma`, `horario`)" + 
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
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
}

AddHypatia.getRegisto = function(id){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from addhypatia where id=?", id, function(err, res){
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

AddHypatia.getRegistos = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from addhypatia ORDER BY pontuacao DESC", function(err, res){
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

AddHypatia.getRegistosFromAluno = function(idaluno){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM addhypatia where idaluno=? order by pontuacao DESC", idaluno, function(err, res){
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

AddHypatia.getTop100FromEscola = function(idescola){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM addhypatia where idescola=? order by pontuacao DESC LIMIT 100;", idescola, function(err, res){
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

AddHypatia.getRegistosFromTurma= function(turma){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM addhypatia where turma=? order by pontuacao DESC", turma, function(err, res){
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

AddHypatia.getRegistosFromData = function(data){
    
}

AddHypatia.getTop20 = function(){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT * FROM addhypatia order by pontuacao DESC LIMIT 20", function(err, res){
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

AddHypatia.getAlunoMedia = function(idaluno){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT sum(pontuacao)/count(*) as media FROM addhypatia where idaluno=?", idaluno, function(err, res){
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



module.exports = AddHypatia