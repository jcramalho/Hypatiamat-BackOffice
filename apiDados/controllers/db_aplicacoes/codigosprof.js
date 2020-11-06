var sql = require('../../models/db_aplicacoes');

var CodigoProf = function(codigoProf){
    this.id = codigoProf.id;
    this.codigo = codigoProf.codigo
};

CodigoProf.insertCodigo = function (codigoProf) {    
    return new Promise(function(resolve, reject) {
        var args = [codigoProf.id, codigoProf.codigo]
        sql.query("INSERT INTO codigosprof (`id`, `codigo`) VALUES (?, ?)", args, function (err, res) {
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

CodigoProf.getCodigos = function () {    
    return new Promise(function(resolve, reject) {
        sql.query("Select * from codigosprof", function (err, res) {
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


CodigoProf.getCodigo = function (id) {    
    return new Promise(function(resolve, reject) {
        sql.query("Select * from codigosprof where id=?", id, function (err, res) {
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

CodigoProf.deleteCodigo = function (id) {    
    return new Promise(function(resolve, reject) {
        sql.query("Delete From codigosprof where id = ?", id, function (err, res) {
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


module.exports = CodigoProf