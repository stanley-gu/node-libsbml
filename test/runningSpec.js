var ioc = require('socket.io-client');
var request = require('supertest');
var expect = require('expect.js');
var spawn = require('child_process').spawn;

var url = 'ws://' + 'localhost' + ':' + 8004;
var client = ioc.connect(url);

describe('The running RPC server', function() {
  it('should return its version', function(done) {

    client.emit('run', {
      method: 'getLibSBMLVersionString',
      params: []
    });

    client.on('response', function(response) {
      console.log(response.output);
      done();
    });

  });

});
