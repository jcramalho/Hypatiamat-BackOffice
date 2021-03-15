var sql = require('../../models/db_aplicacoes');
var Professores = require('./professor')
var Alunos = require('./alunos')
var Jogos = require('./../db_samd/jogos');
const { bdSAMD, bdAplicacoes } = require('../../models/conf');


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
    sql.query("INSERT INTO Escolas (`nome`, `localidade`, `distrito`, `pais`, `cod`)"+ 
                " VALUES (?, ?, ?, ?, ?)", 
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
};

Escola.getEscolas = function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select * from Escolas Order by localidade", function(err, res){
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
        sql.query("Select * from Escolas where cod=?", cod, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
               if(res.length != 0) resolve(res[0])
               else resolve(undefined)
            }
        })
    })
}

Escola.getEscolasByLocalidade = function (localidade) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from Escolas where localidade=?", localidade, function(err, res){
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
        sql.query("Select * from Escolas where distrito=?", distrito, function(err, res){
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
        sql.query("Select * from Escolas where pais=?", pais, function(err, res){
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

Escola.getTurmasFromEscola = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select t.* from Escolas esc, turmas t, professores p where esc.cod=? and esc.cod = p.escola and t.idprofessor=p.cod", id, function(err, res){
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


Escola.updateEscola = function(codigo, escola){
    //nome`, `localidade`, `distrito`, `pais`, `cod`
    return new Promise(function(resolve, reject) {
        var args = [escola.nome, escola.localidade, escola.distrito, escola.pais, codigo]
        sql.query("Update Escolas Set nome = ?, localidade = ?, distrito = ?, pais = ? where cod = ?", args, function (err, res) {
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


Escola.apagar = async function(cod){
    var alunos = await Alunos.getAlunosFromEscola(cod)
    var professores = await Professores.getProfessoresByEscola(cod)
    if(alunos.length == 0 && professores.length == 0){
        return await Escola.deleteEscola(cod)
    }
    else{
        return {removed: false, message:"A escola não pode ser eliminada, dado que existem alunos ou professores que fazem parte da escola."}
    }
}


Escola.deleteEscola = function (cod){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From Escolas where cod = ?", cod, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.affectedRows == 0){ resolve({removed: false, message:"A escola não pode ser eliminada, dado que existem alunos ou professores que fazem parte da escola."})}
                    else {resolve({message: "A escola foi removida com sucesso.", removed: true})}
                }
            });   
    })    
}

Escola.getMunicipios = async function(){
    return new Promise(function(resolve, reject) {
        sql.query(`select distinct localidade from ${bdAplicacoes}.Escolas Order by localidade;`, function (err, res) {
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

module.exports = Escola
