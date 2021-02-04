var mysql = require('mysql') 
var configs = require('./conf')

var db_config ={
  host: configs.host,
  //host: "host.docker.internal",
  user: configs.username,
  password: configs.password,
  database: configs.bdAplicacoes,
  dateStrings: ['DATE','DATETIME']
}

var connection = mysql.createPool(db_config)

module.exports = connection;
