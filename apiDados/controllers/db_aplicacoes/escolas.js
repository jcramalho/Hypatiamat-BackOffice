var sql = require('../../models/db_aplicacoes');
var Professores = require('./professor')
var Alunos = require('./alunos')


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
    sql.query("INSERT INTO escolas (`nome`, `localidade`, `distrito`, `pais`, `cod`)"+ 
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
        sql.query("Select * from escolas Order by localidade", function(err, res){
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


Escola.getEscola = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select * from escolas where cod=?", id, function(err, res){
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

Escola.getTurmasFromEscola = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select t.* from escolas esc, turmas t, professores p where esc.cod=? and esc.cod = p.escola and t.idprofessor=p.cod", id, function(err, res){
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
        var args = [escola.nome, escola.localidade, escola.distrito, escola.pais, escola.cod, id]
        sql.query("Update escolas Set nome = ?, localidade = ?, distrito = ?, pais = ?, cod = ? where id = ?", args, function (err, res) {
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


Escola.getJogosMunicipio = async function(jogoTable, jogoTipo, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, dataInicio, dataFim]
        sql.query("SELECT esc.localidade, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number " +
		"FROM hypat_samd." + jogoTable + " jogo, hypat_aplicacoes.escolas esc " +
        "WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola=esc.cod and (jogo.data BETWEEN ? and ?) Group by esc.localidade Order by esc.localidade;", args, function (err, res) {
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

Escola.getJogosEscolas = async function(jogoTable, jogoTipo, dataInicio, dataFim, municipio){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, municipio, dataInicio, dataFim]
        sql.query("SELECT esc.cod, esc.nome, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number " +
		"FROM hypat_samd." + jogoTable + " jogo, hypat_aplicacoes.escolas esc " +
        "WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola=esc.cod and esc.localidade = ? and (jogo.data BETWEEN ? and ?) Group by jogo.idescola Order by esc.nome;", args, function (err, res) {
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

 
Escola.getJogosProfessores = async function(jogoTable, jogoTipo, dataInicio, dataFim, escola){
    return new Promise(function(resolve, reject) {
        var args = [jogoTipo, escola, dataInicio, dataFim]
        sql.query("SELECT al.codprofessor, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number " +
		"FROM hypat_samd." + jogoTable + " jogo, hypat_aplicacoes.alunos al " +
        "WHERE jogo.turma!='99' AND jogo.tipo=? AND jogo.idescola = ? and al.user = jogo.idaluno and(jogo.data BETWEEN ? and ?) Group by al.codprofessor Order by al.codprofessor;", args, function (err, res) {
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


Escola.apagar = async function(cod){
    var alunos = await Alunos.getAlunosFromEscola(cod)
    var professores = await Professores.getProfessoresByEscola(cod)
    console.log(alunos.length)
    console.log(professores.length)
    if(alunos.length == 0 && professores.length == 0){
        return await Escola.deleteEscola(cod)
    }
    else{
        return {removed: false, message:"A escola não pode ser eliminada, dado que existem alunos ou professores que fazem parte da escola."}
    }
}


Escola.deleteEscola = function (cod){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From escolas where cod = ?", cod, function (err, res) {
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