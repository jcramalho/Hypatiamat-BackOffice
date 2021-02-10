var sql = require('../../models/db_aplicacoes');

var TurmaOld = function(turmaOld){
    this.id = turmaOld.id;
    this.codAluno = turmaOld.codAluno;
    this.turma = turmaOld.turma;
    this.codProfessor = turmaOld.codProfessor
};

TurmaOld.insertTurmaOld = function (turma) {    
    return new Promise(function(resolve, reject) {
    var args = [turma.codAluno, turma.turma, turma.codProfessor, turma.anoletivo]
    sql.query("INSERT INTO turmasold (`codAluno`,  `turma`, `codProfessor`, `anoletivo`) VALUES (?, ?, ?, ?)", 
                args, function (err, res) {
            if(err) {
                console.log("error: ", err);
                reject(err);
            }
            else{
                resolve(res);
            }
        });   
    })       
};

TurmaOld.getAlunosFromTurma = function(turma){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from turmasold where turma = ?", turma, 
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

module.exports = TurmaOld