const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');


getTemas2 = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT tema, codtema FROM subtemas WHERE codtema!=100 GROUP BY codtema;`, function(err, res){
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

getSubTemasFrom100 = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT tema,subtema, codtema, codsubtema FROM subtemas WHERE codtema=100 GROUP BY codsubtema;` , function(err, res){
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

module.exports.getTemas = async function(){
    var temas = await getTemas2()
    var subtemas = await getSubTemasFrom100()
    var result = ["Todas"]
    for(var i = 0; i < temas.length; i++){
        result.push(temas[i])
    }
    for(var i = 0; i < subtemas.length; i++){
        result.push(subtemas[i])
    }
    return result
}

module.exports.getAllAppsFromMunicipios = function(dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, ${bdAplicacoes}.professores prof, 
               ${bdAplicacoes}.Escolas esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim] ,function(err, res){
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


module.exports.getAllAppsFromMunicipio = function(municipio, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.cod, esc.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade = ? ) as esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.cod Order by frequencia DESC;`,[dataInicio, dataFim, municipio] ,function(err, res){
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

module.exports.getAllAppsFromEscola = function(escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT apps.codprof, prof.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, 
        (select * from ${bdAplicacoes}.professores where escola = ? ) as prof WHERE apps.codProf=prof.codigo 
        GROUP BY apps.codprof Order by frequencia DESC;`,[dataInicio, dataFim, escola] ,function(err, res){
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

module.exports.getAllAppsFromTurma = function(turma, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND codProf = ? AND (lastdate between ? and ?)) as apps, ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, [turma, codprofessor, dataInicio, dataFim] ,function(err, res){
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


module.exports.getAppFromMuncipios = function(codtema, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo = ?) as apps, ${bdAplicacoes}.professores prof, 
               ${bdAplicacoes}.Escolas esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim, codtema] ,function(err, res){
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

module.exports.getAppFromMuncipiosSubTema = function(codtema, codsubtema, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo = ? and appid = ?) as apps, ${bdAplicacoes}.professores prof, 
               ${bdAplicacoes}.Escolas esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim, codtema, codsubtema] ,function(err, res){
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

module.exports.getAppFromMunicipio = function(codtema, municipio, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.cod, esc.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo = ?) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade = ? ) as esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.cod Order by frequencia DESC;`,[dataInicio, dataFim, codtema, municipio] ,function(err, res){
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

module.exports.getAppFromMunicipioSubTema = function(codtema, codsubtema, municipio, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.cod, esc.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=? and appid=?) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade = ? ) as esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.cod Order by frequencia DESC;`,[dataInicio, dataFim, codtema, codsubtema, municipio] ,function(err, res){
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

module.exports.getAppFromEscola = function(codtema, escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT apps.codprof, prof.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=?) as apps, 
        (select * from ${bdAplicacoes}.professores where escola = ? ) as prof WHERE apps.codProf=prof.codigo 
        GROUP BY apps.codprof Order by frequencia DESC;`,[dataInicio, dataFim, codtema, escola] ,function(err, res){
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

module.exports.getAppFromEscolaSubTema = function(codtema, codsubtema, escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT apps.codprof, prof.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=? and appid=?) as apps, 
        (select * from ${bdAplicacoes}.professores where escola = ? ) as prof WHERE apps.codProf=prof.codigo 
        GROUP BY apps.codprof Order by frequencia DESC;`,[dataInicio, dataFim, codtema, codsubtema, escola] ,function(err, res){
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

module.exports.getAppFromTurma = function(codtema, turma, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND codProf = ? AND (lastdate between ? and ?) and grupo=?) as apps, ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, [turma, codprofessor, dataInicio, dataFim, codtema] ,function(err, res){
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

module.exports.getAppFromTurmaSubTema = function(codtema, codsubtema, turma, codprofessor, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND codProf = ? AND (lastdate between ? and ?) and grupo=? and appid=?) as apps, ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, [turma, codprofessor, dataInicio, dataFim, codtema, codsubtema] ,function(err, res){
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

