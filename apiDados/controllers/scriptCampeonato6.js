const { bdTesteConhecimentos, bdAplicacoes } = require('../models/conf')
var sql = require('../models/db_aplicacoes')



getAlunosCampeonato6and7= function(){
    return new Promise(function(resolve, reject) {
        sql.query(`Select user, campeonatoID from ${bdTesteConhecimentos}.campeonatos where (campeonatoID='camhy006' or campeonatoID='camhy007')`, function(err, res){
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

getTurmaProf = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select turma, codprofessor from ${bdAplicacoes}.alunos where user=?`, [user], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res[0])
            }
        })
    })
}

updateCampeonatoAluno = function(user, campeonato, turma, codprofessor){
    return new Promise(function(resolve, reject) {
        sql.query(`Update ${bdTesteConhecimentos}.campeonatos Set turma=?, codprofessor=? 
                        where user=? and campeonatoID=?`, [turma, codprofessor, user, campeonato], function(err, res){
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


run = async function(){
    var alunos = await getAlunosCampeonato6and7()
                        .catch(erro => console.log(erro))
    console.log('Alunos a serem atualizados calculados..\nA atualizar tabela dos campeonatos..')
    for(var i = 0; i < alunos.length; i++){
        var user = alunos[i].user
        var aluno = await getTurmaProf(user)
                            .catch(erro => console.log(erro))
        await updateCampeonatoAluno(user, alunos[i].campeonatoID, aluno.turma, aluno.codprofessor)
                .catch(erro => console.log(erro))
    }
    console.log('Campeonatos Atualizados.')
    return;
}

run();
return;