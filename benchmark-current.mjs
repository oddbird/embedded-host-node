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

import * as currentSass from 'sass-embedded';

const basicRuns = 10;

await run(async () => {
  await compare('sync', basicRuns, {
    // A, B and C are expected to be identical.
    // D is expected to be much faster. 
    'A sequential 1 non-persisted compiler': () => {
      let c;
      c = initCompiler();
      c.compile('./node_modules/bootstrap/scss/bootstrap.scss');
      c.dispose();
      c = initCompiler();
      c.compile('./node_modules/bootstrap/scss/bootstrap-grid.scss');
      c.dispose();
      c = initCompiler();
      c.compile('./node_modules/bootstrap/scss/bootstrap-reboot.scss');
      c.dispose();
      c = initCompiler();
      c.compile('./node_modules/bootstrap/scss/bootstrap-utilities.scss');
      c.dispose();
    },
    'B sequential non-Compiler': () => {
      compile('./node_modules/bootstrap/scss/bootstrap.scss')
      compile('./node_modules/bootstrap/scss/bootstrap-grid.scss')
      compile('./node_modules/bootstrap/scss/bootstrap-reboot.scss')
      compile('./node_modules/bootstrap/scss/bootstrap-utilities.scss')
    },
    'C current version sequential non-Compiler': () => {
      currentSass.compile('./node_modules/bootstrap/scss/bootstrap.scss')
      currentSass.compile('./node_modules/bootstrap/scss/bootstrap-grid.scss')
      currentSass.compile('./node_modules/bootstrap/scss/bootstrap-reboot.scss')
      currentSass.compile('./node_modules/bootstrap/scss/bootstrap-utilities.scss')
    },
    'D sequential 1 persisted compiler': () => {
      const c = initCompiler();
      c.compile('./node_modules/bootstrap/scss/bootstrap.scss')
      c.compile('./node_modules/bootstrap/scss/bootstrap-grid.scss')
      c.compile('./node_modules/bootstrap/scss/bootstrap-reboot.scss')
      c.compile('./node_modules/bootstrap/scss/bootstrap-utilities.scss')
      c.dispose();
    },
  });
  await compare('async', basicRuns, {
    // A, B, and C are expected to be identical
    // D and E are expected to be faster
    'A sequential 1 non-persisted compiler': async () => {
      let c;
      c = await initAsyncCompiler();
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss');
      await c.dispose();
      c = await initAsyncCompiler();
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-grid.scss');
      await c.dispose();
      c = await initAsyncCompiler();
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-reboot.scss');
      await c.dispose();
      c = await initAsyncCompiler();
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-utilities.scss');
      await c.dispose();
    },
    'B sequential non-Compiler': async () => {
      await compileAsync('./node_modules/bootstrap/scss/bootstrap.scss')
      await compileAsync('./node_modules/bootstrap/scss/bootstrap-grid.scss')
      await compileAsync('./node_modules/bootstrap/scss/bootstrap-reboot.scss')
      await compileAsync('./node_modules/bootstrap/scss/bootstrap-utilities.scss')
    },
    'C current version sequential non-Compiler': async () => {
      await currentSass.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss')
      await currentSass.compileAsync('./node_modules/bootstrap/scss/bootstrap-grid.scss')
      await currentSass.compileAsync('./node_modules/bootstrap/scss/bootstrap-reboot.scss')
      await currentSass.compileAsync('./node_modules/bootstrap/scss/bootstrap-utilities.scss')
    },
    'D sequential 1 persisted compiler': async () => {
      const c = await initAsyncCompiler();
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss');
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-grid.scss');
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-reboot.scss');
      await c.compileAsync('./node_modules/bootstrap/scss/bootstrap-utilities.scss');
      await c.dispose();
    },
    'E Promise all 1 persisted compiler': async () => {
      const c = await initAsyncCompiler();
      Promise.all([
        c.compileAsync('./node_modules/bootstrap/scss/bootstrap.scss'),
        c.compileAsync('./node_modules/bootstrap/scss/bootstrap-grid.scss'),
        c.compileAsync('./node_modules/bootstrap/scss/bootstrap-reboot.scss'),
        c.compileAsync('./node_modules/bootstrap/scss/bootstrap-utilities.scss'),
      ])
      await c.dispose();
    },
  });

});
