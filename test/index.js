'use strict';

var expect = require('chai').expect;
var parser = require('../index.js');

describe('#parser', function() {
  it ('should parse valid dsn', function() {
    var config = parser('orientdb://root:test123@127.0.0.1:2424/test?conn=test&servers=192.168.1.1:2425,192.168.1.2:2426');

    // There is a connection.
    expect(config).to.have.property('connections');
    expect(config.connections).to.have.property('test');
    expect(config.connections.test).to.have.property('server');
    expect(config.connections.test).to.have.property('database');

    // Server structure.
    var server = config.connections.test.server;
    expect(server.host).to.equal('127.0.0.1');
    expect(server.port).to.equal(2424);
    expect(server.username).to.equal('root');
    expect(server.password).to.equal('test123');

    expect(server).to.have.property('servers').with.length(2);
    expect(server.servers[0]).to.have.property('host').equal('192.168.1.1');
    expect(server.servers[0]).to.have.property('port').equal(2425);
    expect(server.servers[1]).to.have.property('host').equal('192.168.1.2');
    expect(server.servers[1]).to.have.property('port').equal(2426);

    // Database structure.
    var database = config.connections.test.database;
    expect(database.type).equal('graph');
    expect(database.storage).equal('plocal');
    expect(database.username).equal('root');
    expect(database.password).equal('test123');
  });

  it ('should use a default connection', function() {
    var config = parser('orientdb://root:test123@127.0.0.1/test');

    expect(config.connections).to.have.property('default');
  });

  it ('should use a default port', function() {
    var config = parser('orientdb://root:test123@127.0.0.1/test?conn=test');
    var server = config.connections.test.server;

    expect(server.host).to.equal('127.0.0.1');
    expect(server.port).to.equal(2424);
  });

  it ('should use the host as dedicated server', function() {
    var config = parser('orientdb://root:test123@127.0.0.1/test?conn=test');
    var server = config.connections.test.server;

    expect(server).to.have.property('servers').with.length(1);
    expect(server.servers[0]).to.have.property('host').equal('127.0.0.1');
    expect(server.servers[0]).to.have.property('port').equal(2425);
  });

  it ('should use default driver', function() {
    var config = parser('//127.0.0.1/test');

    // There is a connection.
    expect(config).to.have.property('connections');
    expect(config.connections).to.have.property('default');
    expect(config.connections['default']).to.have.property('server');
    expect(config.connections['default']).to.have.property('database');
    expect(config.connections['default'].server.host).to.equal('127.0.0.1');
    expect(config.connections['default'].server.port).to.equal(2424);
  });
});
