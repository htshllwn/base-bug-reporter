var cfLoc = './config'
var config = {};

config['jira'] = require(cfLoc + '/jira'),
config['nightmare'] = require(cfLoc + '/nightmare'),
config['folders'] = require(cfLoc + '/folders'),
config['urls'] = require(cfLoc + '/urls'),


module.exports = config;