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


Escola.updateEscola = function(id, escola){
    //nome`, `localidade`, `distrito`, `pais`, `cod`
    return new Promise(function(resolve, reject) {
        var args = [escola.nome, escola.localidade, escola.distrito, escola.pais, id]
        sql.query("Update Escolas Set nome = ?, localidade = ?, distrito = ?, pais = ? where id = ?", args, function (err, res) {
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


Escola.getJogosMunicipio = async function(jogoTable, jogoTipo, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim]
        sql.query(`SELECT esc.localidade, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		FROM ${bdSAMD}.${jogoTable} jogo, ${bdAplicacoes}.Escolas esc 
        WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola=esc.cod and (jogo.data BETWEEN ? and ?) Group by esc.localidade Order by esc.localidade;`, args, function (err, res) {
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

Escola.getAllJogosMunicipios = async function(dataInicio, dataFim){
    var jogos = await Jogos.getJogos()
    var res = await Escola.getJogosMunicipio(jogos[0].jogotable, jogos[0].tipo, dataInicio, dataFim)
    for(var i = 1; i < jogos.length; i++){
        var jogo = await Escola.getJogosMunicipio(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.localidade == jogo[j].localidade)
            
            if(aux){
                aux.number +=jogo[j].number
            }
            else{
                res.push(jogo[j])
            }
            
        }
    }
    
    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
      });

    return res;
}

Escola.getJogosEscolas = async function(jogoTable, jogoTipo, dataInicio, dataFim, municipio){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, municipio, dataInicio, dataFim]
        sql.query(`SELECT esc.cod, esc.nome, ROUND(min(jogo.pontuacao),0) as min, Round(max(jogo.pontuacao), 0) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		FROM ${bdSAMD}.${jogoTable} jogo, ${bdAplicacoes}.Escolas esc 
        WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola=esc.cod and esc.localidade = ? and (jogo.data BETWEEN ? and ?) Group by jogo.idescola Order by number DESC;`, args, function (err, res) {
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

Escola.getAllJogosEscolas = async function(dataInicio, dataFim, municipio){
    var jogos = await Jogos.getJogos()
    var res = await Escola.getJogosEscolas(jogos[0].jogotable, jogos[0].tipo, dataInicio, dataFim, municipio)
    for(var i = 1; i < jogos.length; i++){
        var jogo = await Escola.getJogosEscolas(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim, municipio)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.cod == jogo[j].cod)
            
            if(aux){
                aux.number +=jogo[j].number
            }
            else{
                res.push(jogo[j])
            }
            
        }
    }
    
    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
      });

    return res;
}

 
Escola.getJogosProfessores = async function(jogoTable, jogoTipo, dataInicio, dataFim, escola){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, escola, dataInicio, dataFim]
        sql.query(`SELECT al.codprofessor, (select nome from professores where codigo = al.codprofessor) as nome, min(jogo.pontuacao) as min, 
                    max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		FROM ${bdSAMD}.${jogoTable} jogo, ${bdAplicacoes}.alunos al 
        WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola = ? and al.user = jogo.idaluno and(jogo.data BETWEEN ? and ?) 
        Group by al.codprofessor Order by al.codprofessor;`, args, function (err, res) {
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

Escola.getAllJogosProfessores = async function(dataInicio, dataFim, escola){
    var jogos = await Jogos.getJogos()
    var res = []
    for(var i = 0; i < jogos.length; i++){
        var jogo = await Escola.getJogosProfessores(jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim, escola)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.codprofessor == jogo[j].codprofessor)
            
            if(aux){
                aux.number +=jogo[j].number
            }
            else{
                res.push(jogo[j])
            }
            
        }
    }
    
    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
      });

    return res;
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

module.exports = Escola
