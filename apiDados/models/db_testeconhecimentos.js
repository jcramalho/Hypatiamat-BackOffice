var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'hypat_testeconhecimentos'
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_testeconhecimentos Connected!");
  });



module.exports = connection;
