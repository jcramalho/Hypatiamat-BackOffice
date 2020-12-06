var sql = require('../../models/db_samd');

var Jogos = function(jogos){
    this.id = jogos.id;
    this.jogoid = jogos.jogoid;
    this.jogo = jogos.jogo
    this.jogotable = jogos.jogotable
    this.tipo = jogos.tipo
};

Jogos.getJogos = function(){
return new Promise(function(resolve, reject) {
    sql.query("SELECT * FROM hypat_samd.jogosdb order by jogoid", function (err, res) {
            
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

module.exports = Jogos