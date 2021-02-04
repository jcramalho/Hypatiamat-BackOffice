var sql = require('../../models/db_testeconhecimentos');


module.exports.getTemas = function(){
    return ["Todas"];
}

module.exports.getAllAppsFromMunicipios = function(dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query("SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, "
        +"SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia " +
        "FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between ? and ?)) as apps, hypat_aplicacoes.professores prof, "  +
               "hypat_aplicacoes.escolas esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo " +
        "GROUP BY esc.localidade Order by frequencia DESC;",[dataInicio, dataFim] ,function(err, res){
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
        sql.query("SELECT esc.cod, esc.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto,"
        +"SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia " +
        "FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between ? and ?)) as apps, hypat_aplicacoes.professores prof, "  +
        "(select * from hypat_aplicacoes.escolas where localidade = ? ) as esc WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo " +
        "GROUP BY esc.cod Order by frequencia DESC;",[dataInicio, dataFim, municipio] ,function(err, res){
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
        sql.query("SELECT apps.codprof, prof.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, "
        +"SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia " +
        "FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between ? and ?)) as apps, "  +
        "(select * from hypat_aplicacoes.professores where escola = ? ) as prof WHERE apps.codProf=prof.codigo " +
        "GROUP BY apps.codprof Order by frequencia DESC;",[dataInicio, dataFim, escola] ,function(err, res){
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
        sql.query("SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, "+
        "SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia FROM " + 
        "(select * from hypat_testeconhecimentos.appsinfoall WHERE  turma = ? AND codProf = ? AND (lastdate between ? and ?)) as apps, hypat_aplicacoes.alunos al " +
        "WHERE al.user = apps.userid " +
        "GROUP BY apps.userid Order by al.numero;", [turma, codprofessor, dataInicio, dataFim] ,function(err, res){
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


module.exports.getAppFromMuncipios = function(appid, dataInicio, dataFim){
    return []
}

module.exports.getAppFromMunicipio = function(appid, municipio, dataFim, dataInicio){
    return []
}

module.exports.getAppFromEscola = function(appid, escola, dataFim, dataInicio){
    return []
}

module.exports.getAppFromTurma = function(appid, turma, codprofessor, dataFim, dataInicio){
    return []
}

