var cfLoc = './config'
var config = {};

config['jira'] = require(cfLoc + '/jira');
config['nightmare'] = require(cfLoc + '/nightmare');
config['folders'] = require(cfLoc + '/folders');
config['urls'] = require(cfLoc + '/urls');
config['filter'] = require(cfLoc + '/filter');
config['mail'] = require(cfLoc + '/mail');
config['recipients'] = require(cfLoc + '/recipients');


module.exports = config;