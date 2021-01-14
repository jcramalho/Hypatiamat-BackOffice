var mysql = require('mysql') 
var db_config = {
  //host: "host.docker.internal",  
  host: "localhost",
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_contadores',
  dateStrings: ['DATE','DATETIME']
}

var connection = mysql.createPool(db_config)

module.exports = connection;
