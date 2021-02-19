const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');

var Jogos = function(jogos){
    this.id = jogos.id;
    this.jogoid = jogos.jogoid;
    this.jogo = jogos.jogo
    this.jogotable = jogos.jogotable
    this.tipo = jogos.tipo
};

Jogos.getJogosDB = function(){
return new Promise(function(resolve, reject) {
    sql.query(`SELECT * FROM ${bdSAMD}.jogosdb order by jogoid`, function (err, res) {            
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

Jogos.getJogos = async function(){
    var resultado = []
    var calcrapid = {jogo: 'Calcrapid', jogotable:'calcRapidHypatia', tipos:["Todos", "1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"]}
    var minutenew = {jogo: 'Calculus', jogotable: 'minutenew', 
                        niveis:["1", "2", "3", "4", "5"], 
                        tipos:["Todos", "1 – Adição", "2 – Subtração", "3 – Multiplicação", "4 – Divisão", "12 – Adição e subtração"]}
    resultado.push(calcrapid)
    resultado.push(minutenew)
    var jogos = await Jogos.getJogosDB();
    for(var i = 0; i < jogos.length; i++){
        resultado.push(jogos[i])
    }
    return resultado;
}

// por cada município e todos os tipos do calcrapid
Jogos.getTodosCalcRapidMunicipios = async function(dataInicio, dataFim){
    var args = [dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?)) as jogo, ${bdAplicacoes}.Escolas esc where esc.cod = jogo.idescola Group By esc.localidade;`, args, function (err, res) {            
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

// por cada município e um determinado tipo do Hypatiamat
Jogos.getCalcRapidTipoMunicipios = async function(dataInicio, dataFim, tipo){
    var args = [dataInicio, dataFim, tipo]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and tipo in (?)) as jogo, ${bdAplicacoes}.Escolas esc where esc.cod = jogo.idescola Group By esc.localidade;`, args, function (err, res) {            
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

// por cada agrupamento de um municipio e todos os tipos do calcrapid
Jogos.getTodosCalcRapidAgrupamentos = async function(dataInicio, dataFim, municipio){
    var args = [dataInicio, dataFim, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?)) as jogo, (select * from ${bdAplicacoes}.Escolas where localidade=?) as esc 
        where esc.cod = jogo.idescola Group By esc.cod;`, args, function (err, res) {            
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

// por cada agrupamento de um municipio e uma lista de tipos do calcrapid
Jogos.getCalcRapidTipoAgrupamentos = async function(dataInicio, dataFim, tipo, municipio){
    var args = [dataInicio, dataFim, tipo, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia where (data BETWEEN ? and ?) and tipo in (?)) as jogo,
        (select * from ${bdAplicacoes}.Escolas where localidade=?) as esc where esc.cod = jogo.idescola Group By esc.cod;`, args, function (err, res) {            
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

// por cada professor de um agrupamento e todos os tipos do calcrapid
Jogos.getTodosCalcRapidProfessores = async function(dataInicio, dataFim, escola){
    var args = [dataInicio, dataFim, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and idescola = ?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, ${bdAplicacoes}.professores prof
        where jogo.idescola = prof.escola and al.user = jogo.idaluno and al.codprofessor=prof.codigo Group By prof.codigo;`, args, function (err, res) {            
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

// por cada professor de um agrupamento e por uma lista de tipos do calcrapid
Jogos.getTiposCalcRapidProfessores = async function(dataInicio, dataFim, tipo, escola){
    var args = [dataInicio, dataFim, tipo, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and tipo in (?) and idescola = ?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, ${bdAplicacoes}.professores  prof
        where jogo.idescola = prof.escola and al.user = jogo.idaluno and al.codprofessor=prof.codigo Group By prof.codigo;`, args, function (err, res) {            
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

// por cada agrupamento de um municipio e uma lista de tipos do calcrapid
Jogos.getCalcRapidTipoAgrupamentos = async function(dataInicio, dataFim, tipo, municipio){
    var args = [dataInicio, dataFim, tipo, municipio]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.cod, esc.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia where (data BETWEEN ? and ?) and tipo in (?)) as jogo,
        (select * from ${bdAplicacoes}.Escolas where localidade=?) as esc where esc.cod = jogo.idescola Group By esc.cod;`, args, function (err, res) {            
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

// por cada aluno de uma turma de um professor e todos os tipos do calcrapid
Jogos.getTodosCalcRapidTurmas = async function(dataInicio, dataFim, escola, turma){
    var args = [dataInicio, dataFim, escola, turma, escola, turma]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and idescola = ? and turma = ?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola = ? and turma = ?) as al
        where al.user = jogo.idaluno Group By jogo.idaluno;`, args, function (err, res) {            
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

// por cada aluno de uma turma de um professor e por uma lista de tipos do calcrapid
Jogos.getTiposCalcRapidTurmas = async function(dataInicio, dataFim, tipo, escola, turma){
    var args = [dataInicio, dataFim, tipo, escola, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select prof.codigo, prof.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and tipo in (?) and idescola = ?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al, ${bdAplicacoes}.professores  prof
        where jogo.idescola = prof.escola and al.user = jogo.idaluno and al.codprofessor=prof.codigo Group By prof.codigo;`, args, function (err, res) {            
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

// por cada municipio e todos os tipos e niveis do jogo minutenew
Jogos.getTodosMinuteNewMunicipios = async function(dataInicio, dataFim){
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

Jogos.getTiposNiveisMinuteNewMunicipios = async function(dataInicio, dataFim, niveis, tipos){
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

Jogos.getTiposMinuteNewMunicipios = async function(dataInicio, dataFim, tipos){
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

Jogos.getNiveisMinuteNewMunicipios = async function(dataInicio, dataFim, niveis){
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

// por cada agrupamento de um municipio e todos os tipos e niveis do jogo minutenew
Jogos.getTodosMinuteNewAgrupamentos = async function(municipio,dataInicio, dataFim){
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

Jogos.getTiposNiveisMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, niveis, tipos){
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

Jogos.getTiposMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, tipos){
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

Jogos.getNiveisMinuteNewAgrupamentos = async function(municipio, dataInicio, dataFim, niveis){
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
Jogos.getTodosMinuteNewProfessores = async function(escola, dataInicio, dataFim){
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

Jogos.getTiposNiveisMinuteNewProfessores = async function(escola, dataInicio, dataFim, niveis, tipos){
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

Jogos.getTiposMinuteNewProfessores = async function(escola, dataInicio, dataFim, tipos){
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

Jogos.getNiveisMinuteNewProfessores = async function(escola, dataInicio, dataFim, niveis){
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


module.exports = Jogos