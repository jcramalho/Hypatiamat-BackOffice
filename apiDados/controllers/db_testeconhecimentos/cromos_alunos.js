const Cromos = module.exports
const sql = require('../../models/db_testeconhecimentos');
const anoletivo = require('../../config/confs').anoletivo

Cromos.insertComFreq = function(cromo){
    var args = [cromo.user, cromo.idcromo, cromo.oldfrequencia, cromo.frequencia, 
                cromo.lastdate, cromo.virado, cromo.anoletivo]
    return new Promise(function(resolve, reject) {
        sql.query("INSERT INTO cromos_alunos (`user`, `idcromo`, `oldfrequencia`, `frequencia`, `lastdate`, `virado`, `anoletivo`) VALUES (?, ?, ?, ?, ?, ?, ?)", 
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

Cromos.insertSemFreq = function(cromo){
    var args = [cromo.user, cromo.idcromo, cromo.virado, cromo.anoletivo]
    return new Promise(function(resolve, reject) {
        sql.query("INSERT INTO cromos_alunos (`user`, `idcromo`, `lastdate`, `virado`, `anoletivo`) VALUES (?, ?, now(), ?, ?)", 
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

Cromos.getCromosJogosCompletadosFromAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT cal.* 
                    FROM (select * from cromosdb where not(isnull(jogos)) ) cdb, (select * from cromos_alunos where user=? and anoletivo=?) cal 
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

Cromos.getCromosCampeonatosCompletadosFromAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT cal.* 
                    FROM (select * from cromosdb where not(isnull(campeonatos))) cdb, (select * from cromos_alunos where user=? and anoletivo=?) cal 
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

Cromos.getCromosFromUser= function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * 
                    FROM cromos_alunos
                    where user = ? and anoletivo=?;`, [user, anoletivo], function(err, res){
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