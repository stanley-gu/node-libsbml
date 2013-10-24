var spawn = require('child_process').spawn;
var io = require('socket.io').listen(8004); // change to port for service to run on

io.sockets.on('connection', function(s) {
  var python = spawn('python', ['-i']);

  //python.stdout.pipe(process.stdout);
  //python.stderr.on('data', function (data) {
  //  console.log('python stderr: ' + data);
  //});

  python.on('close', function (code) {
    if (code !== 0) {
      console.log('python process exited with code ' + code);
    }
  });

  python.stdin.write('import libsbml\n');

  s.on('disconnect', function() {
    python.stdin.end();
  });
  s.on('run', function(input) {
    //console.log('Running libsbml.' + input.method + '(' + input.params.join(', ') + ')' + '\n');
    //python.stdin.write('libsbml.' + input.method + '(' + input.params.join(', ') + ')' + '\n');
    console.log('Running command: ' + input.command);
    python.stdin.write('libsbml.' + input.command + '\n');
    python.stdout.on('data', function(data) {
      // convert buffer to string
      var output = '' + data;
      s.emit('response', {
        output: output
      });
      console.log('python stdout: ' + output);
    });
    python.stderr.on('data', function(data) {
      var output = '' + data;
      s.emit('response', {
        error: output
      });
      console.log('python stderr: ' + output);
    });
  });
});
