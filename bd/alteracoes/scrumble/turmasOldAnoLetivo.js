var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PEI2020',
    database: 'hypat_aplicacoes'
  })

getTurmasOldAnos = async function(){

    return new Promise(function(resolve, reject) {
        connection.query("Select id, SUBSTRING_INDEX(SUBSTRING_INDEX(turma,'-',2),'-',-1) as ano from hypat_aplicacoes.turmasold;"
        , function(err, res){
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



run = async function(){
var turmas = await getTurmasOldAnos()
console.log(turmas)

for(var i = 0; i < turmas.length; i++){
    var id = turmas[i].id
    var ano = turmas[i].ano
    var anoLetivo = (parseInt(ano) - 1) + "/" + ano
    connection.query("Update hypat_aplicacoes.turmasold Set anoletivo = ? where id = ?", [anoLetivo, id])
}
}

run()