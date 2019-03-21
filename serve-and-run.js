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

console.log("... initialization complete!");

// see https://github.com/segmentio/nightmare/issues/224 RE xvfb
const Nightmare = require('nightmare')
const path = require('path');
const Xvfb = require('xvfb')

require('nightmare-download-manager')(Nightmare);

main().catch(console.error)

// main function
async function main() {
  const close = await xvfb()
  const nightmare = Nightmare({
    waitTimeout: 1000000000,
    downloadTimeout: 1000000000,
    paths: { 'downloads': process.argv[3] }
  })

  const [err, title] = await poss(run(nightmare))
  if (err) {
    // cleanup properly
    await nightmare.end()
    await close()
    throw err
  }

  console.log(title)

  // shut'er down
  await nightmare.end()
  await close()
}

// run nightmare
//
// put all your nightmare commands in here
async function run(nightmare) {

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

  await nightmare.wait(1000000000);
  const title = await nightmare.title()
  return title

}

// xvfb wrapper
function xvfb(options) {
  var xvfb = new Xvfb(options)

  function close() {
    return new Promise((resolve, reject) => {
      xvfb.stop(err => (err ? reject(err) : resolve()))
    })
  }

  return new Promise((resolve, reject) => {
    xvfb.start(err => (err ? reject(err) : resolve(close)))
  })
}

// try/catch helper
async function poss(promise) {
  try {
    const result = await promise
    return [null, result]
  } catch (err) {
    return [err, null]
  }
}
