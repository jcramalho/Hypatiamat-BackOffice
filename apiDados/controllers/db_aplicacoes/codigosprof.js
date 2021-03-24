var sql = require('../../models/db_aplicacoes');

var CodigoProf = function(codigoProf){
    this.id = codigoProf.id;
    this.codigo = codigoProf.codigo
};

CodigoProf.insertCodigo = function (codigoProf) {    
    return new Promise(function(resolve, reject) {
        var args = [codigoProf.codigo]
        sql.query("INSERT INTO codigosprof (`codigo`) VALUES (?)", args, function (err, res) {
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

CodigoProf.getCodigos = function () {    
    return new Promise(function(resolve, reject) {
        sql.query("Select * from codigosprof", function (err, res) {
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


CodigoProf.getCodigo = function (id) {    
    return new Promise(function(resolve, reject) {
        sql.query("Select * from codigosprof where id=?", id, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.length > 0) resolve(res[0])
                    else resolve(undefined)
                }
        });   
    })       
};

CodigoProf.getCodigo2 = function (codigo) {    
    return new Promise(function(resolve, reject) {
        sql.query("Select * from codigosprof where codigo=?", codigo, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    reject(err);
                }
                else{
                    if(res.length > 0) resolve(res[0])
                    else resolve(undefined)
                }
        });   
    })       
};

CodigoProf.deleteCodigo = function (id) {    
    return new Promise(function(resolve, reject) {
        sql.query("Delete From codigosprof where id = ?", id, function (err, res) {
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


module.exports = CodigoProf