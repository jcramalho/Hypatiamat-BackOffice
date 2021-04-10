var sql = require('../../models/db_testeconhecimentos');
const Campeonatos_Certificados = module.exports

Campeonatos_Certificados.insertCampeonato_Certificado = function(campeonato, jogo, posicao, nomeFicheiro){
    return new Promise(function(resolve, reject) {
        var args = [campeonato, jogo, posicao, nomeFicheiro]
        sql.query("INSERT INTO certificados (`campeonatoID`, `jogo`, `posicao`, `ficheiro`)"+ 
                    " VALUES (?, ?, ?, ?)", 
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

Campeonatos_Certificados.getCertificadosFromCampeonato = function(campeonato, jogo){
    return new Promise(function(resolve, reject) {
        var args = [campeonato, jogo]
        sql.query("Select distinct posicao, ficheiro from certificados where campeonatoID=? and jogo=?", 
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

Campeonatos_Certificados.getCertificado = function(campeonato, jogo, posicao){
    return new Promise(function(resolve, reject) {
        var args = [campeonato, jogo, posicao]
        sql.query("Select id, ficheiro from certificados where campeonatoID=? and jogo=? and posicao=?", 
                    args, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.length == 0) resolve(undefined)
                    else resolve(res[0]);
                }
        });   
    })
}

Campeonatos_Certificados.updateCertificado = function(id, nomeFicheiro){
    return new Promise(function(resolve, reject) {
        var args = [nomeFicheiro, id]
        sql.query("Update certificados Set ficheiro=? where id=?", 
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