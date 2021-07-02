var sql = require('../../models/db_aplicacoes');
var Comunidades = require('./comunidades')
var Jogos = require('../db_samd/jogos')
let mysql = require('mysql');
const { bdTesteConhecimentos, bdAplicacoes, bdSAMD } = require('../../models/conf');

const Estatistica = function(estatistica){
    this.id = estatistica.id
}

Estatistica.getTurmasAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select distinct t.id, t.turma, t.idprofessor from (select * from turmas where anoletivo = ?) t, 
            (select * from Escolas where localidade = ?) e, professores p
            where t.idprofessor = p.codigo and e.cod = p.escola
            Group by t.id;`, args, function (err, res) {
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

// com anos de escolaridade selecionados
Estatistica.getTurmasAnoMunPorEscolaridade = function(municipio, anoletivo, anosescolaridade){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio, anosescolaridade]
        sql.query(`select distinct t.id, t.turma, t.idprofessor from (select * from turmas where anoletivo = ?) t, 
            (select * from Escolas where localidade = ?) e, professores p
            where t.idprofessor = p.codigo and e.cod = p.escola and left(t.turma, 1) in (?)
            Group by t.id;`, args, function (err, res) {
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

// com anos de escolaridade selecionados
Estatistica.getTurmasAnoProfPorEscolaridade = function(codprofessor, anoletivo, anosescolaridade){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, codprofessor, anosescolaridade]
        sql.query(`select distinct t.id, t.turma
                    from turmas t where t.anoletivo=? and t.idprofessor=? and left(t.turma, 1) in (?)`, args, function (err, res) {
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


Estatistica.getTurmasAnoProf = function(codprofessor, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, codprofessor]
        sql.query(`select distinct t.id, t.turma
                    from turmas t where t.anoletivo=? and t.idprofessor=?`, args, function (err, res) {
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

Estatistica.getProfessoresAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select distinct p.codigo from (select * from turmas where anoletivo=?) t, 
        (select * from Escolas where localidade = ?) e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola
        Group by p.codigo;`, args, function (err, res) {
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

Estatistica.getProfessoresAnoMunPorEscolaridade = function(municipio, anoletivo, anosescolaridade){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio, anosescolaridade]
        sql.query(`select distinct p.codigo from (select * from turmas where anoletivo=?) t, 
        (select * from Escolas where localidade = ?) e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola and left(t.turma, 1) in (?)
        Group by p.codigo;`, args, function (err, res) {
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

Estatistica.getAgrupamentosAnoMun = function(municipio, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, municipio]
        sql.query(`select distinct e.cod, e.nome from (select * from turmas where anoletivo=?) t, 
        (select * from Escolas where localidade = ?) e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    /*
                    var resultado = []
                    for(var i = 0; i < res.length; i++){
                        resultado.push(res[i].cod)
                    }*/
                    resolve(res);
                }
            });   
    })
}

Estatistica.getMunicipiosAno = function( anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo]
        sql.query(`select distinct e.localidade from (select * from turmas where anoletivo=?) t, 
        Escolas e, professores p
        where t.idprofessor = p.codigo and e.cod = p.escola;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    /*
                    var resultado = []
                    for(var i = 0; i < res.length; i++){
                        resultado.push(res[i].cod)
                    }*/
                    resolve(res);
                }
            });   
    })
}


Estatistica.getNumAlunos = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select count(a.user) as numalunos from alunos a where a.codprofessor in (?) and a.turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getNumAlunos2 = function(professor, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professor, turmas]
        sql.query(`select count(a.user) as numalunos from alunos a where a.codprofessor=? and a.turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getNumAlunosOld = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select count(codAluno) as numalunos from turmasold where codProfessor in (?) and turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getNumAlunosOld2 = function(professor, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professor, turmas]
        sql.query(`select count(codAluno) as numalunos from turmasold where codProfessor=? and turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

// Frequência das apps durante o ano letivo realizado por agrupamentos de um determinado munícipio
Estatistica.getFreqAppsAnoMun = function(municipio, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [dataInicio, dataFim, municipio]
        sql.query(`SELECT sum(apps.offpeak) + sum(apps.onpeak) as freqapps, sum(apps.ncertas) as ncertas, sum(apps.ntotal) as ntotal
                    FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, 
                        ${bdAplicacoes}.professores prof,
                        (select * from ${bdAplicacoes}.Escolas where localidade=?) as esc
                        WHERE  esc.cod = prof.escola and apps.codProf=prof.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

// Frequencia das appps através das turmas e professores de um ano
Estatistica.getFreqAppsTurmasAnoMun = function(professores, turmas){
    return new Promise(function(resolve, reject) {
        var args = [professores, turmas]
        sql.query(`select sum(offpeak) + sum(onpeak) as freqapps, sum(ncertas) as ncertas, sum(ntotal) as ntotal
                    from ${bdTesteConhecimentos}.appsinfoall where codProf in (?) and turma in (?);`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.getTarefasAnoMun = function(){
    return new Promise(function(resolve, reject) {
        sql.query(``, [jogoTipo, turmas, agrupamentos], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res[0])
            }
        })
    })
}

Estatistica.jogou = function(jogoTable, jogoTipo, turmas, agrupamentos){
    return new Promise(function(resolve, reject) {
        sql.query(`Select count(*) as freq from ${bdSAMD}.${jogoTable} where tipo = ? and turma in (?) and idescola in (?)`, [jogoTipo, turmas, agrupamentos], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res[0])
            }
        })
    })
}



// Quantos jogos foram jogados por um conjunto de turmas e agrupamentos de um ano letivo
Estatistica.quantosJogosTurmasAnoMun = async function(turmas, agrupamentos){
    var jogos = await Jogos.getJogosDB()
    var quantas = 0
    var freq = 0
    for(var i = 0; i < jogos.length; i++){
        var jogo = await Estatistica.jogou(jogos[i].jogotable, jogos[i].tipo, turmas, agrupamentos)
        if(jogo.freq > 0){
            quantas++
            freq += jogo.freq;
        }
    }

    return {freq:freq, njogos: quantas}

}

Estatistica.getEstatisticasMunicipioAno = async function(municipio, anoletivo, anosescolaridade){
    var turmas, professores
    if(anosescolaridade) {
        turmas = await Estatistica.getTurmasAnoMunPorEscolaridade(municipio, anoletivo, anosescolaridade)
        professores = await Estatistica.getProfessoresAnoMunPorEscolaridade(municipio, anoletivo, anosescolaridade)
    }
    else {
        turmas = await Estatistica.getTurmasAnoMun(municipio, anoletivo)
        professores = await Estatistica.getProfessoresAnoMun(municipio, anoletivo)
    }
    var professoresAux = []
    var turmasAux = []
    var turmasMistas = 0;

    for(var i = 0; i < turmas.length; i++){
        var turma = turmas[i].turma
        if(!turmasAux.find(e => e == turma )) turmasAux.push(turma)
    }

    for(var i = 0; i < professores.length; i++){
        var codProf = professores[i].codigo
        if(!professoresAux.find(e => e == codProf)) professoresAux.push(codProf)
        if(turmas.filter(t => t.idprofessor == codProf).length > 1){
            turmasMistas++;
        }

    }
    if(turmasAux.length > 0 && professoresAux.length > 0){
        var nalunos = await Estatistica.getNumAlunos(professoresAux, turmasAux)
        var nalunosTurmasOld = {numalunos: 0}
        
        if(anoletivo != "20/21"){
            nalunosTurmasOld = await Estatistica.getNumAlunosOld(professoresAux, turmasAux)
        }
    }
    else{
        var nalunos = {numalunos:0}
        var nalunosTurmasOld = {numalunos: 0}
    }

    return {nturmas: turmas.length, nprofessores: professores.length, 
            nalunos: nalunos.numalunos + nalunosTurmasOld.numalunos, turmasmistas:turmasMistas}

}

Estatistica.getTurmasAnoAgru = function(escola, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola]
        sql.query(`select distinct t.id, t.turma, t.idprofessor
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ?
                    Group by t.id;`, args, function (err, res) {
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

Estatistica.getTurmasAnoAgruPorEscolaridade = function(escola, anoletivo, anosescolaridade){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola, anosescolaridade]
        sql.query(`select distinct t.id, t.turma, t.idprofessor
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ? and left(t.turma, 1) in (?)
                    Group by t.id;`, args, function (err, res) {
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

Estatistica.getProfessoresAnoAgru = function(escola, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola]
        sql.query(`select p.codigo, p.nome
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ?
                    Group by p.codigo;`, args, function (err, res) {
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

Estatistica.getProfessoresAnoAgruPorEscolaridade = function(escola, anoletivo, anosescolaridade){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo, escola, anosescolaridade]
        sql.query(`select p.codigo, p.nome
                    from (select * from turmas where anoletivo=?) t, professores p
                    where t.idprofessor = p.codigo and p.escola = ? and left(t.turma, 1) in (?)
                    Group by p.codigo;`, args, function (err, res) {
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

Estatistica.getFreqAppsAnoAgru = function(escola, dataInicio, dataFim){
    return new Promise(function(resolve, reject) {
        var args = [dataInicio, dataFim, escola]
        sql.query(`SELECT sum(apps.offpeak) + sum(apps.onpeak) as freqapps, sum(apps.ncertas) as ncertas, sum(apps.ntotal) as ntotal
                    FROM (select * from ${bdTesteConhecimentos}.appsinfoall where (lastdate between ? and ?)) as apps, 
                        ${bdAplicacoes}.professores prof
                        WHERE  prof.escola = ? and apps.codProf=prof.codigo;`, args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res[0]);
                }
            });   
    })
}

Estatistica.jogouAgru = function(jogoTable, jogoTipo, turmas, escola){
    return new Promise(function(resolve, reject) {
        sql.query(`Select count(idaluno) as freq from ${bdSAMD}.${jogoTable} where tipo = ? and turma in (?) and idescola=?`, [jogoTipo, turmas, escola], function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res[0])
            }
        })
    })
}

Estatistica.quantosJogosTurmasAnoAgru = async function(turmas, escola){
    var jogos = await Jogos.getJogosDB()
    var quantas = 0
    var freq = 0
    for(var i = 0; i < jogos.length; i++){
        var jogo = await Estatistica.jogouAgru(jogos[i].jogotable, jogos[i].tipo, turmas, escola)
        if(jogo.freq > 0){
            quantas++
            freq += jogo.freq; 
        }
        
    }

    return {freq:freq, njogos: quantas}

}

Estatistica.getEstatisticasAgrupamentoAno = async function(escola, anoletivo, anosescolaridade){
    var turmas, professores
    if(anosescolaridade) {
        turmas = await Estatistica.getTurmasAnoAgruPorEscolaridade(escola, anoletivo, anosescolaridade)
        professores = await Estatistica.getProfessoresAnoAgruPorEscolaridade(escola, anoletivo, anosescolaridade)
    }
    else { 
        turmas = await Estatistica.getTurmasAnoAgru(escola, anoletivo)
        professores = await Estatistica.getProfessoresAnoAgru(escola, anoletivo)
    }
    var professoresAux = []
    var turmasAux = []
    var turmasMistas = 0
   
    for(var i = 0; i < turmas.length; i++){
        var turma = turmas[i].turma
        if(!turmasAux.find(e => e == turma )) turmasAux.push(turma)
    }
    for(var i = 0; i < professores.length; i++){
        var codProf = professores[i].codigo
        if(!professoresAux.find(e => e == codProf)) professoresAux.push(codProf)
        if(turmas.filter(t => t.idprofessor == codProf).length > 1){
            turmasMistas++;
        }
    }

    if(turmasAux.length > 0 && professoresAux.length > 0){
        var nalunos = await Estatistica.getNumAlunos(professoresAux, turmasAux)
        var nalunosTurmasOld = {numalunos: 0}        

        if(anoletivo != "20/21"){
            nalunosTurmasOld = await Estatistica.getNumAlunosOld(professoresAux, turmasAux)
        }

    }
    else{
        var nalunos = {numalunos:0}
        var nalunosTurmasOld = {numalunos: 0}
    }


    

    return {nturmas: turmas.length, nprofessores: professores.length, 
            nalunos: nalunos.numalunos + nalunosTurmasOld.numalunos, turmasmistas: turmasMistas}


}

Estatistica.getEstatisticaAgruMun = async function(municipio, anoletivo, anosescolaridade){

    var agrupamentos = await Estatistica.getAgrupamentosAnoMun(municipio, anoletivo)
    var resultado = []
    
    for(var i = 0; i < agrupamentos.length; i++){
        var agrupamento = await Estatistica.getEstatisticasAgrupamentoAno(agrupamentos[i].cod, anoletivo, anosescolaridade)
        agrupamento.cod = agrupamentos[i].cod
        agrupamento.nome = agrupamentos[i].nome
        resultado.push(agrupamento)
    }
    
    await resultado.sort(function (a, b) {
        return (a.nalunos > b.nalunos) ? -1 : 1;
      });
    
    return resultado
            
}

Estatistica.getAlunosAnoProf = async function(escola, codProf, anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [escola, anoletivo, codProf,
                    escola, codProf, anoletivo]
        sql.query(`Select count(a.user) as nalunos
        From ((SELECT a.*
            FROM (select * from hypati67_aplicacoes.alunos a where escola=?) a, 
                (select * from hypati67_aplicacoes.turmas where anoletivo=? and idprofessor=?) t
            Where t.turma=a.turma)
        UNION
         (SELECT a.*
            FROM (select * from hypati67_aplicacoes.alunos where escola=?) a
            RIGHT JOIN (select * from hypati67_aplicacoes.turmasold where codProfessor=? and anoletivo=?) aold 
                ON a.user = aold.codAluno)) a;`, args, function(err, res){
            if(err){
                console.log("erro: " + err)
                reject(err)
            }
            else{
                resolve(res[0])
            }
        })
    })
}

Estatistica.getEstatisticaAnoAgruProf = async function(escola, anoletivo, anosescolaridade){
    var professores 
    if(anosescolaridade) professores = await Estatistica.getProfessoresAnoAgruPorEscolaridade(escola, anoletivo, anosescolaridade) 
    else professores = await Estatistica.getProfessoresAnoAgru(escola, anoletivo)
    var resultado = []
    for(var i = 0; i < professores.length; i++){
        var turmasMistas = 0;
        var codProf = professores[i].codigo
        var turmas
        if(anosescolaridade) turmas = await Estatistica.getTurmasAnoProfPorEscolaridade(codProf, anoletivo, anosescolaridade)
        else turmas = await Estatistica.getTurmasAnoProf(codProf, anoletivo)

        if(turmas.length > 1) turmasMistas = 1;
        
        var turmasAux = []
        for(var j = 0; j < turmas.length ; j++){
            turmasAux.push(turmas[j].turma)
        }

        var nalunos = await Estatistica.getNumAlunos2(codProf, turmasAux)
        var nalunosTurmasOld = {numalunos: 0}        

        if(anoletivo != "20/21"){
            nalunosTurmasOld = await Estatistica.getNumAlunosOld2(codProf, turmasAux)
        }
        
        var prof = {codigo: codProf, nome: professores[i].nome,
                    nturmas: turmas.length,nalunos: nalunos.numalunos + nalunosTurmasOld.numalunos, 
                    turmasmistas: turmasMistas}

        resultado.push(prof)
    }
    
    await resultado.sort(function (a, b) {
        return (a.nalunos > b.nalunos) ? -1 : 1;
      });
    
    return resultado
            
}


/*
Estatistica.getEstatisticasMunicipios = async function (anoletivo){
    return new Promise(function(resolve, reject) {
        var args = [anoletivo]
        sql.query(`select e.localidade, count(distinct p.codigo) as nprofessores, 
		count(distinct a.id) as nalunos, count(distinct t.id) as nturmas  
		from (select * from turmas where anoletivo=?) t, 
        Escolas e, professores p, alunos a
        where t.idprofessor = p.codigo and e.cod = p.escola and a.codprofessor = p.codigo and a.turma = t.turma
        Group by e.localidade Order by nalunos DESC;`, args, function (err, res) {
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
*/

Estatistica.getEstatisticasComunidade = async function(anoletivo, comunidade, anosescolaridade){
    var municipios = await Comunidades.getMunicipiosFromComunidade(comunidade)
    var resultado = []
    for(var i = 0; i < municipios.length; i++){
        var municipio = await Estatistica.getEstatisticasMunicipioAno(municipios[i].municipio, anoletivo, anosescolaridade)
        municipio.localidade = municipios[i].municipio
        resultado.push(municipio)
    }
    
    await resultado.sort(function (a, b) {
        return (a.nalunos > b.nalunos) ? -1 : 1;
      });
    
    return resultado

}

Estatistica.getEstatisticasMunicipios = async function (anoletivo, anosescolaridade){
    var municipios = await Estatistica.getMunicipiosAno(anoletivo)
    var resultado = []
    for(var i = 0; i < municipios.length; i++){
        var municipio = await Estatistica.getEstatisticasMunicipioAno(municipios[i].localidade, anoletivo, anosescolaridade)
        municipio.localidade = municipios[i].localidade
        resultado.push(municipio)
    }
    
    await resultado.sort(function (a, b) {
        return (a.nalunos > b.nalunos) ? -1 : 1;
      });
    
    return resultado
    
}


module.exports = Estatistica