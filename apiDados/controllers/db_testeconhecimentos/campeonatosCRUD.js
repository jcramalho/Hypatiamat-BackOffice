const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');

const Campeonatos = module.exports

Campeonatos.insertCampeonato = function(campeonato){
    return new Promise(function(resolve, reject) {
        var args = [campeonato.cod, campeonato.di, campeonato.horai, campeonato.df, campeonato.horaf, campeonato.frase1,
                    campeonato.frase2, campeonato.municipio, campeonato.comunidade, campeonato.descricaoBackOffice]
        sql.query("Insert into campeonatosID (`cod`, `datains`, `di`, `horai`, `df`, `horaf`, `frase1`, `frase2`, `municipio`, `comunidade`, `descricaoBackOffice`) "+
        "values (?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?);", args, function(err, res){
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

Campeonatos.getCampeonato = function(cod){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT * FROM campeonatosID where cod=?;`, cod, function(err, res){
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

Campeonatos.updateCampeonato = function(cod, campeonato){
    return new Promise(function(resolve, reject) {
        var args = [campeonato.datains, campeonato.di, campeonato.df, campeonato.horai, 
                campeonato.horaf, campeonato.frase1, campeonato.frase2, null, null, 
                campeonato.descricaoBackOffice, cod]
        if(campeonato.municipio){
            if(campeonato.comunidade){
                var args = [campeonato.datains, campeonato.di, campeonato.df, campeonato.horai, 
                    campeonato.horaf, campeonato.frase1, campeonato.frase2, campeonato.municipio, 
                    campeonato.comunidade, campeonato.descricaoBackOffice, cod]
            }
            else{
                var args = [campeonato.datains, campeonato.di, campeonato.df, campeonato.horai, 
                    campeonato.horaf, campeonato.frase1, campeonato.frase2, campeonato.municipio, 
                    null, campeonato.descricaoBackOffice, cod]
            }
        }
        else if(campeonato.comunidade){
            args = [campeonato.datains, campeonato.di, campeonato.df, campeonato.horai, 
                campeonato.horaf, campeonato.frase1, campeonato.frase2, null, 
                campeonato.comunidade, campeonato.descricaoBackOffice, cod]
        }
        sql.query(`Update campeonatosID Set datains=?, di=?, df=?, horai=?, horaf=?, frase1=?, frase2=?,
                     municipio=?, comunidade=?, descricaoBackOffice=? where cod=?;`, args, function(err, res){
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

Campeonatos.alunosInscritos = async function(cod){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT count(*) as alunos FROM campeonatos where campeonatoID=?;`, cod, function(err, res){
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

Campeonatos.deleteCampeonato = async function(cod){
    return new Promise(function(resolve, reject) {
        sql.query(`Delete FROM campeonatosID where cod=?;`, cod, function(err, res){
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

Campeonatos.apagarCampeonato = async function(cod){
    var alunosInscritos = await Campeonatos.alunosInscritos(cod)
    if(alunosInscritos.alunos == 0){
        await Campeonatos.deleteCampeonato(cod)
        return {deleted: true, message: "Campeonato apagado com sucesso."}
    }
    else{
        return {deleted: false, message: "Não é possível apagar o campeonato, pois existem alunos que já se inscreveram/jogaram no campeonato."}
    }
    
}