var sql = require('../../models/db_aplicacoes');

var Escola = function(escola){
    this.id = escola.id;
    this.nome = escola.nome
    this.localidade = escola.localidade;
    this.distrito = escola.distrito;
    this.pais = escola.pais
    this.cod = escola.cod
};

Escola.insertEscola = function (escola) {    
    return new Promise(function(resolve, reject) {
    var args = [escola.nome, escola.localidade, escola.distrito, escola.pais, escola.cod]
    sql.query("INSERT INTO escolas (nome`, `localidade`, `distrito`, `pais`, `cod`)"+ 
                " VALUES (?, ?, ?, ?, ?)", 
                args, function (err, res) {
            
            if(err) {
                console.log("error: ", err);
                reject(err);
            }
            else{
                console.log(res.insertId);
                resolve(res);
            }
        });   
    })       
};

Escola.getEscolas = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas", function(err, res){
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


Escola.getEscola = function (cod) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas where cod=?", cod, function(err, res){
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

Escola.getEscolasByLocalidade = function (localidade) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas where localidade=?", localidade, function(err, res){
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

Escola.getEscolasByDistrito = function (distrito) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas where distrito=?", distrito, function(err, res){
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

Escola.getEscolasByPais = function (pais) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas where pais=?", pais, function(err, res){
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


Escola.updateEscola = function(escola){

}

Escola.deleteEscola = function (cod){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From escolas where cod = ?", cod, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    console.log(res.insertId);
                    resolve(res);
                }
            });   
    })    
}

module.exports = Escola