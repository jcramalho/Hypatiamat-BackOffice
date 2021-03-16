const Calculus = module.exports
const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');

// por cada municipio e todos os tipos e niveis do jogo minutenew
Calculus.getTodosMinuteNewMunicipios = async function(dataInicio, dataFim){
    var args = [dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?)) jogo, ${bdAplicacoes}.Escolas esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getTiposNiveisMinuteNewMunicipios = async function(dataInicio, dataFim, niveis, tipos){
    var args = [dataInicio, dataFim, niveis, tipos]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?) and op = ?) jogo, ${bdAplicacoes}.Escolas esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getTiposMinuteNewMunicipios = async function(dataInicio, dataFim, tipos){
    var args = [dataInicio, dataFim, tipos]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and op = ?) jogo, ${bdAplicacoes}.Escolas esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getNiveisMinuteNewMunicipios = async function(dataInicio, dataFim, niveis){
    var args = [dataInicio, dataFim, niveis]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?)) jogo, ${bdAplicacoes}.Escolas esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

// por cada municipio de uma comunidade e todos os tipos e niveis do jogo minutenew
Calculus.getTodosMinuteNewComunidade = async function(dataInicio, dataFim, comunidade){
    var args = [dataInicio, dataFim, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?)) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getTiposNiveisMinuteNewComunidade = async function(dataInicio, dataFim, niveis, tipos, comunidade){
    var args = [dataInicio, dataFim, niveis, tipos, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?) and op = ?) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getTiposMinuteNewComunidade = async function(dataInicio, dataFim, tipos, comunidade){
    var args = [dataInicio, dataFim, tipos, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and op = ?) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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

Calculus.getNiveisMinuteNewComunidade = async function(dataInicio, dataFim, niveis, comunidade){
    var args = [dataInicio, dataFim, niveis, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?)) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc
        where esc.cod = jogo.escola Group By esc.localidade;`, args, function (err, res) {            
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


// por cada agrupamento de um municipio e todos os tipos e niveis do jogo minutenew
Calculus.getTodosMinuteNewAgrupamentos = async function(municipio,dataInicio, dataFim){
    var args = [dataInicio, dataFim, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?)) jogo, (select * from ${bdAplicacoes}.Escolas where localidade = ?) esc
        where esc.cod = jogo.escola Group By esc.cod;`, args, function (err, res) {            
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

Calculus.getTiposNiveisMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, niveis, tipos){
    var args = [dataInicio, dataFim, niveis, tipos, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?) and op = ?) jogo, (select * from ${bdAplicacoes}.Escolas where localidade = ?) esc
        where esc.cod = jogo.escola Group By esc.cod;`, args, function (err, res) {            
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

Calculus.getTiposMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, tipos){
    var args = [dataInicio, dataFim, tipos, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and op = ?) jogo, (select * from ${bdAplicacoes}.Escolas where localidade = ?) esc
        where esc.cod = jogo.escola Group By esc.cod;`, args, function (err, res) {            
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

Calculus.getNiveisMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, niveis){
    var args = [dataInicio, dataFim, niveis, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?)) jogo, (select * from ${bdAplicacoes}.Escolas where localidade = ?) esc
        where esc.cod = jogo.escola Group By esc.cod;`, args, function (err, res) {            
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

// por cada professor de um agrupamento e todos os tipos e niveis do jogo minutenew
Calculus.getTodosMinuteNewProfessores = async function(escola, dataInicio, dataFim){
    var args = [dataInicio, dataFim, escola, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and escola = ?) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, (select * from ${bdAplicacoes}.professores where escola=?) prof
        where prof.escola=jogo.escola and prof.codigo = al.codprofessor and jogo.user = al.user  Group By prof.codigo;`, args, function (err, res) {            
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

Calculus.getTiposNiveisMinuteNewProfessores = async function(escola, dataInicio, dataFim, niveis, tipos){
    var args = [dataInicio, dataFim, niveis, tipos, escola, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?) and op = ? and escola=?) jogo,
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, (select * from ${bdAplicacoes}.professores where escola=?) prof
        where prof.escola=jogo.escola and prof.codigo = al.codprofessor and jogo.user = al.user  Group By prof.codigo;`, args, function (err, res) {            
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

Calculus.getTiposMinuteNewProfessores = async function(escola, dataInicio, dataFim, tipos){
    var args = [dataInicio, dataFim, tipos, escola, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and op = ? and escola =?) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, (select * from ${bdAplicacoes}.professores where escola=?) prof
        where prof.escola=jogo.escola and prof.codigo = al.codprofessor and jogo.user = al.user  Group By prof.codigo;`, args, function (err, res) {            
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

Calculus.getNiveisMinuteNewProfessores = async function(escola, dataInicio, dataFim, niveis){
    var args = [dataInicio, dataFim, niveis, escola, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and nivel in (?) and escola = ?) jogo,
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, (select * from ${bdAplicacoes}.professores where escola=?) prof
        where prof.escola=jogo.escola and prof.codigo = al.codprofessor and jogo.user = al.user  Group By prof.codigo;`, args, function (err, res) {            
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

// por cada aluno de uma turma e todos os tipos e niveis do jogo minutenew
Calculus.getTodosMinuteNewTurma = async function(turma, escola, dataInicio, dataFim){
    var args = [dataInicio, dataFim, escola, turma, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.user, al.numero, al.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and escola = ? and turma=?) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al
        where jogo.user = al.user Group By jogo.user Order by al.numero;`, args, function (err, res) {            
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

Calculus.getTiposNiveisMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, niveis, tipo){
    var args = [dataInicio, dataFim, escola, turma, niveis, tipo, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.user, al.numero, al.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and escola = ? and turma=? and nivel in (?) and op=?) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al
        where jogo.user = al.user Group By jogo.user Order by al.numero;`, args, function (err, res) {            
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

Calculus.getNiveisMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, niveis){
    var args = [dataInicio, dataFim, escola, turma, niveis, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.user, al.numero, al.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and escola = ? and turma=? and nivel in (?)) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al
        where jogo.user = al.user Group By jogo.user Order by al.numero;`, args, function (err, res) {            
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

Calculus.getTiposMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, tipo){
    var args = [dataInicio, dataFim, escola, turma, tipo, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.user, al.numero, al.nome, sum(jogo.numcertas) as numcertas, sum(jogo.numerradas) as numerradas, sum(jogo.pontos) as pontos, count(jogo.pontos) as frequencia
		from (select * from ${bdSAMD}.minutenew where (data between ? and ?) and escola = ? and turma=? and op = ?) jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al
        where jogo.user = al.user Group By jogo.user Order by al.numero;`, args, function (err, res) {            
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

// última vez que o aluno jogou
Calculus.getAlunoLast = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`select max(concat(data, ' ', horario)) as lastdate from ${bdSAMD}.minutenew where user=?;`, user, function(err, res){
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