var mysql = require('mysql') 
var configs = require('./conf')
var db_config ={
  //host: "host.docker.internal",
  host: configs.host,
  user: configs.username,
  password: configs.password,
  database: configs.bdTesteConhecimentos,
  dateStrings: ['DATE','DATETIME']
}

var connection = mysql.createPool(db_config)

module.exports = connection;
