const { calcrapidDef, minutenewDef } = require('../../config/configsJogos');
const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');
const Comunidades = require('../db_aplicacoes/comunidades')
const Calcrapid = require('../db_samd/calcrapid')
const Calculus = require('../db_samd/calculus')
const JogosGerais = require('../db_samd/jogosGeral')

const Jogos = module.exports

Jogos.getJogosDB = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM ${bdSAMD}.jogosdb order by jogoid`, function (err, res) {            
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

Jogos.getJogos = async function(){
    var resultado = []

    resultado.push(calcrapidDef)
    resultado.push(minutenewDef)
    
    var jogos = await Jogos.getJogosDB();
    for(var i = 0; i < jogos.length; i++){
        resultado.push(jogos[i])
    }
    return resultado;
}

Jogos.getAllJogosMunicipios = async function(dataInicio, dataFim){
    var jogos = await Jogos.getJogosDB()
    var res = []

    for(var i = 0; i < jogos.length; i++){
        var jogo = await JogosGerais.getJogoMunicipiosFreq(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.localidade == jogo[j].localidade)
            if(aux) aux.number +=jogo[j].number
            else res.push(jogo[j])
        }
    }

    // calcrapid
    var calcRapid = await Calcrapid.getTodosCalcRapidMunicipios(dataInicio, dataFim)
    for(var j = 0; j < calcRapid.length; j++){
        var aux = res.find(element => element.localidade == calcRapid[j].localidade)
        if(aux) aux.number += calcRapid[j].frequencia
        else res.push({localidade: calcRapid[j].localidade, number: calcRapid[j].frequencia})
    }
    
    // calculus
    var calculus = await Calculus.getTodosMinuteNewMunicipios(dataInicio, dataFim)
    for(var j = 0; j < calculus.length; j++){
        var aux = res.find(element => element.localidade == calculus[j].localidade)
        if(aux) aux.number += calculus[j].frequencia
        else res.push({localidade: calculus[j].localidade, number: calculus[j].frequencia})
    }

    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getAllJogosComunidade = async function(comunidade, dataInicio, dataFim){
    //var jogos = await Jogos.getJogosDB()
    var res = []
    var aux = await Jogos.getAllJogosMunicipios(dataInicio, dataFim)
    var municipiosComunidade = await Comunidades.getMunicipiosFromComunidade(comunidade)

    for(var i = 0; i < aux.length; i++){
        var localidade = aux[i].localidade
        if(municipiosComunidade.find(e => e.municipio == localidade)){
            res.push(aux[i])
        }
    }

    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getAllJogosEscolas = async function(dataInicio, dataFim, municipio){
    var jogos = await Jogos.getJogosDB()
    var res = []

    for(var i = 0; i < jogos.length; i++){
        var jogo = await JogosGerais.getJogoEscolasFreq(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim, municipio)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.cod == jogo[j].cod)
            
            if(aux) aux.number +=jogo[j].number
            else res.push(jogo[j])
        }
    }
    
    var calcRapid = await Calcrapid.getTodosCalcRapidAgrupamentos(dataInicio, dataFim, municipio)
    for(var j = 0; j < calcRapid.length; j++){
        var aux = res.find(element => element.cod == calcRapid[j].cod)
        if(aux) aux.number += calcRapid[j].frequencia
        else res.push({nome: calcRapid[j].nome, cod: calcRapid[j].cod, number: calcRapid[j].frequencia})
    }

    var calculus = await Calculus.getTodosMinuteNewAgrupamentos(municipio, dataInicio, dataFim)
    for(var j = 0; j < calculus.length; j++){
        var aux = res.find(element => element.cod == calculus[j].cod)
        if(aux) aux.number += calculus[j].frequencia
        else res.push({nome: calculus[j].nome, cod: calculus[j].cod, number: calculus[j].frequencia})
    }

    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getAllJogosProfessores = async function(dataInicio, dataFim, escola){
    var jogos = await Jogos.getJogosDB()
    var res = []
    for(var i = 0; i < jogos.length; i++){
        var jogo = await JogosGerais.getJogoProfessoresFreq(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim, escola)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.codprofessor == jogo[j].codprofessor)
            
            if(aux) aux.number +=jogo[j].number
            else res.push(jogo[j])
        }
    }

    var calcRapid = await Calcrapid.getTodosCalcRapidProfessores(dataInicio, dataFim, escola)
    for(var j = 0; j < calcRapid.length; j++){
        var aux = res.find(element => element.codprofessor == calcRapid[j].codigo)
        if(aux) aux.number += calcRapid[j].frequencia
        else res.push({nome: calcRapid[j].nome, codprofessor: calcRapid[j].codigo, number: calcRapid[j].frequencia})
    }

    var calculus = await Calculus.getTodosMinuteNewProfessores(escola, dataInicio, dataFim)
    for(var j = 0; j < calculus.length; j++){
        var aux = res.find(element => element.codprofessor == calculus[j].codigo)
        if(aux)  aux.number += calculus[j].frequencia
        else res.push({nome: calculus[j].nome, codprofessor: calculus[j].codigo, number: calculus[j].frequencia})
    }
    
    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getAllJogosTurma = async function(dataInicio, dataFim, turma, escola){
    var jogos = await Jogos.getJogosDB()
    var res = []

    for(var i = 0; i < jogos.length; i++){
        var jogo = await JogosGerais.getJogoFromTurmaFreq(dataInicio, dataFim, jogos[i].tipo, jogos[i].jogotable, turma, escola)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.idaluno == jogo[j].idaluno)
            
            if(aux) aux.count +=jogo[j].count
            else res.push(jogo[j])
        }
    }

    var calcRapid = await Calcrapid.getTodosCalcRapidTurmas(dataInicio, dataFim, escola, turma)
    for(var j = 0; j < calcRapid.length; j++){
        var aux = res.find(element => element.idaluno == calcRapid[j].idaluno)
        if(aux) aux.count += calcRapid[j].frequencia
        else res.push({numero: calcRapid[j].numero, nome: calcRapid[j].nome, codprofessor: calcRapid[j].codigo, count: calcRapid[j].frequencia})
    }

    var calculus = await Calculus.getTodosMinuteNewTurma(turma, escola, dataInicio, dataFim)
    for(var j = 0; j < calculus.length; j++){
        var aux = res.find(element => element.idaluno == calculus[j].user)
        if(aux) aux.count += calculus[j].frequencia
        else res.push({numero: calculus[j].numero, nome: calculus[j].nome, idaluno: calculus[j].user, count: calculus[j].frequencia})
    }

    
    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getJogosFromAluno = async function(user, dataInicio, dataFim){
    var jogos = await Jogos.getJogosDB()
    var res = []
    
    var alunoJogouCalculus = await Calculus.alunoJogouMinuteNew(user, dataInicio, dataFim)
    if(alunoJogouCalculus.length > 0) res.push(minutenewDef)

    var alunoJogouCalcRapid = await Calcrapid.alunoJogou(user, dataInicio, dataFim)
    if(alunoJogouCalcRapid.length > 0) res.push(calcrapidDef)

    for(var i = 0; i < jogos.length; i++){
        var jogo = jogos[i]
        var alunoJogou = await JogosGerais.alunoJogou(user, dataInicio, dataFim, jogo.jogotable, jogo.tipo)
        if(alunoJogou.length > 0) res.push(jogo)
    }

    return res;
}

Jogos.getLast10FromAluno = async function(user){
    var jogos = await Jogos.getJogosDB()
    var aux = [], res = []
    var n = 10
    
    for(var i = 0; i < jogos.length; i++){
        var jogo = await JogosGerais.getAlunoLast(jogos[i].jogotable, jogos[i].tipo, user)
        if(jogo.lastdate) {
            jogo.nome = jogos[i].jogo
            jogo.jogotable = jogos[i].jogotable
            jogo.tipo = jogos[i].tipo
            aux.push(jogo)
        }
    }

    // calcrapid
    var calcrapid = await Calcrapid.getAlunoLast(user)
    if(calcrapid.lastdate){
        calcrapid.nome = "CalcRapid"
        calcrapid.min = calcrapid.max = calcrapid.media = '---'
        aux.push(calcrapid)
    }

    // calculus
    var calculus = await Calculus.getAlunoLast(user)
    if(calculus.lastdate){
        calculus.nome = "Calculus"
        calculus.min = calculus.max = calculus.media = '---'
        aux.push(calculus)
    }

    //console.log(aux)
    if(aux.length > 0){
        await aux.sort(function(a,b){
            return b.lastdate.localeCompare(a.lastdate)
        })
    }

    for(var i = 0; i < n && i < aux.length; i++){
        var auxDate = aux[i].lastdate.split(" ")
        aux[i].lastdate = auxDate[0]
        aux[i].horario = auxDate[1]
        res.push(aux[i])
    }
    
    return res;
}


Jogos.getFrequenciaTotalAluno = async function(user){
    var jogos = await Jogos.getJogosDB()
    var frequencia = 0
    
    var aux = await Calculus.getAlunoFrequencia(user)
    if(aux) frequencia += aux.frequencia

    aux = await Calcrapid.getAlunoFrequencia(user)
    if(aux) frequencia += aux.frequencia

    for(var i = 0; i < jogos.length; i++){
        var jogo = jogos[i]
        aux = await JogosGerais.getAlunoFrequencia(user, jogo.jogotable, jogo.tipo)
        if(aux) frequencia += aux.frequencia
    }

    return frequencia;
}
