const calcRapid = module.exports
const { bdSAMD, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_samd');

// por cada município e todos os tipos do calcrapid
calcRapid.getTodosCalcRapidMunicipios = async function(dataInicio, dataFim){
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
calcRapid.getCalcRapidTipoMunicipios = async function(dataInicio, dataFim, tipo){
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
calcRapid.getTodosCalcRapidComunidade = async function(dataInicio, dataFim, comunidade){
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
calcRapid.getCalcRapidTipoComunidade = async function(dataInicio, dataFim, tipo, comunidade){
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
calcRapid.getTodosCalcRapidAgrupamentos = async function(dataInicio, dataFim, municipio){
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
calcRapid.getCalcRapidTipoAgrupamentos = async function(dataInicio, dataFim, tipo, municipio){
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
calcRapid.getTodosCalcRapidProfessores = async function(dataInicio, dataFim, escola){
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
calcRapid.getTiposCalcRapidProfessores = async function(dataInicio, dataFim, tipo, escola){
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
calcRapid.getCalcRapidTipoAgrupamentos = async function(dataInicio, dataFim, tipo, municipio){
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
calcRapid.getTodosCalcRapidTurmas = async function(dataInicio, dataFim, escola, turma){
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
calcRapid.getTiposCalcRapidTurmas = async function(dataInicio, dataFim, tipo, escola, turma){
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

calcRapid.getTodosCalcRapidAluno = async function(dataInicio, dataFim, user){
    return new Promise(function(resolve, reject) {
        var args = [user, dataInicio, dataFim]
        sql.query(`select idaluno, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from ${bdSAMD}.calcRapidHypatia 
        where idaluno = ? and (data BETWEEN ? and ?)`, args, function (err, res) {            
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.length == 0) resolve(undefined)
                    else resolve(res[0]);
                }
            });   
    }) 
}

calcRapid.getTiposCalcRapidAluno = async function(dataInicio, dataFim, tipos, user){
    return new Promise(function(resolve, reject) {
        var args = [user, dataInicio, dataFim, tipos]
        sql.query(`select idaluno, sum(pontcerta) as pontcerta, sum(ponterrada) as ponterrada,  sum(n) as oprealizadas, sum(f) as frequencia 
		from ${bdSAMD}.calcRapidHypatia 
        where idaluno = ? and (data BETWEEN ? and ?) and tipo in (?)`, args, function (err, res) {            
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.length == 0) resolve(undefined)
                    else resolve(res[0]);
                }
            });   
    }) 
}

calcRapid.alunoJogou = async function(user, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [user, dataInicio, dataFim]
        sql.query(`select idaluno
                    from ${bdSAMD}.calcRapidHypatia 
                    where idaluno = ? and (data BETWEEN ? and ?)`, args, function (err, res) {            
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res)
                }
            });   
    }) 
}


// última vez que o aluno jogou
calcRapid.getAlunoLast = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`select max(concat(data, ' ', horario)) as lastdate from ${bdSAMD}.calcRapidHypatia where idaluno=?;`, user, function(err, res){
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

calcRapid.getAlunoFrequencia = function(user){
    var args = [user]
    return new Promise(function(resolve, reject) {
        sql.query(`Select sum(f) as frequencia from ${bdSAMD}.calcRapidHypatia where idaluno = ?;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                if(res.length > 0) resolve(res[0])
                else resolve(undefined)
            }
        })
    })
}