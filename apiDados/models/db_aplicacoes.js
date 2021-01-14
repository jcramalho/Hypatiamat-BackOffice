var mysql = require('mysql') 
var db_config ={
  host: "localhost",
  //host: "host.docker.internal",
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_aplicacoes',
  dateStrings: ['DATE','DATETIME']
}

var connection = mysql.createPool(db_config)

module.exports = connection;
