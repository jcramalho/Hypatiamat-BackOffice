const Cromos = module.exports
const Apps = require('./apps')
const Jogos = require('../db_samd/jogos')
const Campeonatos = require('./campeonatos')
const CromosAlunos = require('./cromos_alunos')
const sql = require('../../models/db_testeconhecimentos');
const anoletivo = require('../../config/confs').anoletivo
const maxFreq = 6
var dataInicioAno = require('../../config/confs').dataInicio1
var dataFimAno = require('../../config/confs').dataFim1


Cromos.insertCromo = function(cromo){
    var args = [cromo.numero, cromo.nome, cromo.descricao, cromo.imagem, 
                cromo.campeonatos, cromo.apps, cromo.jogos, cromo.dias,
                cromo.diferentes, cromo.estrelas, cromo.anoletivo]
    return new Promise(function(resolve, reject) {
        sql.query("INSERT INTO cromosdb (`numero`, `nome`, `descricao`, `imagem`, `campeonatos`, `apps`, `jogos`, `dias`, `diferentes`, `estrelas`, `anoletivo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
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
}

Cromos.updateCromo = function(id, cromo){
    var args = [cromo.numero, cromo.nome, cromo.descricao, cromo.imagem, 
                cromo.campeonatos, cromo.apps, cromo.jogos, cromo.dias,
                cromo.diferentes, cromo.estrelas, cromo.anoletivo, id]
    return new Promise(function(resolve, reject) {
        sql.query("Update cromosdb Set numero=?, nome=?, descricao=?, imagem=?, campeonatos=?, apps=?, jogos=?, dias=?, diferentes=?, estrelas=?, anoletivo=? where id=?", 
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
}


Cromos.getCromosDB= function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM cromosdb where anoletivo=? Order by numero;`, anoletivo, function(err, res){
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

Cromos.getCromosDB2 = function(anoletivoSel){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM cromosdb where anoletivo=? Order by numero;`, anoletivoSel, function(err, res){
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

Cromos.getCromo = function(id){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM cromosdb where id=?;`, id, function(err, res){
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

Cromos.getAppsCromos = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT id, numero, nome, descricao, imagem, apps, dias, diferentes, estrelas FROM cromosdb where anoletivo=? and not(isnull(apps));`, anoletivo, function(err, res){
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

Cromos.getJogosCromos = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT id, numero, nome, descricao, imagem, jogos, dias, diferentes, estrelas FROM cromosdb where anoletivo=? and not(isnull(jogos));`, anoletivo, function(err, res){
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

Cromos.getCampeonatosCromos = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT id, numero, nome, descricao, imagem, campeonatos, estrelas FROM cromosdb where anoletivo=? and not(isnull(campeonatos));`, anoletivo, function(err, res){
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

Cromos.getCromosAppsCompletadosFromAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT cal.* 
                    FROM (select * from cromosdb where not(isnull(apps)) ) cdb, (select * from cromos_alunos where user=? and anoletivo=?) cal 
                    where cdb.id = cal.idcromo;`, [user, anoletivo], function(err, res){
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

Cromos.getProxDias = function(data, ndias){
    var date = new Date(data)
    var res = []
    for(var i = 1; i <= ndias; i++){
        var aux = new Date(date.getTime() + i * 86400000)
        res.push(aux.toISOString().split('T')[0])
    }
    return res
}

Cromos.diasConsecutivosFreqApps = async function(infoDias, ndias, freq){
    var res = {freq: 0, lastdate: ''}
    for(var i = 0; res.freq < maxFreq && i < infoDias.length; i++){
        var infoDia = infoDias[i]
        if(infoDia.ncertas >= freq){
            res.lastdate = infoDia.lastdate
            var aux = await this.getProxDias(infoDias[i].lastdate, ndias-1)
            var teste = true
            for(var j = 0; teste && j < aux.length; j++){
                var infoDia2 = infoDias.find(e => e.lastdate == aux[j])
                
                if( !(infoDia2 && infoDia2.ncertas >= freq) ) teste = false
                else {/*console.log(infoDia.lastdate);console.log(infoDia2);*/ i = infoDias.indexOf(infoDia2); res.lastdate = infoDia2.lastdate}
            }

            if(teste) res.freq++;
        }  
    }
    return res
}

Cromos.checkCromoAppAluno = async function(cromo, infoDias, infoGeral){
    if(cromo.dias){
        // para testar, depois colocar dias normais
        var res = await this.diasConsecutivosFreqApps(infoDias, cromo.dias, cromo.apps)
        if(res.freq > 0){
            res.idcromo = cromo.id
            res.numero = cromo.numero
            return res
        }
    }
    else if(cromo.diferentes){
        if(infoGeral.ncertas >= cromo.apps && infoGeral.napps >= cromo.diferentes){
            return {idcromo: cromo.id, numero: cromo.numero}
        }
    }
    
    return undefined
}

Cromos.getCromosAppsFromAluno = function(user){   
        /*  
        var appsCromos = await this.getAppsCromos()
        var appsCromosCompletados = await this.getCromosAppsCompletadosFromAluno(user)
        var infoDias = await Apps.getFreqAppsFromAlunoPorDia(user)
        var infoGeral = await Apps.getInfoGeralFromAluno(user)
        //console.log(infoGeral)
        
        */
        
        var appsCromos = this.getAppsCromos()
        var appsCromosCompletados = this.getCromosAppsCompletadosFromAluno(user)
        var infoDias = Apps.getFreqAppsFromAlunoPorDia(user)
        var infoGeral = Apps.getInfoGeralFromAluno(user)

        return Promise.all([appsCromos, appsCromosCompletados, infoDias, infoGeral])
                .then(async values => {
                    var res = []
                    var appsCromos = values[0]
                    var appsCromosCompletados = values[1]
                    var infoDias = values[2]
                    var infoGeral = values[3]
                    for(var i = 0; i < appsCromos.length; i++){
                        var cromo = appsCromos[i]
                        var cromoGanho = appsCromosCompletados.find(e => e.idcromo == cromo.id)
                        if(cromoGanho){
                            if(cromo.estrelas && cromoGanho.frequencia < maxFreq){
                                var infoDiasAux = infoDias.filter(e => new Date(e.lastdate) > new Date(cromoGanho.lastdate))
                                if(infoDiasAux.length > 0) {
                                    var resultCromo = await this.checkCromoAppAluno(cromo, infoDiasAux, infoGeral)
                                    if(resultCromo && resultCromo.freq) {
                                        var frequencia = resultCromo.freq + cromoGanho.frequencia
                                        if(frequencia > maxFreq) {frequencia = maxFreq; resultCromo.freq = resultCromo.freq - (frequencia - maxFreq)}
                                        CromosAlunos.updateCromoFreq(cromoGanho.id, frequencia)
                                        res.push(resultCromo)
                                    }
                                }
                            }
                        }
                        else{
                            var resultCromo = await this.checkCromoAppAluno(cromo, infoDias, infoGeral)
                            if(resultCromo) {
                                if(resultCromo.freq) CromosAlunos.insertComFreq({user: user, idcromo: resultCromo.idcromo, oldfrequencia:0, 
                                                                          frequencia: resultCromo.freq, lastdate: resultCromo.lastdate, virado: false, anoletivo: anoletivo})
                                else CromosAlunos.insertSemFreq({user: user, idcromo: resultCromo.idcromo, virado: false, anoletivo: anoletivo})
                                res.push(resultCromo)
                            }
                        }
                    }
                    return res
                })
                .catch(erro => { console.log(erro);})
        
}

Cromos.diasConsecutivosFreqJogos = async function(infoDias, ndias, freq){
    var res = {freq: 0, data: ''}
    for(var i = 0; res.freq < maxFreq && i < infoDias.length; i++){
        var infoDia = infoDias[i]
        if(infoDia.frequencia >= freq){
            res.data = infoDia.data
            var aux = await this.getProxDias(infoDias[i].data, ndias-1)
            var teste = true
            for(var j = 0; teste && j < aux.length; j++){
                var infoDia2 = infoDias.find(e => e.data == aux[j])
                
                if( !(infoDia2 && infoDia2.frequencia >= freq) ) teste = false
                else {/*console.log(infoDia.lastdate);console.log(infoDia2);*/ i = infoDias.indexOf(infoDia2); res.data = infoDia2.data}
            }

            if(teste) res.freq++;
        }  
    }
    return res
}

Cromos.checkCromoJogoAluno = async function(cromo, infoDias, infoGeral){
    if(cromo.dias){
        // para testar, depois colocar dias normais
        var res = await this.diasConsecutivosFreqJogos(infoDias, cromo.dias, cromo.jogos)
        if(res.freq > 0){
            res.idcromo = cromo.id
            res.nome = cromo.nome
            res.numero = cromo.numero
            return res
        }
    }
    else if(cromo.diferentes){
        if(infoGeral.frequencia >= cromo.jogos && infoGeral.njogos >= cromo.diferentes){
            return {idcromo: cromo.id, nome: cromo.nome, numero: cromo.numero}
        }
    }
    
    return undefined
}


Cromos.getCromosJogosFromAluno = function(user){
    var jogosCromos = this.getJogosCromos()
    var jogosCromosCompletados = CromosAlunos.getCromosJogosCompletadosFromAluno(user) 
    var infoDias = Jogos.getAllJogosPorDiaAluno(user)
    var infoGeral = Jogos.getFrequenciaTotalAluno2(user)
    
    return Promise.all([jogosCromos, infoDias, infoGeral, jogosCromosCompletados])
            .then(async values =>{
                var jogosCromos = values[0]
                var infoDias = values[1]
                var infoGeral = values[2]
                var jogosCromosCompletados = values[3]
                var res = []

                for(var i = 0; i < jogosCromos.length; i++){
                    var cromo = jogosCromos[i]
                    var cromoGanho = jogosCromosCompletados.find(e => e.idcromo == cromo.id)
                    if(cromoGanho){
                        if(cromo.estrelas && cromoGanho.frequencia < maxFreq){
                            var infoDiasAux = infoDias.filter(e => new Date(e.lastdate) > new Date(cromoGanho.lastdate))
                            if(infoDiasAux.length > 0) {
                                var resultCromo = await this.checkCromoJogoAluno(cromo, infoDiasAux, infoGeral)
                                if(resultCromo && resultCromo.freq) {
                                    var frequencia = resultCromo.freq + cromoGanho.frequencia
                                    if(frequencia > maxFreq) {frequencia = maxFreq; resultCromo.freq = resultCromo.freq - (frequencia - maxFreq)}
                                    CromosAlunos.updateCromoFreq(cromoGanho.id, frequencia)
                                    res.push(resultCromo)
                                }
                            }
                        }
                    }
                    else{
                        var resultCromo = await this.checkCromoJogoAluno(cromo, infoDias, infoGeral)
                        if(resultCromo){
                            if(resultCromo.freq) CromosAlunos.insertComFreq({user: user, idcromo: resultCromo.idcromo, oldfrequencia:0, 
                                frequencia: resultCromo.freq, lastdate: resultCromo.data, virado: false, anoletivo: anoletivo})
                            else CromosAlunos.insertSemFreq({user: user, idcromo: resultCromo.idcromo, virado: false, anoletivo: anoletivo})
                            res.push(resultCromo)
                        }
                    }
                }

                return res
            })
            .catch(erro => {console.log(erro); reject(erro)})
    
}

Cromos.getCromosCampeonatosFromAluno = function(user){
    var campeonatosCromos = this.getCampeonatosCromos(user)
    var campeonatosParticipou = Campeonatos.getCampeonatosAlunoParticipouAnoLetivo(user)
    var cromosCampeonatosCompletados = CromosAlunos.getCromosCampeonatosCompletadosFromAluno(user)
    var result = []

    return Promise.all([campeonatosCromos, campeonatosParticipou, cromosCampeonatosCompletados])
        .then(dados => {
            var campeonatosCromos = dados[0]
            var campeonatosParticipou = dados[1]
            var cromosCampeonatosCompletados = dados[2]
            if(cromosCampeonatosCompletados.length == campeonatosCromos.length) return []

            for(var i = 0; i < campeonatosCromos.length; i++){
                var cromo = campeonatosCromos[i]
                var cromoGanho = cromosCampeonatosCompletados.find(e => e.idcromo == cromo.id)
                if(!cromoGanho && campeonatosParticipou.length >= cromo.campeonatos){
                    CromosAlunos.insertSemFreq({user: user, idcromo: cromo.id, virado: false, anoletivo: anoletivo})
                    result.push(cromo)
                }
            }
            return result
        })
        .catch(erro => {console.log(erro); reject(erro)})
}

Cromos.getNovosCromos = function(user){
    var appsCromos = this.getCromosAppsFromAluno(user)
    var jogosCromos = this.getCromosJogosFromAluno(user)
    var campeonatosCromos = this.getCromosCampeonatosFromAluno(user)
    return Promise.all([appsCromos, jogosCromos, campeonatosCromos])
                  .then(values => {
                      
                    return {novosCromos: (values[0].concat(values[1])).concat(values[2])}
                  })
                  .catch(erro => {console.log(erro); reject(erro)})    
}

Cromos.deleteCromo = async function(id){
    sql.query("Delete From cromosdb where id = ?", id, function (err, res) {
        if(err) {
            console.log("error: ", err);
            reject(err);
        }
        else{
            return true
        }
    });   
}

Cromos.apagarCromo = async function(id){
    var teste = await CromosAlunos.isCromoCompletado(id)
    if(teste){
        return {
            removed: false,
            message: "O cromo já foi conquistado por alguns alunos!"
        }
    }
    else{
        await this.deleteCromo(id)
        return{
            removed: true,
            message: "Cromo removido com sucesso."
        }
    }
}