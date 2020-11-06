var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_aplicacoes'
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_aplicacoes Connected!");
  });



module.exports = connection;
