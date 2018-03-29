'use strict';

/**
 * To parse components in DSN string.
 * @type {RegExp}
 */
var splitRegEx = new RegExp(
  '^' +

  // Driver (orientdb:// or //)
  '(?:orientdb:)?' +
  '(?:\/\/)' +

  // Credentials <user>:<pass>@...
  '(?:([^\/?#]*)@)?' +

  // Host
  '([\\w\\d\\-\\u0100-\\uffff.%]*)' +

  // Port
  '(?::([0-9]+))?' +

  // Database
  '([^?#]+)?' +

  // Params
  '(?:\\?([^#]*))?' +

  // That's all folks
  '$'
);

/**
 * Remove leading / from string.
 * @param str String.
 * @returns {*}
 */
function stripLeadingSlash (str) {
  if (str && str.substr(0, 1) === '/') {
    return str.substr(1, str.length);
  }

  return str;
}

/**
 * Parse query string params into an object.
 * @param params Params as string.
 * @returns {{}}
 */
function queryParams (params) {
  if (!params) {
    return {};
  }

  return JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
}

/**
 * Parse DSN string and create the config object.
 * Format accepted:
 * [orientdb:]//[<user>:<pass>@]localhost[:<port>][/<database>][?conn=<default>&severs=<host>:<port>,<host>:<port>,...]
 *
 * @param dsn
 * @returns {{connections: {}}}
 */
module.exports = function (dsn) {
  // Parse.
  var components = dsn.match(splitRegEx);

  // Authentication.
  var credentials = components[1] || 'admin:admin';
  var auth = credentials.split(':');
  var user = auth[0];
  var pass = auth[1];
  var host = components[2] || 'localhost';
  var port = parseInt(components[3] || 2424);
  var database = stripLeadingSlash(components[4]) || 'GratefulDeadConcerts';

  // Extra params passed.
  var options = queryParams(components[5]);
  var serversParam = options.servers || (host + ':2425');
  var servers = serversParam.split(',');

  // https://orientdb.com/docs/last/OrientJS-Server.html#using-distributed-databases
  var distributedServers = servers.map(function(server) {
    var dedicatedServer = server.split(':');

    return {
      host: dedicatedServer[0],
      port: parseInt(dedicatedServer[1] || 2425)
    };
  });

  var conn = {};
  conn[options.conn || 'default'] = {
    server: {
      host: host,
      port: port,
      username: user,
      password: pass,
      servers: distributedServers
    },
    database: {
      type: "graph",
      storage: "plocal",
      username: user,
      password: pass,
      name: database
    }
  };

  return {
    connections: conn
  };
};
