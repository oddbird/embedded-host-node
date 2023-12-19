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

async function warmup(warmup = false) {
  const start = performance.now();
  const compiler = await initAsyncCompiler();
  const inited = performance.now();
  if (warmup)
    await compiler.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss');
  const warmedUp = performance.now();
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
  const compiled = performance.now();
  await compiler.dispose();
  const end = performance.now();
  console.log();
  console.log(warmup ? 'With warmup' : 'Without warmup');
  console.log('to init', inited - start);
  console.log('first compile', warmedUp - inited);
  console.log('10 compilations', compiled - warmedUp);
  console.log('dispose', end - compiled);
}

async function main() {
  releaseSync();
  await releaseAsync();
  branchSync();
  await branchAsync();
  branchSyncCompiler();
  await branchAsyncCompiler();
  await warmup(true);
  await warmup();
}
main();
