var sql = require('../../models/db_aplicacoes');
var Alunos = require('./alunos')
var Turmas = require('./turmas')
var md5 = require('md5');
const { bdAplicacoes } = require('../../models/conf');


var Professor = function(professor){
    this.id = professor.id;
    this.codigo = professor.codigo;
    this.nome = professor.nome;
    this.escola = professor.escola;
    this.email = professor.email;
    this.password = professor.password;
    this.confirmacao = professor.confirmacao;
    this.premium = professor.premium;
    this.validade = professor.validade;
    this.socionum = professor.socionum;
    this.projeto = professor.projeto;
};

Professor.insertProfessor = function (professor) {    
    return new Promise(function(resolve, reject) {
    var args = [professor.codigo, professor.nome, professor.escola, professor.email,
            md5(professor.password), professor.premium,
            professor.socionum, professor.projeto]
    sql.query("INSERT INTO professores (`codigo`, `nome`, `escola`, `email`, `password`," + 
                "`confirmacao`, `premium`, `validade`, `socionum`, `projeto`) VALUES (?, ?, ?, ?, ?, 1, ?, now() + INTERVAL 1 YEAR, ?, ?)", 
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

Professor.getProfessores = function () {
    return new Promise(function(resolve, reject) {
        sql.query("Select p.id, p.codigo, p.nome, esc.localidade, esc.nome as escola from professores p, Escolas esc where esc.cod = p.escola and confirmacao=1 and now()<validade", function(err, res){
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

Professor.getProfessoresCodigo = function () {
    return new Promise(function(resolve, reject) {
        sql.query("Select codigo from professores;", function(err, res){
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

Professor.getProfessorById = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where id=? and confirmacao=1 and now()<validade", id, function(err, res){
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

Professor.getProfessorByCodigo = function (codigo) {
    return new Promise(function(resolve, reject) {
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where codigo=? and confirmacao=1 and now()<validade", codigo, function(err, res){
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

Professor.getProfessorByEmail = function (email) {
    return new Promise(function(resolve, reject) {
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where email=? and confirmacao=1 and now()<validade", email, function(err, res){
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

Professor.getPassword = function (id) {
    return new Promise(function(resolve, reject) {
        sql.query("Select password from professores where codigo=? and confirmacao=1 and now()<validade", id, function(err, res){
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

Professor.getProfessoresByEscola = function (escola) {
    return new Promise(function(resolve, reject) {
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where escola=? and confirmacao=1 and now()<validade", escola, function(err, res){
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

Professor.getTurmasFromEscola = function(escola){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT t.turma, t.idprofessor, t.id, p.nome, t.anoletivo FROM ${bdAplicacoes}.turmas t, 
        ${bdAplicacoes}.professores p where p.codigo = t.idprofessor and p.escola = ? Order by t.anoletivo DESC;`, escola, function(err, res){
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

Professor.getTurmasFromEscolaAno = function(escola, anoletivo){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT t.turma, t.idprofessor, t.id, p.nome, t.anoletivo 
        FROM ${bdAplicacoes}.turmas t, ${bdAplicacoes}.professores p 
        where p.codigo = t.idprofessor and p.escola = ? and t.anoletivo=?;`, [escola, anoletivo], function(err, res){
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

Professor.alteraProfessor = function(codigo,professor){
    return new Promise(function(resolve, reject) {
        var args = [professor.nome, professor.escola, professor.email,
                professor.confirmacao, professor.premium, professor.validade,
                professor.socionum, professor.projeto, codigo]
        sql.query("UPDATE professores SET nome = ?, escola = ?, email = ?, confirmacao = ?, premium = ?," + 
                    "validade = ?, socionum = ?, projeto = ? Where codigo = ?", args, function (err, res) {
                
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

Professor.updatePassword = function(codigo, password){
    return new Promise(function(resolve, reject) {
        var args = [password, codigo]
        sql.query("UPDATE professores SET password = ? Where codigo = ?", args, function (err, res) {
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

Professor.apagar = async function(codigo){
    var turmas = await Turmas.getTurmasByProfessor(codigo)
    if(turmas.length == 0){
        var alunos = await Alunos.getAlunosByProfessor(codigo)
        if(alunos.length == 0){
            await Professor.deleteById(codigo)
            return {removed:true, message: "Professor removido com sucesso."}
        }
        else{
            return {removed:false, message: "Não pode ser eliminado, visto que possuí " + alunos.length + " alunos"}
        }
    }
    else{
        return {removed:false, message: "Não pode ser eliminado, visto que possuí " + turmas.length + " turmas"}   
    }
}

Professor.deleteById = function(codigo){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From professores where codigo = ?", codigo, function (err, res) {
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

Professor.deleteByEmail = function(email){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From professores where email = ?", email, function (err, res) {
                
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.affectedRows == 0){ resolve({removed: false, message:"O profoessor não pode ser eliminado, uma vez que possuí alunos ou turmas."})}
                    else {resolve({message: "O professor foi removido com sucesso.", removed: true})}
                }
            });   
    })
}

module.exports = Professor