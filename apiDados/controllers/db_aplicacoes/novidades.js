var sql = require('../../models/db_aplicacoes');
const bdAplicacoes = require('../../models/conf').bdAplicacoes


const Novidades = module.exports

Novidades.insertNovidade = function (novidade) {    
    return new Promise(function(resolve, reject) {
    var args, sqlquery
    if(novidade.link) {
        args = [novidade.titulo, novidade.link]
        sqlquery = "INSERT INTO novidades (`titulo`, `data`, `link`) VALUES (?, now(), ?)"
    }
    else {
        args = [novidade.titulo]
        sqlquery = "INSERT INTO novidades (`titulo`, `data`, `link`) VALUES (?, now(), null)"
    }
    sql.query(sqlquery, args, function (err, res) {
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

Novidades.insertSubNovidade = function (idNovidade, subNovidade) {    
    return new Promise(function(resolve, reject) {
    var args = [idNovidade, subNovidade]
    sql.query("INSERT INTO subnovidades (`idNovidade`, `subnovidade`) VALUES (?, ?)", 
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

Novidades.getNovidades = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`Select nov.id, nov.titulo, nov.data, nov.link,
            (select count(sub.id) from subnovidades sub where sub.idNovidade=nov.id) as subnovidades 
            from novidades nov Order by nov.id desc`, function(err, res){
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

Novidades.getNovidadeInfo = function(id){
    return new Promise(function(resolve, reject) {
        sql.query(`Select id, titulo, data, link from novidades where id=?`, id, function(err, res){
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

Novidades.getNovidade = async function(id){
    var novidade = await Novidades.getNovidadeInfo(id)
    novidade.subnovidades = await Novidades.getSubNovidades(id)
    
    return novidade
}

Novidades.getAllInfoNovidades = async function(){
    var novidades = await Novidades.getNovidades()
    for(var i = 0; i < novidades.length; i++){
        var subnovidades = await Novidades.getSubNovidades(novidades[i].id)
        novidades[i].subnovidades = subnovidades
    }

    return novidades 
}

Novidades.getSubNovidades = function(idNovidade){
    return new Promise(function(resolve, reject) {
        sql.query(`Select id, subnovidade from subnovidades where idNovidade=?`, idNovidade, function(err, res){
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

Novidades.updateNovidade = function(id, novidade){
    return new Promise(function(resolve, reject) {
        
        if(novidade.link) {var query = `Update novidades Set titulo=?, link=? where id=?`; var args= [novidade.titulo, novidade.link, id]}
        else {var query = `Update novidades Set titulo=?, link=null where id=?`; var args= [novidade.titulo, id]}
        
        sql.query(query, args, function(err, res){
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

Novidades.apagaSubnovidades = function(idNovidade){
    return new Promise(function(resolve, reject) {
        sql.query(`Delete from subnovidades where idNovidade=?`, idNovidade, function(err, res){
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

Novidades.apagaSubNovidade = function(id){
    return new Promise(function(resolve, reject) {
        sql.query(`Delete from subnovidades where id=?`, id, function(err, res){
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

Novidades.deleteNovidade = function(idNovidade){
    return new Promise(function(resolve, reject) {
        sql.query(`Delete from novidades where id=?`, idNovidade, function(err, res){
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

Novidades.apagaNovidade = async function(idNovidade){
   await Novidades.apagaSubnovidades(idNovidade)
   return await Novidades.deleteNovidade(idNovidade)
}