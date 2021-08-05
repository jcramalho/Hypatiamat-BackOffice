const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');
var dataInicioAno = require('../../config/confs').dataInicio1
var dataFimAno = require('../../config/confs').dataFim1

getTemas2 = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT tema, codtema, subtema, codsubtema FROM subtemas GROUP BY codsubtema;`, function(err, res){
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

module.exports.getTemasLast10 = async function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT tema, subtema, codtema, codsubtema FROM subtemas GROUP BY codsubtema;` , function(err, res){
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
    //var subtemas = await getSubTemasFrom100()
    var result = ["Todas"]
    for(var i = 0; i < temas.length; i++){
        result.push(temas[i])
    }
    /*
    for(var i = 0; i < subtemas.length; i++){
        result.push(subtemas[i])
    }*/
    
    // ordenação das apps
    await result.sort(function(a,b){
        if(a == "Todas") return true
        else if(b == "Todas") return false
        else if(a.subtema && b.subtema) return a.subtema.localeCompare(b.subtema)
        else if(a.subtema && !b.subtema) return a.subtema.localeCompare(b.tema)
        else if(!a.subtema && b.subtema) return a.tema.localeCompare(b.subtema) 
        else return a.tema.localeCompare(b.tema)
    })

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

module.exports.getAllAppsFromComunidade = function(comunidade, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim, comunidade] ,function(err, res){
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

module.exports.getAllAppsFromTurma = function(turma, codprofessor, dataInicio, dataFim, horaInicio, horaFim){
    var horarioInicio = dataInicio.concat(' ', horaInicio)
    var horarioFim = dataFim.concat(' ', horaFim + ':59')
    var args = [turma, codprofessor, horarioInicio, horarioFim]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia, al.numero as x,  
        round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as y FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND 
                    codProf = ? AND (CONCAT(lastdate, ' ', horario) between ? and ?) ) as apps, 
        ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, args ,function(err, res){
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

module.exports.getAppFromComunidade = function(codtema, comunidade, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo = ?) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim, codtema, comunidade] ,function(err, res){
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

module.exports.getAppFromComunidadeSubTema = function(codtema, codsubtema, comunidade, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia 
        FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?) and grupo=? and appid=?) as apps, ${bdAplicacoes}.professores prof, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo 
        GROUP BY esc.localidade Order by frequencia DESC;`,[dataInicio, dataFim, codtema, codsubtema, comunidade] ,function(err, res){
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

module.exports.getAppFromTurma = function(codtema, turma, codprofessor, dataInicio, dataFim, horaInicio, horaFim){
    var horarioInicio = dataInicio.concat(' ', horaInicio)
    var horarioFim = dataFim.concat(' ', horaFim + ':59')
    var args = [turma, codprofessor, codtema, horarioInicio, horarioFim]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia, al.numero as x, 
        round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as y FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND 
                    codProf = ? and grupo=? and (CONCAT(lastdate, ' ', horario) between ? and ?) ) as apps, 
        ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, args ,function(err, res){
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

module.exports.getAppFromTurmaSubTema = function(codtema, codsubtema, turma, codprofessor, dataInicio, dataFim, horaInicio, horaFim){
    var horarioInicio = dataInicio.concat(' ', horaInicio)
    var horarioFim = dataFim.concat(' ', horaFim + ':59')
    var args = [turma, codprofessor, codtema, codsubtema, horarioInicio, horarioFim] 
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT al.numero, apps.userid, al.nome, SUM(apps.ncertas) as ncertas, SUM(apps.ntotal) as ntotal, round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as acerto, 
        SUM(apps.onpeak) as onpeak, SUM(apps.offpeak) as offpeak, (SUM(apps.onpeak) + SUM(apps.offpeak)) as frequencia, al.numero as x,
        round( sum(apps.ncertas)/sum(apps.ntotal) *100, 0) as y FROM 
        (select * from ${bdTesteConhecimentos}.appsinfoall WHERE  turma = ? AND 
                    codProf = ? and grupo=? and appid=? and (CONCAT(lastdate, ' ', horario) between ? and ?) ) as apps, 
        ${bdAplicacoes}.alunos al 
        WHERE al.user = apps.userid 
        GROUP BY apps.userid Order by al.numero;`, args,function(err, res){
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

module.exports.getAllAppsFromAluno = function(user, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT userid, SUM(ncertas) as ncertas, SUM(ntotal) as ntotal, round( sum(ncertas)/sum(ntotal) *100, 0) as acerto, 
        SUM(onpeak) as onpeak, SUM(offpeak) as offpeak, (SUM(onpeak) + SUM(offpeak)) as frequencia FROM 
        ${bdTesteConhecimentos}.appsinfoall WHERE userid=? AND (lastdate between ? and ?);`, 
        [user, dataInicio, dataFim] ,function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length == 0) resolve(undefined)
                else resolve(res[0])
            }
        })
    })
}


module.exports.getAppFromAluno = function(codtema, user, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT userid,  SUM(ncertas) as ncertas, SUM(ntotal) as ntotal, round( sum(ncertas)/sum(ntotal) *100, 0) as acerto, 
        SUM(onpeak) as onpeak, SUM(offpeak) as offpeak, (SUM(onpeak) + SUM(offpeak)) as frequencia FROM 
        ${bdTesteConhecimentos}.appsinfoall WHERE userid=? AND (lastdate between ? and ?) and grupo=?;`, 
        [user, dataInicio, dataFim, codtema] ,function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length == 0) resolve(undefined)
                else resolve(res[0])
            }
        })
    })
}

module.exports.getAppFromAlunoSubTema = function(codtema, codsubtema, user, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT userid,  SUM(ncertas) as ncertas, SUM(ntotal) as ntotal, round( sum(ncertas)/sum(ntotal) *100, 0) as acerto, 
        SUM(onpeak) as onpeak, SUM(offpeak) as offpeak, (SUM(onpeak) + SUM(offpeak)) as frequencia FROM 
        ${bdTesteConhecimentos}.appsinfoall WHERE userid=? AND (lastdate between ? and ?) and grupo=? and appid=?;`, 
        [user, dataInicio, dataFim, codtema, codsubtema] ,function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length == 0) resolve(undefined)
                else resolve(res[0])
            }
        })
    })
}

module.exports.getAppFromAlunoPorDiaSubTema = function(user, codtema, codsubtema){
    var args = [user, codtema, codsubtema]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT lastdate, SUM(ncertas) as ncertas, SUM(ntotal) as ntotal, round( sum(ncertas)/sum(ntotal) *100, 0) as acerto, 
                SUM(onpeak) as onpeak, SUM(offpeak) as offpeak, (SUM(onpeak) + SUM(offpeak)) as frequencia 
                FROM ${bdTesteConhecimentos}.appsinfoall 
                WHERE userid=? and grupo=? and appid=?
                group by lastdate
                order by lastdate desc;`, args,function(err, res){
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

module.exports.getAppFromAlunoPorDiaTema = function(user, codtema){
    var args = [user, codtema]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT lastdate, SUM(ncertas) as ncertas, SUM(ntotal) as ntotal, round( sum(ncertas)/sum(ntotal) *100, 0) as acerto, 
                SUM(onpeak) as onpeak, SUM(offpeak) as offpeak, (SUM(onpeak) + SUM(offpeak)) as frequencia 
                FROM ${bdTesteConhecimentos}.appsinfoall 
                WHERE userid=? and grupo=?
                group by lastdate
                order by lastdate desc;`, args,function(err, res){
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

module.exports.getInfoGeralFromAluno = function (user){
    var args = [user, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT count(distinct appid, grupo) as napps, SUM(ncertas) as ncertas
                FROM ${bdTesteConhecimentos}.appsinfoall 
                WHERE userid=? and (lastdate between ? and ?);`, args,function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res[0].ncertas) resolve(res[0])
                else resolve({napps: 0, ncertas: 0})
            }
        })
    })
}

module.exports.getFreqAppsFromAlunoPorDia = async function(user){
    var args = [user, dataInicioAno, dataFimAno]
    return new Promise(async function(resolve, reject) {
        sql.query(`SELECT lastdate, SUM(ncertas) as ncertas, (SUM(onpeak) + SUM(offpeak)) as frequencia
                FROM ${bdTesteConhecimentos}.appsinfoall 
                WHERE userid=? and (lastdate between ? and ?)
                group by lastdate
                order by lastdate asc;`, args,function(err, res){
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

module.exports.getLast10 = async function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT grupo, appid, sum(ncertas) as ncertas, sum(ntotal) as ntotal, ROUND((sum(ncertas)/sum(ntotal))*100, 0) as acerto, 
                max(concat(lastdate, ' ', horario)) as lastdate, sum(onpeak+offpeak) as frequencia
                    FROM ${bdTesteConhecimentos}.appsinfoall 
                    WHERE userid=?
                    group by grupo, appid
                    Order by lastdate desc
                    limit 10;`, user,function(err, res){
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

module.exports.getLast10FromAluno = function(user){
    var temas = this.getTemasLast10()
    var last10 = this.getLast10(user)
    return Promise.all([temas, last10])
            .then(dados => {
                var temas = dados[0]
                var last10 = dados[1]
                for(var i = 0; i < last10.length; i++){
                    var app = last10[i]        
                    var tema = temas.find(e => e.codtema == app.grupo && e.codsubtema == app.appid)
                    var aux = app.lastdate.split(" ")
                    app.lastdate = aux[0]
                    app.horario = aux[1]
                    if(tema){
                        app.nome = tema.subtema
                    }
                    else{
                        tema = temas.find(e => e.codtema == app.grupo)
                        app.nome = tema.tema
                    }
                }
                return last10
            })
            .catch(erro => {console.log(erro); reject(erro)})
    
}

module.exports.getAppsFromAlunoAux = function(user, dataInicio, dataFim){
    var args = [user, dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`select distinct grupo, appid 
                    from hypati67_testeconhecimentos.appsinfoall 
                    where userid=? and (lastdate between ? and ?);`, args, function(err, res){
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

module.exports.getAppsFromAluno = async function(user, dataInicio, dataFim){
    var appsJogadas = await this.getAppsFromAlunoAux(user, dataInicio, dataFim)
    var appsTodas = await this.getTemas()
    var res = ["Todas"]
    for(var i = 1; i < appsTodas.length; i++){
        var tema = appsTodas[i]
        if(tema.codsubtema){
            var app = appsJogadas.find(e => e.grupo == tema.codtema && e.appid == tema.codsubtema)
            if(app) res.push(tema)
        }
        else{
            var app = appsJogadas.find(e => e.grupo == tema.codtema)
            if(app) res.push(tema)
        }
    }

    return res
}

module.exports.getAppsFromTurmaAux = function(turma, codprofessor, dataInicio, dataFim){
    var args = [turma, codprofessor, dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`select distinct grupo, appid 
                    from hypati67_testeconhecimentos.appsinfoall 
                    where turma=? and codProf=? and (lastdate between ? and ?);`, args, function(err, res){
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

module.exports.getAppsFromTurma = async function(turma, codprofessor, dataInicio, dataFim){
    var appsJogadas = await this.getAppsFromTurmaAux(turma, codprofessor, dataInicio, dataFim)
    var appsTodas = await this.getTemas()
    var res = ["Todas"]
    for(var i = 1; i < appsTodas.length; i++){
        var tema = appsTodas[i]
        if(tema.codsubtema){
            var app = appsJogadas.find(e => e.grupo == tema.codtema && e.appid == tema.codsubtema)
            if(app) res.push(tema)
        }
        else{
            var app = appsJogadas.find(e => e.grupo == tema.codtema)
            if(app) res.push(tema)
        }
    }

    return res
}

module.exports.getAllAcertoFromAluno = async function(user){   
    var args = [user, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`select ROUND((sum(ncertas)/sum(ntotal))*100, 0) as acerto 
                from ${bdTesteConhecimentos}.appsinfoall where userid=? and (lastdate between ? and ?);`, args, function(err, res){
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

module.exports.getFrequenciaPorDiaTurmaApp = function(tema, turma, codprofessor){
    var args = [tema, turma, codprofessor, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`select lastdate as data, sum(ntotal) as freq, count(distinct userid) as nalunos
			from ${bdTesteConhecimentos}.appsinfoall 
                    where grupo = ? and turma = ? and codProf = ? and (lastdate between ? and ?)
                    group by lastdate;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                var freqTotal = 0
                for(var i = 0; i < res.length; i++)
                    freqTotal += res[i].freq
                
                resolve({porDia: res, total: freqTotal})
            }
        })
    })      
}

module.exports.getFrequenciaPorDiaTurmaAppSubtema = function(tema, subtema, turma, codprofessor){
    var args = [tema, subtema, turma, codprofessor, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`select lastdate as data, sum(ntotal) as freq, count(distinct userid) as nalunos
			from ${bdTesteConhecimentos}.appsinfoall 
                    where grupo = ? and appid = ? and turma = ? and codProf = ? and (lastdate between ? and ?)
                    group by lastdate;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                var freqTotal = 0
                for(var i = 0; i < res.length; i++)
                    freqTotal += res[i].freq
                
                resolve({porDia: res, total: freqTotal})
            }
        })
    })      
}

module.exports.getFrequenciaPorDiaTurmaAllApps = function(turma, codprofessor){
    var args = [turma, codprofessor, dataInicioAno, dataFimAno]
    return new Promise(function(resolve, reject) {
        sql.query(`select lastdate as data, sum(ntotal) as freq, count(distinct userid) as nalunos
			from ${bdTesteConhecimentos}.appsinfoall 
                    where turma = ? and codProf = ? and (lastdate between ? and ?)
                    group by lastdate;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                var freqTotal = 0
                for(var i = 0; i < res.length; i++)
                    freqTotal += res[i].freq
                
                resolve({porDia: res, total: freqTotal})
            }
        })
    })      
}

module.exports.getEstatisticasGraficoTurmaAllApps = async function(turma, codprofessor){
    var freqs = await this.getFrequenciaPorDiaTurmaAllApps(turma, codprofessor)
    var dataInicio = dataInicioAno
    if(freqs.porDia.length > 0 ) dataInicio = freqs.porDia[0].data
    var dataFim 
    var arrayIntervals = []
    var intervalosFreqsIdeais = [freqs.total*0.15, freqs.total*0.7, freqs.total*0.15]
    var intervaloAtual = 0
    var freqAux = 0;
    var freqConsumida = 0
    for(var i = 0; i < freqs.porDia.length; i++){
        freqAux += freqs.porDia[i].freq
        var freqPretendida = intervalosFreqsIdeais[intervaloAtual]
        if(freqAux >= freqPretendida && intervaloAtual < intervalosFreqsIdeais.length-1){
            freqConsumida += freqAux
            //console.log("Diferença com tudo (Periodo " + (intervaloAtual +1)  + " ): " + Math.abs(freqPretendida - freqAux))
            //console.log("Diferença 2 (Periodo " + (intervaloAtual +1)  + " ): " +Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq)))

            if(Math.abs(freqPretendida - freqAux) > Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq) ) && i > 0){
                dataFim = freqs.porDia[i-1].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux - freqs.porDia[i].freq,
                })
                freqAux = freqs.porDia[i].freq;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
            else{
                dataFim = freqs.porDia[i].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux
                })
                freqAux = 0;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
        }
        else if(i == freqs.porDia.length - 1){
            dataFim = freqs.porDia[i].data
            arrayIntervals.push({
                dataInicio: dataInicio,
                dataFim: dataFim,
                freq: freqAux
            })
            intervaloAtual++
        }
    }

    for(var i = 0; i < arrayIntervals.length; i++){
        var intervalo = arrayIntervals[i]
        intervalo.label = "Período " + (i+1)
        intervalo.data = await this.getAllAppsFromTurma(turma, codprofessor, intervalo.dataInicio, intervalo.dataFim, '00:00:00', '23:59:59')
    }

    return {
        estatisticas: freqs,
        intervalos: arrayIntervals
    }


}

module.exports.getEstatisticasGraficoTurmaApp = async function(codtema, turma, codprofessor){
    var freqs = await this.getFrequenciaPorDiaTurmaApp(codtema, turma, codprofessor)
    var dataInicio = dataInicioAno
    if(freqs.porDia.length > 0 ) dataInicio = freqs.porDia[0].data
    var dataFim 
    var arrayIntervals = []
    var intervalosFreqsIdeais = [freqs.total*0.15, freqs.total*0.7, freqs.total*0.15]
    var intervaloAtual = 0
    var freqAux = 0;
    var freqConsumida = 0
    for(var i = 0; i < freqs.porDia.length; i++){
        freqAux += freqs.porDia[i].freq
        var freqPretendida = intervalosFreqsIdeais[intervaloAtual]
        if(freqAux >= freqPretendida && intervaloAtual < intervalosFreqsIdeais.length-1){
            freqConsumida += freqAux
            //console.log("Diferença com tudo (Periodo " + (intervaloAtual +1)  + " ): " + Math.abs(freqPretendida - freqAux))
            //console.log("Diferença 2 (Periodo " + (intervaloAtual +1)  + " ): " +Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq)))

            if(Math.abs(freqPretendida - freqAux) > Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq) ) && i > 0){
                dataFim = freqs.porDia[i-1].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux - freqs.porDia[i].freq,
                })
                freqAux = freqs.porDia[i].freq;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
            else{
                dataFim = freqs.porDia[i].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux
                })
                freqAux = 0;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
        }
        else if(i == freqs.porDia.length - 1){
            dataFim = freqs.porDia[i].data
            arrayIntervals.push({
                dataInicio: dataInicio,
                dataFim: dataFim,
                freq: freqAux
            })
            intervaloAtual++
        }
    }
    for(var i = 0; i < arrayIntervals.length; i++){
        var intervalo = arrayIntervals[i]
        intervalo.label = "Período " + (i+1)
        intervalo.data = await this.getAppFromTurma(codtema, turma, codprofessor, intervalo.dataInicio, intervalo.dataFim, '00:00:00', '23:59:59')
    }

    return {
        estatisticas: freqs,
        intervalos: arrayIntervals
    }


}


module.exports.getEstatisticasGraficoTurmaAppSubtema = async function(codtema, codsubtema, turma, codprofessor){
    var freqs = await this.getFrequenciaPorDiaTurmaAppSubtema(codtema, codsubtema, turma, codprofessor)
                          .catch(erro => console.log(erro))
    var dataInicio = dataInicioAno
    if(freqs.porDia.length > 0 ) dataInicio = freqs.porDia[0].data
    var dataFim 
    var arrayIntervals = []
    var intervalosFreqsIdeais = [freqs.total*0.15, freqs.total*0.7, freqs.total*0.15]
    var intervaloAtual = 0
    var freqAux = 0;
    var freqConsumida = 0
    for(var i = 0; i < freqs.porDia.length; i++){
        freqAux += freqs.porDia[i].freq
        var freqPretendida = intervalosFreqsIdeais[intervaloAtual]
        if(freqAux >= freqPretendida && intervaloAtual < intervalosFreqsIdeais.length-1){
            freqConsumida += freqAux
            //console.log("Diferença com tudo (Periodo " + (intervaloAtual +1)  + " ): " + Math.abs(freqPretendida - freqAux))
            //console.log("Diferença 2 (Periodo " + (intervaloAtual +1)  + " ): " +Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq)))

            if(Math.abs(freqPretendida - freqAux) > Math.abs(freqPretendida - (freqAux - freqs.porDia[i].freq) ) && i > 0){
                dataFim = freqs.porDia[i-1].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux - freqs.porDia[i].freq,
                })
                freqAux = freqs.porDia[i].freq;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
            else{
                dataFim = freqs.porDia[i].data
                arrayIntervals.push({
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    freq: freqAux
                })
                freqAux = 0;
                var aux = new Date((new Date(dataFim)).getTime() + 86400000)
                dataInicio = aux.toISOString().split('T')[0]
                intervaloAtual++
            }
        }
        else if(i == freqs.porDia.length - 1){
            dataFim = freqs.porDia[i].data
            arrayIntervals.push({
                dataInicio: dataInicio,
                dataFim: dataFim,
                freq: freqAux
            })
            intervaloAtual++
        }
    }

    for(var i = 0; i < arrayIntervals.length; i++){
        var intervalo = arrayIntervals[i]
        intervalo.label = "Período " + (i+1)
        intervalo.data = await this.getAppFromTurmaSubTema(codtema, codsubtema, turma, codprofessor, intervalo.dataInicio, intervalo.dataFim, '00:00:00', '23:59')
    }

    return {
        estatisticas: freqs,
        intervalos: arrayIntervals
    }


}