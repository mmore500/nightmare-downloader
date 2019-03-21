console.log("serve from:", process.argv[2]);

console.log("output to:", process.argv[3]);

console.log("browse to:", process.argv[4]);

var i;
for(i = 5; i < process.argv.length; ++i) {
  console.log("wait and click:", process.argv[i]);
}

var express = require('express');
var app = express();

app.use(express.static(process.argv[2]));
app.listen(3000);
express.static.mime.types['wasm'] = 'application/wasm';

var Nightmare = require('nightmare');
var path = require('path');

require('nightmare-download-manager')(Nightmare);
var nightmare = Nightmare({
  waitTimeout: 1000000000,
  downloadTimeout: 1000000000,
  paths: { 'downloads': process.argv[3] }
});

nightmare.on('download', function(state, downloadItem){
  if(state == 'started'){
    nightmare.emit('download', 'continue', downloadItem);
    console.log('download:', path.basename(downloadItem['path']));
  }
});

nightmare
  .downloadManager()
  .goto(process.argv[4])
  .wait(process.argv[5])
  .click(process.argv[5])
  .wait(process.argv[6])
  .click(process.argv[6])
  .wait(1000000000)
  .then(() => { console.log('done!'); });
