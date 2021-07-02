const Mensagens = module.exports

var sql = require('../../models/db_aplicacoes');

Mensagens.insertMensagem = function(mensagem){
    return new Promise(function(resolve, reject) {
        sql.query("INSERT INTO mensagem (`mensagem`) values (?)", mensagem, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res.insertId);
                }
        });   
    })
}

Mensagens.insertNovaMensagem = function(codprofessor, user, idMensagem){
    var args = [codprofessor, user, idMensagem]
    return new Promise(function(resolve, reject) {
        sql.query("INSERT INTO mensagens (`codprofessor`, `user`, `idMensagem`, `data`) values (?, ?, ?, now());", args, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    resolve(res.insertId);
                }
        });   
    })
}

Mensagens.enviaMensagem = async function(mensagem){
    var alunos = mensagem.alunos;
    var idMensagem = await Mensagens.insertMensagem(mensagem.text)
    for(var i = 0; i < alunos.length; i++){
        await Mensagens.insertNovaMensagem(mensagem.codprofessor, alunos[i].user, idMensagem)
    }

    return {message: `A mensagem foi enviada para ${alunos.length} alunos.`} 
}

Mensagens.getMensagensFromAluno = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.id, ms.codprofessor, ms.user, (select m.mensagem from mensagem m where m.id = ms.idMensagem) as mensagem, ms.data, ms.visto, datediff(now(), ms.data) as dias,
                    Round(time_to_sec(timediff(now(), ms.data )) / 3600, 0) as hours, Round(time_to_sec(timediff(now(), ms.data )) / 60, 0) as minutos
                    from mensagens ms where ms.user = ? Order by ms.data desc`, user, function(err, res){
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

Mensagens.getMensagensFromAlunoRecentes = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.id, ms.codprofessor, ms.user, (select m.mensagem from mensagem m where m.id = ms.idMensagem) as mensagem, ms.data, 
                    ms.visto, datediff(now(), ms.data) as dias, Round(time_to_sec(timediff(now(), ms.data )) / 3600, 0) as hours,
                    Round(time_to_sec(timediff(now(), ms.data )) / 60, 0) as minutos
                    from mensagens ms where ms.user = ? and YEARWEEK(ms.data)=YEARWEEK(NOW())
                    Order by ms.data desc;`, user, function(err, res){
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

Mensagens.getMensagensFromAlunoAntigas = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.id, ms.codprofessor, ms.user, (select m.mensagem from mensagem m where m.id = ms.idMensagem) as mensagem, ms.data, 
                    ms.visto, datediff(now(), ms.data) as dias, Round(time_to_sec(timediff(now(), ms.data )) / 3600, 0) as hours,
                    Round(time_to_sec(timediff(now(), ms.data )) / 60, 0) as minutos
                    from mensagens ms where ms.user = ? and YEARWEEK(ms.data)!=YEARWEEK(NOW())
                    Order by ms.data desc;`, user, function(err, res){
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

Mensagens.getMensagensFromAlunoNaoVistas = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.codprofessor, ms.user, (select m.mensagem from mensagem m where m.id = ms.idMensagem) as mensagem, ms.data, ms.visto
                    from mensagens ms where ms.user = ? and visto = 0 Order by ms.data desc`, user, function(err, res){
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

Mensagens.getMensagensFromProfessor = function(codprofessor){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.idMensagem, (select m.mensagem from mensagem m where m.id = ms.idMensagem) as mensagem, count(ms.idMensagem) as numberUsers, 
                    (select count(ms2.visto) from mensagens ms2 where ms2.idMensagem = ms.idMensagem and ms2.visto = 1) as vistos, ms.data,
                    datediff(now(), ms.data) as dias, Round(time_to_sec(timediff(now(), ms.data )) / 3600, 0) as horas,
                    Round(time_to_sec(timediff(now(), ms.data )) / 60, 0) as minutos
                    from mensagens ms 
                    where ms.codprofessor = ?
                    Group by ms.idMensagem
                    Order by ms.data desc`, codprofessor, function(err, res){
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

Mensagens.countMensagensFromAlunoNaoVistas = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`Select count(id) as number from mensagens where user = ? and visto = 0`, user, function(err, res){
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

Mensagens.putMensagemVista = function(id){
    return new Promise(function(resolve, reject) {
        sql.query(`Update mensagens Set visto = 1 where id = ?`, id, function(err, res){
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

Mensagens.getQuemViuMensagem = function(idMensagem){
    return new Promise(function(resolve, reject) {
        sql.query(`Select ms.user, al.nome, ms.visto 
            from (select * from mensagens where idMensagem=?) ms, alunos al where al.user = ms.user order by ms.visto desc`, idMensagem, function(err, res){
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

Mensagens.getMensagemByIdMensagem = function(idMensagem){
    return new Promise(function(resolve, reject) {
        sql.query(`Select distinct codprofessor 
            from mensagens where idMensagem=?`, idMensagem, function(err, res){
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

Mensagens.getMensagemById = function(id){
    return new Promise(function(resolve, reject) {
        sql.query(`Select user 
            from mensagens where id=?`, id, function(err, res){
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
