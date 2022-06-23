var mysql = require('mysql')
var configs = require('./conf')
var db_config = {
  //host: "host.docker.internal",  
  host: configs.host,
  user: 'root',
  password: 'PEI2020',
  database: 'hypat_contadores',
  dateStrings: ['DATE','DATETIME']
}

var connection = mysql.createPool(db_config)

module.exports = connection;
