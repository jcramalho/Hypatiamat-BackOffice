var sql = require('../../models/db_aplicacoes');
var Jogos = require('../db_samd/jogos')
let mysql = require('mysql')

const Estatistica = function(estatistica){
    this.id = estatistica.id
}

Estatistica.getTurmasAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select t.id, t.turma, p.escola from (select * from turmas where anoletivo = ?) t, 
            (select * from escolas where localidade = ?) e, professores p
            where t.idprofessor = p.codigo and e.cod = p.escola
            Group by t.id;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })
}

Estatistica.getProfessoresAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select p.codigo from (select * from turmas where anoletivo=?) t, 
        (select * from escolas where localidade = ?) e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by p.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })
}

Estatistica.getAgrupamentosAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select distinct e.cod, e.nome from (select * from turmas where anoletivo=?) t, 
        (select * from escolas where localidade = ?) e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    /*
                    var resultado = []
                    for(var i = 0; i < res.length; i++){
                        resultado.push(res[i].cod)
                    }*/
                    resolve(res);
                }
            });   
    })
}

Estatistica.getNumAlunos = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select count(a.user) as numalunos from alunos a where a.codprofessor in (?) and a.turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getNumAlunosOld = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select count(codAluno) as numalunos from turmasold where codProfessor in (?) and turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

// Frequência das apps durante o ano letivo realizado por agrupamentos de um determinado munícipio
Estatistica.getFreqAppsAnoMun = function(municipio, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [dataInicio, dataFim, municipio]
        sql.query(`SELECT sum(apps.offpeak) + sum(apps.onpeak) as freqapps, sum(apps.ncertas) as ncertas, sum(apps.ntotal) as ntotal
                    FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between ? and ?)) as apps, 
                        hypat_aplicacoes.professores prof,
                        (select * from hypat_aplicacoes.escolas where localidade=?) as esc
                        WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

// Frequencia das appps através das turmas e professores de um ano
Estatistica.getFreqAppsTurmasAnoMun = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select sum(offpeak) + sum(onpeak) as freqapps, sum(ncertas) as ncertas, sum(ntotal) as ntotal
                    from hypat_testeconhecimentos.appsinfoall where codProf in (?) and turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getTarefasAnoMun = function(){
    return new Promise(function(resolve, reject) {
        sql.query(``, [jogoTipo, turmas, agrupamentos], function(err, res){
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

Estatistica.jogou = function(jogoTable, jogoTipo, turmas, agrupamentos){
    return new Promise(function(resolve, reject) {
        sql.query("Select count(*) as freq from hypat_samd." + jogoTable + " where tipo = ? and turma in (?) and idescola in (?)", [jogoTipo, turmas, agrupamentos], function(err, res){
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



// Quantos jogos foram jogados por um conjunto de turmas e agrupamentos de um ano letivo
Estatistica.quantosJogosTurmasAnoMun = async function(turmas, agrupamentos){
    var jogos = await Jogos.getJogos()
    var quantas = 0
    var freq = 0
    //console.log(turmas)
    //console.log(jogos.length)
    for(var i = 0; i < jogos.length; i++){
        //console.log(jogos[i])
        var jogo = await Estatistica.jogou(jogos[i].jogotable, jogos[i].tipo, turmas, agrupamentos)
        //console.log(jogo)
        if(jogo.freq > 0){
            quantas++
            freq += jogo.freq;
        }
    }

    return {freq:freq, njogos: quantas}

}

Estatistica.getEstatisticasMunicipioAno = async function(municipio, anoletivo){
    var turmas = await Estatistica.getTurmasAnoMun(municipio, anoletivo)
    var professores = await Estatistica.getProfessoresAnoMun(municipio, anoletivo)
    //var agrupamentos = await Estatistica.getAgrupamentosAnoMun(municipio, anoletivo)
    var professoresAux = []
    var turmasAux = []
    var anoAux = anoletivo.split("/")
    var dataInicio = "20" + anoAux[0] + "-09-01"
    var dataFim = "20" + anoAux[1] + "-09-01"

    for(var i = 0; i < turmas.length; i++){
        turmasAux.push(turmas[i].turma)
    }
    for(var i = 0; i < professores.length; i++){
        professoresAux.push(professores[i].codigo)
    }

    var nalunos = await Estatistica.getNumAlunos(professoresAux, turmasAux)
    var nalunosTurmasOld = {numalunos: 0}

    if(anoletivo != "20/21"){
        nalunosTurmasOld = await Estatistica.getNumAlunosOld(professoresAux, turmasAux)
    }

    //var nappsTurmas = await Estatistica.getFreqAppsTurmasAnoMun(professoresAux, turmasAux)
    //var nappsAno = await Estatistica.getFreqAppsAnoMun(municipio, dataInicio, dataFim)

    //var jogos = await Estatistica.quantosJogosTurmasAnoMun(turmasAux, agrupamentos)

    return {nturmas: turmas.length, nprofessores: professores.length, 
            nalunos: nalunos.numalunos + nalunosTurmasOld.numalunos}
            //appsTurma: nappsTurmas, appsTotal: nappsAno,
            //njogos: jogos.njogos, freqjogos: jogos.freq}

}

Estatistica.getTurmasAnoAgru = function(escola, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola]
        sql.query(`select t.turma
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ?
                    Group by t.id;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })
}

Estatistica.getProfessoresAnoAgru = function(escola, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola]
        sql.query(`select p.codigo
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ?
                    Group by p.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })
}

Estatistica.getFreqAppsAnoAgru = function(escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [dataInicio, dataFim, escola]
        sql.query(`SELECT sum(apps.offpeak) + sum(apps.onpeak) as freqapps, sum(apps.ncertas) as ncertas, sum(apps.ntotal) as ntotal
                    FROM (select * from hypat_testeconhecimentos.appsinfoall where (lastdate between ? and ?)) as apps, 
                        hypat_aplicacoes.professores prof
                        WHERE  prof.escola = ? and apps.codProf=prof.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.jogouAgru = function(jogoTable, jogoTipo, turmas, escola){
    return new Promise(function(resolve, reject) {
        sql.query("Select count(idaluno) as freq from hypat_samd." + jogoTable + " where tipo = ? and turma in (?) and idescola=?", [jogoTipo, turmas, escola], function(err, res){
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

Estatistica.quantosJogosTurmasAnoAgru = async function(turmas, escola){
    var jogos = await Jogos.getJogos()
    var quantas = 0
    var freq = 0
    for(var i = 0; i < jogos.length; i++){
        var jogo = await Estatistica.jogouAgru(jogos[i].jogotable, jogos[i].tipo, turmas, escola)
        if(jogo.freq > 0){
            quantas++
            freq += jogo.freq; 
        }
        
    }

    return {freq:freq, njogos: quantas}

}

Estatistica.getEstatisticasAgrupamentoAno = async function(escola, anoletivo){
    var turmas = await Estatistica.getTurmasAnoAgru(escola, anoletivo)
    var professores = await Estatistica.getProfessoresAnoAgru(escola, anoletivo)
    var professoresAux = []
    var turmasAux = []
    var anoAux = anoletivo.split("/")
    var dataInicio = "20" + anoAux[0] + "-09-01"
    var dataFim = "20" + anoAux[1] + "-09-01"
    for(var i = 0; i < turmas.length; i++){
        turmasAux.push(turmas[i].turma)
    }
    for(var i = 0; i < professores.length; i++){
        professoresAux.push(professores[i].codigo)
    }

    //console.log(anoletivo)
    if(turmasAux.length > 0 && professoresAux.length > 0){
        var nalunos = await Estatistica.getNumAlunos(professoresAux, turmasAux)
        var nalunosTurmasOld = {numalunos: 0}        

        if(anoletivo != "20/21"){
            nalunosTurmasOld = await Estatistica.getNumAlunosOld(professoresAux, turmasAux)
        }

        //var nappsTurmas = await Estatistica.getFreqAppsTurmasAnoMun(professoresAux, turmasAux)

        //var jogos = await Estatistica.quantosJogosTurmasAnoAgru(turmasAux, escola)
    }
    else{
        var nalunos = {numalunos:0}
        var nalunosTurmasOld = {numalunos: 0}
        var nappsTurmas = {ncertas: 0, ntotal:0, freqapps: 0}
        var jogos = {njogos: 0, freq: 0}
    }

    //var nappsAno = await Estatistica.getFreqAppsAnoAgru(escola, dataInicio, dataFim)

    

    return {nturmas: turmas.length, nprofessores: professores.length, 
            nalunos: nalunos.numalunos + nalunosTurmasOld.numalunos}
            //appsTurma: nappsTurmas, appsTotal: nappsAno,
            //njogos: jogos.njogos, freqjogos: jogos.freq}

}

Estatistica.getEstatisticaAgruMun = async function(municipio, anoletivo){

    var agrupamentos = await Estatistica.getAgrupamentosAnoMun(municipio, anoletivo)
    var resultado = []
    
    for(var i = 0; i < agrupamentos.length; i++){
        var agrupamento = await Estatistica.getEstatisticasAgrupamentoAno(agrupamentos[i].cod, anoletivo)
        agrupamento.cod = agrupamentos[i].cod
        agrupamento.nome = agrupamentos[i].nome
        resultado.push(agrupamento)
    }
    
    await resultado.sort(function (a, b) {
        return (a.nalunos > b.nalunos) ? -1 : 1;
      });
    
    return resultado
            
}



Estatistica.getEstatisticasMunicipios = async function (anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo]
        sql.query(`select e.localidade, count(distinct p.codigo) as nprofessores, 
		count(distinct a.id) as nalunos, count(distinct t.id) as nturmas  
		from (select * from turmas where anoletivo=?) t, 
        escolas e, professores p, alunos a
        where t.idprofessor = p.codigo and e.cod = p.escola and a.codprofessor = p.codigo and a.turma = t.turma
        Group by e.localidade Order by nalunos DESC;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            });   
    })
}



/*
Estatistica.getEstatisticasMunicipios = async function (anoletivo){
    
}*/


module.exports = Estatistica