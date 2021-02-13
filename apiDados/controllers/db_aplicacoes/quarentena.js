var sql = require('../../models/db_aplicacoes');
var md5 = require('md5')
var Professor = require('../db_aplicacoes/professor')

var Quarentena = function(professor){
    this.id = professor.id;
    this.codigo = professor.codigo;
    this.nome = professor.nome;
    this.escola = professor.escola;
    this.email = professor.email;
    this.password = professor.password;
};

Quarentena.insertPedido = function (quarentena) {    
    return new Promise(function(resolve, reject) {
    var args = [quarentena.codigo, quarentena.nome, quarentena.escola, quarentena.email,
            md5(quarentena.password)]
    sql.query("INSERT INTO quarentena (`codigo`, `nome`, `escola`, `email`, `password`) VALUES (?, ?, ?, ?, ?)", args, function (err, res) {
            
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

Quarentena.getPedidos = function () {
    return new Promise(function(resolve, reject) {
        sql.query("Select id, codigo, nome, (select nome from Escolas where cod=escola) as escola, email from quarentena", function(err, res){
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

Quarentena.getPedido = function (id){
    return new Promise(function(resolve, reject) {
        sql.query("Select codigo, nome, escola, email, password from quarentena where id=?", id, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if (res.length != 0) resolve(res)
                else resolve(undefined)
            }
        })
    })
}

Quarentena.aceitaPedido = async function(id) {
    var aux = await Quarentena.getPedido(id);
    //await Quarentena.deletePedido(id)
    console.log(aux.codigo)
    let professor ={
        codigo : aux.codigo,
        nome : aux.nome,
        escola : aux.escola,
        email : aux.email,
        password: aux.password,
        confirmacao : 1,
        premium : 1,
        socionum : 0,
        projeto : 0
    }  
    console.log(professor)
    var result
    //var result = await Professor.insertProfessor(professor)
    return result 
}

Quarentena.deletePedido = function(id){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From quarentena where id = ?", id, function (err, res) {
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




module.exports = Quarentena