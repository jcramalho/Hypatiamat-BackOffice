var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'hypat_contadores'
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_contadores Connected!");
  });



module.exports = connection;
