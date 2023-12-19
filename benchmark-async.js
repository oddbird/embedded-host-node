// Based on https://github.com/sass/embedded-host-node/pull/261#issuecomment-1858970697

const sass = require('sass-embedded');
const { initCompiler, initAsyncCompiler, compile, compileAsync } = require('./dist/lib/index.js');

function releaseSync() {
  const start = performance.now();
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  sass.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  const end = performance.now();
  console.log('releaseSync:', end - start);
}

async function releaseAsync() {
  const start = performance.now();
  await Promise.all([
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    sass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss')
  ]);
  const end = performance.now();
  console.log('releaseAsync:', end - start);
}
function branchSync() {
  const start = performance.now();
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compile('./node_modules/bootstrap/scss/bootstrap.scss');
  const end = performance.now();
  console.log('branchSync:', end - start);
}

async function branchAsync() {
  const start = performance.now();
  await Promise.all([
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compileAsync('./node_modules/bootstrap/scss/bootstrap.scss')
  ]);
  const end = performance.now();
  console.log('branchAsync:', end - start);
}


function branchSyncCompiler() {
  const start = performance.now();
  const compiler = initCompiler();
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.compile('./node_modules/bootstrap/scss/bootstrap.scss');
  compiler.dispose();
  const end = performance.now();
  console.log('sync compiler:', end - start);
}

async function branchAsyncCompiler() {
  const start = performance.now();
  const compiler = await initAsyncCompiler();
  await Promise.all([
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
    compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
  ]);
  await compiler.dispose();
  const end = performance.now();
  console.log('async compiler:', end - start);
}

async function main() {
  releaseSync();
  await releaseAsync();
  branchSync();
  await branchAsync();
  branchSyncCompiler();
  await branchAsyncCompiler();
}
main();
