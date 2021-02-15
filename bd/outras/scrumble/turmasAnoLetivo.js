var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'hypati67_samd',
    password: "4851rfdfreDFd",
    database: 'hypati67_aplicacoes'
  })

getTurmasAnos = async function(){

    return new Promise(function(resolve, reject) {
        connection.query("Select id, SUBSTRING_INDEX(SUBSTRING_INDEX(turma,'-',2),'-',-1) as ano from hypati67_aplicacoes.turmas;"
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
var turmas = await getTurmasAnos()
for(var i = 0; i < turmas.length; i++){
    var id = turmas[i].id
    var ano = turmas[i].ano
    var anoLetivo = (parseInt(ano)-1) + "/" + ano
    //console.log(ano + " -> " + anoLetivo)
    connection.query("Update hypati67_aplicacoes.turmas Set anoletivo = ? where id = ?", [anoLetivo, id])
}
}

run()