const AppsTarefas = module.exports

const { bdTesteConhecimentos, bdAplicacoes } = require('../../models/conf');
var sql = require('../../models/db_testeconhecimentos');
//var dataInicioAno = require('../../config/confs').dataInicio1
//var dataFimAno = require('../../config/confs').dataFim1

AppsTarefas.getApps = function(){
    return new Promise(function(resolve, reject) {
        sql.query(`select * from appstable;`, function (err, res) {            
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

AppsTarefas.getTarefasFromAluno= function(table, user, dataInicio, dataFim){
    var args = [user, dataInicio, dataFim]
    return new Promise(function(resolve, reject) {
        sql.query(`select frame, sum(certas) as ncertas, sum(total) as ntotal, Round( (sum(certas)/sum(total))*100, 0) as acerto
                from ${bdTesteConhecimentos}.${table} 
                where user=? and (data between ? and ?)
                group by frame
                order by frame;`, args, function (err, res) {            
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