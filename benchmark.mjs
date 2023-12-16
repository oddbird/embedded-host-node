import fs from 'fs';
import { compare, run } from 'micro-bmark';
import tmp from 'tmp';
import {
  SassString,
  compile,
  compileAsync,
  compileString,
  compileStringAsync,
  initAsyncCompiler,
  initCompiler,
} from './dist/lib/index.mjs';

const functions = {
  'foo($args)': args => new SassString(`${args}`),
};

const importers = [
  {
    canonicalize: url => new URL(`u:${url}`),
    load: url => ({
      contents: `.import {value: ${url.pathname}} @debug "imported";`,
      syntax: 'scss',
    }),
  },
];

const asyncImporters = [
  {
    canonicalize: url => Promise.resolve(importers[0].canonicalize(url)),
    load: url => Promise.resolve(importers[0].load(url)),
  },
];

const logger = { debug: () => { } };

const basicRuns = 10;
const bootstrapRuns = 5;

const string = `@import "bar"; .fn {value: foo(bar)}`;
const file = tmp.fileSync({ postfix: '.scss' });
fs.writeFileSync(file.name, string);

// Downloaded and extracted from https://github.com/twbs/bootstrap/archive/refs/tags/v5.3.2.tar.gz
const bootstrapPath = './node_modules/bootstrap/scss/bootstrap.scss';

await run(async () => {
  const compiler = initCompiler();
  const asyncCompiler = await initAsyncCompiler();

  await compare('async', basicRuns, {
    'asyncCompiler.compileAsync': async () =>
      await asyncCompiler.compileAsync(file.name, {
        functions,
        importers: asyncImporters,
        logger,
      }),
    compileAsync: async () =>
      await compileAsync(file.name, {
        functions,
        importers: asyncImporters,
        logger,
      }),
    'asyncCompiler.compileStringAsync': async () =>
      await asyncCompiler.compileStringAsync(string, {
        functions,
        importers: asyncImporters,
        logger,
      }),
    compileStringAsync: async () =>
      await compileStringAsync(string, {
        functions,
        importers: asyncImporters,
        logger,
      }),
  });

  const asyncOpts = [file.name, {
      functions,
      importers: asyncImporters,
      logger,
    }]

  await compare('async-batch', basicRuns, {
    'async-concurrent': async () => {
      const asyncCompiler = await initAsyncCompiler();
      await Promise.all([
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
       asyncCompiler.compileAsync(...asyncOpts),
      ]);
      await asyncCompiler.dispose();
    },
    'async-serial': async () => {
      const asyncCompiler = await initAsyncCompiler();
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.compileAsync(...asyncOpts);
      await asyncCompiler.dispose();
    }
  })

  await compare('sync', basicRuns, {
    'compiler.compile': () =>
      compiler.compile(file.name, { functions, importers, logger }),
    compile: () => compile(file.name, { functions, importers, logger }),
    'compiler.compileString': () =>
      compiler.compileString(string, { functions, importers, logger }),
    compileString: () => compileString(string, { functions, importers, logger }),
  });

  await compare('bootstrap', bootstrapRuns, {
    'compiler.compile': () => compiler.compile(bootstrapPath),
    compile: () => compile(bootstrapPath),
    'asyncCompiler.compileAsync': async () =>
      await asyncCompiler.compileAsync(bootstrapPath),
    compileAsync: async () => await compileAsync(bootstrapPath),
  });

  compiler.dispose();
  await asyncCompiler.dispose();
});