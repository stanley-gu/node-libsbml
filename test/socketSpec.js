var http = require('http').Server;
var io = require('socket.io').listen;
var ioc = require('socket.io-client');
var request = require('supertest');
var expect = require('expect.js');
var spawn = require('child_process').spawn;

// creates a socket.io client for the given server
function client(srv, nsp, opts) {
  if ('object' == typeof nsp) {
    opts = nsp;
    nsp = null;
  }
  var addr = srv.address();
  if (!addr) addr = srv.listen().address();
  var url = 'ws://' + addr.address + ':' + addr.port + (nsp || '');
  return ioc.connect(url, opts);
}

describe('libsbml', function() {
  it('return its version', function(done) {
    var srv = http();
    var sio = io(srv);
    srv.listen(function() {
      var socket = client(srv);
      sio.on('connection', function(s) {
        var python = spawn('python', ['-i']);
        python.stdout.on('data', function(data) {
          if (('' + data).match('50800')) {
            done();
          }
          console.log('' + data);
        });
        python.stdin.write('import libsbml\n');
        python.stderr.on('data', function(data) {
          console.log("" + data);
        });
        python.stdin.write('libsbml.getLibSBMLVersionString()\n');
        python.stdin.end();
      });
      //socket.emit('run', {
      //  method: 'getTempFolder',
      //  params: []
      //})
      //socket.emit('run', {
      //  method: 'loadSBML',
      //  params: [model]
      //});
      //socket.emit('run', {
      //  method: 'getSBML',
      //  params: []
      //});
      //socket.emit('run', {
      //  method: 'simulateEx',
      //  params: [0, 100, 100]
      //});
      //socket.emit('run', {
      //  method: 'getFloatingSpeciesIds',
      //  params: [],
      //  postProcess: 'stringArrayToString',
      //  freeMem: 'freeStringArray'
      //});

      //socket.on('response', function(data) {
      //  if(data.method.indexOf('getFloatingSpeciesIds') > -1) {
      //    done();
      //  }
      //});
    });
  });

});
