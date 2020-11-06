var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_samd'
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_samd Connected!");
  });



module.exports = connection;
