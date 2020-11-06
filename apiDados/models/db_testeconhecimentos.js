var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'PEI2020',
  password: 'admin',
  database: 'hypat_testeconhecimentos'
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_testeconhecimentos Connected!");
  });



module.exports = connection;
