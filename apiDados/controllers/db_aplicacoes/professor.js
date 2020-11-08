var sql = require('../../models/db_aplicacoes');

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
            professor.password, professor.confirmacao, professor.premium, professor.validade,
            professor.socionum, professor.projeto]
    sql.query("INSERT INTO professores (`codigo`, `nome`, `escola`, `email`, `password`," + 
                "`confirmacao`, `premium`, `validade`, `socionum`, `projeto`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
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
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores", function(err, res){
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
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where codigo=?", id, function(err, res){
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
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where email=?", email, function(err, res){
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
        sql.query("Select password from professores where codigo=?", id, function(err, res){
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
        sql.query("Select id, codigo, nome, escola, email, confirmacao, premium, validade, socionum, projeto from professores where escola=?", escola, function(err, res){
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
                    console.log(res.insertId);
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
                    console.log(res.insertId);
                    resolve(res);
                }
            });   
        })
}

Professor.deleteById = function(codigo){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From professores where codigo = ?", codigo, function (err, res) {
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

Professor.deleteByEmail = function(email){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From professores where email = ?", email, function (err, res) {
                
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

module.exports = Professor