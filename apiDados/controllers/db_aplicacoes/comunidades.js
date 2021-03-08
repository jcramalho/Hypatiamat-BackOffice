var sql = require('../../models/db_aplicacoes');

const Comunidades = module.exports

Comunidades.getComunidades= function(){
    return new Promise(function(resolve, reject) {
        sql.query("Select codigo, nome, count(municipio) as municipios from comunidades group by codigo", function(err, res){
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

Comunidades.getMunicipiosFromComunidade= function(codigo){
    return new Promise(function(resolve, reject) {
        sql.query("Select municipio from comunidades where codigo=?", [codigo], function(err, res){
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

Comunidades.getMunicipioComunidade= function(codigo, municipio){
    return new Promise(function(resolve, reject) {
        sql.query("Select id from comunidades where codigo=? and municipio=?", [codigo, municipio], function(err, res){
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

Comunidades.insertComunidadeMunicipio = function(codigo, nome, municipio){
    return new Promise(function(resolve, reject) {
        var args = [codigo, nome, municipio]
        sql.query("Insert into comunidades (`codigo`, `nome`, `municipio`) values (?, ?, ?)", args, function(err, res){
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

Comunidades.criarComunidade = async function(codigo, nome, municipios){
    for(var i = 0; i < municipios.length; i++){
       await Comunidades.insertComunidadeMunicipio(codigo, nome, municipios[i])
                        .catch(error => console.log(error))
    }
    return {message: 'Comunidade inserida com sucesso.'}
}

Comunidades.deleteComunidadeMunicipio = function(codigo, municipio){
    return new Promise(function(resolve, reject) {
        sql.query("Delete From comunidades where codigo = ? and municipio=?", [codigo, municipio], function (err, res) {
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