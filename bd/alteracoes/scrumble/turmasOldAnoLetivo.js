var mysql = require('mysql')
var database = 'hypati67_aplicacoes'
var connection = mysql.createConnection({
    host: "host.docker.internal",
    user: 'root',
    password: "admin",
    database: database
})

getTurmasOldAnos = async function(){

    return new Promise(function(resolve, reject) {
        connection.query(`Select id, SUBSTRING_INDEX(SUBSTRING_INDEX(turma,'-',2),'-',-1) as ano from ${database}.turmasold;`
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

    for(var i = 0; i < turmas.length; i++){
        var id = turmas[i].id
        var ano = turmas[i].ano
        var anoLetivo = (parseInt(ano) - 1) + "/" + ano
        connection.query(`Update ${database}.turmasold Set anoletivo = ? where id = ?`, [anoLetivo, id])
    }
}

run();
return;