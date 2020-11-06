var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'hypat_aplicacoes'
})

const fs = require('fs')



connection.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
    getProfessores()
        .then(dados => {
            //console.log(JSON.stringify(dados))
            fs.writeFileSync("professores.json", JSON.stringify(dados), "utf8")
            //storeData(dados, "professores.json")
         })
        .catch(error => console.log(error))   
    getAlunos()
        .then(dados => {
            fs.writeFileSync("alunos.json", JSON.stringify(dados), "utf8")
         })
        .catch(error => console.log(error))   
  });

getProfessores = function () {
    return new Promise(function(resolve, reject) {
    connection.query("Select * from professores", function (err, res) {             
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

getAlunos = function () {
    return new Promise(function(resolve, reject) {
    connection.query("Select * from alunos", function (err, res) {             
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

storeData = function(data, path) {
    try {
      fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
      console.error(err)
    }
  }
  





