var mysql = require('mysql') 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_testeconhecimentos',
  dateStrings: ['DATE','DATETIME']
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Database hypat_testeconhecimentos Connected!");
  });



module.exports = connection;
