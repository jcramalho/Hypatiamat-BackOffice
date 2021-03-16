const { bdTesteConhecimentos } = require("../../models/conf")
var sql = require('../../models/db_testeconhecimentos')

const Trofeus = module.exports

Trofeus.getTrofeusFromUser = function(user){
    return new Promise(function(resolve, reject) {
        sql.query(`SELECT trophy3, trophy5, trophy10 from ${bdTesteConhecimentos}.trophys where cod=?;`, user, function(err, res){
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