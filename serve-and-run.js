console.log("serve from:", process.argv[2]);

console.log("output to:", process.argv[3]);

console.log("browse to:", process.argv[4]);

var i;
for(i = 5; i < process.argv.length; ++i) {
  console.log("wait and click:", process.argv[i]);
}

console.log("beginning initialization...");

var express = require('express');
var app = express();

app.use(express.static(process.argv[2]));
app.listen(3000);
express.static.mime.types['wasm'] = 'application/wasm';

console.log("express initialized...");

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

nightmare.on('console', console.log.bind(console));

console.log("nightmare initialized...");

var cmd = "nightmare.downloadManager().goto('" + process.argv[4] + "')";

for(i = 5; i < process.argv.length; ++i) {
  cmd += (".wait('" + process.argv[i] + "')");
  cmd += (".click('" + process.argv[i] + "')");
}

cmd += ".wait(1000000000).then(() => { console.log('done!'); });"

console.log("evaluating command:", cmd);
"use strict";
eval(cmd);

console.log("... initialization complete!");
