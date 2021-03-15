const { bdTesteConhecimentos, bdAplicacoes } = require('../models/conf')
var sql = require('../models/db_aplicacoes')



getAlunosCampeonatosAntigos= function(){
    return new Promise(function(resolve, reject) {
        sql.query(`Select user, campeonatoID from ${bdTesteConhecimentos}.campeonatos where not(campeonatoID='camhy006' or campeonatoID='camhy007')`, function(err, res){
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
        sql.query(`Select turma, codProfessor as codprofessor from ${bdAplicacoes}.turmasold where codAluno=? and anoletivo='19/20' order by id desc`, [user], function(err, res){
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

getTurmaProf2 = function(user){
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
    var alunos = await getAlunosCampeonatosAntigos()
                        .catch(erro => console.log(erro))
    console.log('Alunos a serem atualizados calculados..\nA atualizar tabela dos campeonatos..')
    var turmasold = 0;
    var alunosAtuais = 0;
    var alunossemturma = 0;
    for(var i = 0; i < alunos.length; i++){
        var user = alunos[i].user
        var aluno = await getTurmaProf(user)
                            .catch(erro => console.log(erro))
        if(aluno){
            turmasold++
            await updateCampeonatoAluno(user, alunos[i].campeonatoID, aluno.turma, aluno.codprofessor)
                  .catch(erro => console.log(erro))
        }
        else{
            alunosAtuais++;
            var alunoAtual = await getTurmaProf2(user)
                              .catch(erro => console.log(erro))
            if(alunoAtual){
                await updateCampeonatoAluno(user, alunos[i].campeonatoID, alunoAtual.turma, alunoAtual.codprofessor)
                         .catch(erro => console.log(erro))
            }
            else alunossemturma++
        }
        
    }
    console.log("Alunos Old: " + turmasold + ";\nAlunos atuais atualizados: " + (alunosAtuais-alunossemturma) + ";\nAlunos impossíveis de atualizar: " + alunossemturma)
    console.log('Campeonatos Atualizados.')
    return;
}

run();
return;