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
    var calcrapid = {jogo: 'Calcrapid', jogotable:'calcRapidHypatia', tipos:["1 - Adição", "2 - Subtração", "3 - Multiplicação", "4 - Divisão"]}
    var minutenew = {jogo: 'Calculus', jogotable: 'minutenew', 
                        niveis:["1", "2", "3", "4", "5"], 
                        tipos:["Todos", "1 – Adição", "2 – Subtração", "3 – Multiplicação", "4 – Divisão"]}
    resultado.push(calcrapid)
    resultado.push(minutenew)
    var jogos = await Jogos.getJogosDB();
    for(var i = 0; i < jogos.length; i++){
        resultado.push(jogos[i])
    }
    return resultado;
}

Jogos.getAllJogosComunidade = async function(comunidade, dataInicio, dataFim){
    var jogos = await Jogos.getJogosDB()
    var res = []

    // jogos em geral
    for(var i = 0; i < jogos.length; i++){
        var jogo = await Jogos.getJogoComunidade(comunidade, jogos[i].jogotable, jogos[i].tipo, dataInicio, dataFim)
        for(var j = 0; j < jogo.length; j++){
            var aux = res.find(element => element.localidade == jogo[j].localidade)
            if(aux) aux.number +=jogo[j].number
            else res.push({localidade: jogo[j].localidade, number: jogo[j].number})
        }
    }
    
    // calcrapid
    var calcRapid = await Jogos.getTodosCalcRapidComunidade(dataInicio, dataFim, comunidade)
    for(var j = 0; j < calcRapid.length; j++){
        var aux = res.find(element => element.localidade == calcRapid[j].localidade)
        if(aux) aux.number += calcRapid[j].frequencia
        else res.push({localidade: calcRapid[j].localidade, number: calcRapid[j].frequencia})
    }
    
    // calculus
    var calculus = await Jogos.getTodosMinuteNewComunidade(dataInicio, dataFim, comunidade)
    for(var j = 0; j < calculus.length; j++){
        var aux = res.find(element => element.localidade == calculus[j].localidade)
        if(aux) aux.number += calculus[j].frequencia
        else res.push({localidade: calculus[j].localidade, number: calculus[j].frequencia})
    }

    await res.sort(function (a, b) {
        return (a.number > b.number) ? -1 : 1;
    });

    return res;
}

Jogos.getJogoComunidade = function(comunidade, jogoTable, tipo, dataInicio, dataFim){
    var args = [dataInicio, dataFim, tipo, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT esc.localidade, min(jogo.pontuacao) as min, max(jogo.pontuacao) as max, Round(AVG(jogo.pontuacao), 0) as media, count(jogo.pontuacao) as number 
		FROM (select * from ${bdSAMD}.${jogoTable} where (data BETWEEN ? and ?) and tipo=?) jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        WHERE jogo.idescola=esc.cod Group by esc.localidade Order by esc.localidade;`, args, function (err, res) {            
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

// por cada município de uma comunidade e todos os tipos do calcrapid
Jogos.getTodosCalcRapidComunidade = async function(dataInicio, dataFim, comunidade){
    var args = [dataInicio, dataFim, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia where (data BETWEEN ? and ?)) as jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        where esc.cod = jogo.idescola Group By esc.localidade;`, args, function (err, res) {            
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

// por cada município de uma comunidade e um determinado tipo do Hypatiamat
Jogos.getCalcRapidTipoComunidade = async function(dataInicio, dataFim, tipo, comunidade){
    var args = [dataInicio, dataFim, tipo, comunidade]
    return new Promise(function(resolve, reject) {
        sql.query(`select esc.localidade, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia where (data BETWEEN ? and ?) and tipo in (?)) as jogo, 
        (select * from ${bdAplicacoes}.Escolas where localidade in (select municipio from ${bdAplicacoes}.comunidades where codigo=?)) as esc 
        where esc.cod = jogo.idescola Group By esc.localidade;`, args, function (err, res) {            
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
    var args = [dataInicio, dataFim, escola, turma, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.idaluno, al.numero, al.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and idescola = ? and turma = ?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola = ?) as al
        where al.user = jogo.idaluno Group By jogo.idaluno Order by al.numero;`, args, function (err, res) {            
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
    var args = [dataInicio, dataFim, tipo, escola, turma, escola]
    return new Promise(function(resolve, reject) {
        sql.query(`select jogo.idaluno, al.numero, al.nome, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from (select * from ${bdSAMD}.calcRapidHypatia 
        where (data BETWEEN ? and ?) and tipo in (?) and idescola = ? and turma=?) as jogo, 
        (select * from ${bdAplicacoes}.alunos where escola=?) as al
        where al.user = jogo.idaluno Group By jogo.idaluno Order by al.numero;`, args, function (err, res) {            
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

// por cada municipio de uma comunidade e todos os tipos e niveis do jogo minutenew
Jogos.getTodosMinuteNewComunidade = async function(dataInicio, dataFim, comunidade){
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

Jogos.getTiposNiveisMinuteNewComunidade = async function(dataInicio, dataFim, niveis, tipos, comunidade){
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

Jogos.getTiposMinuteNewComunidade = async function(dataInicio, dataFim, tipos, comunidade){
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

Jogos.getNiveisMinuteNewComunidade = async function(dataInicio, dataFim, niveis, comunidade){
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

// por cada aluno de uma turma e todos os tipos e niveis do jogo minutenew
Jogos.getTodosMinuteNewTurma = async function(turma, escola, dataInicio, dataFim){
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

Jogos.getTiposNiveisMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, niveis, tipo){
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

Jogos.getNiveisMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, niveis){
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

Jogos.getTiposMinuteNewTurma = async function(turma, escola, dataInicio, dataFim, tipo){
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






module.exports = Jogos