// Copyright 2020 Google Inc. Use of this source code is governed by an
// MIT-style license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import {spawn} from 'child_process';
import {Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
  OptionsWithLegacy,
  StringOptionsWithLegacy,
  createDispatcher,
  handleCompileResponse,
  handleLogEvent,
  newCompilePathRequest,
  newCompileStringRequest,
} from './compiler';
import {compilerCommand} from './compiler-path';
import {FunctionRegistry} from './function-registry';
import {ImporterRegistry} from './importer-registry';
import * as utils from './utils';
import * as proto from './vendor/embedded_sass_pb';
import {CompileResult} from './vendor/sass';

/**
 * An asynchronous wrapper for the embedded Sass compiler
 */
export class AsyncCompiler {
  /** The underlying process that's being wrapped. */
  private readonly process = spawn(
    compilerCommand[0],
    [...compilerCommand.slice(1), '--embedded'],
    {windowsHide: true}
  );

  /** Whether the underlying compiler has already exited. */
  private disposed = false;

  /** The child process's exit event. */
  private readonly exit$ = new Promise<number | null>(resolve => {
    this.process.on('exit', code => resolve(code));
  });

  /** The buffers emitted by the child process's stdout. */
  private readonly stdout$ = new Observable<Buffer>(observer => {
    this.process.stdout.on('data', buffer => observer.next(buffer));
  }).pipe(takeUntil(this.exit$));

  /** The buffers emitted by the child process's stderr. */
  private readonly stderr$ = new Observable<Buffer>(observer => {
    this.process.stderr.on('data', buffer => observer.next(buffer));
  }).pipe(takeUntil(this.exit$));

  /** Writes `buffer` to the child process's stdin. */
  private writeStdin(buffer: Buffer): void {
    this.process.stdin.write(buffer);
  }

  private throwIfDisposed(): void {
    if (this.disposed) {
      throw utils.compilerError('Async compiler has already been disposed.');
    }
  }

  // Spins up a compiler, then sends it a compile request. Returns a promise that
  // resolves with the CompileResult. Throws if there were any protocol or
  // compilation errors. Shuts down the compiler after compilation.
  private async compileRequestAsync(
    request: proto.InboundMessage_CompileRequest,
    importers: ImporterRegistry<'async'>,
    options?: OptionsWithLegacy<'async'> & {legacy?: boolean}
  ): Promise<CompileResult> {
    const functions = new FunctionRegistry(options?.functions);
    this.stderr$.subscribe(data => process.stderr.write(data));

    const dispatcher = createDispatcher<'async'>(
      this.stdout$,
      buffer => {
        this.writeStdin(buffer);
      },
      {
        handleImportRequest: request => importers.import(request),
        handleFileImportRequest: request => importers.fileImport(request),
        handleCanonicalizeRequest: request => importers.canonicalize(request),
        handleFunctionCallRequest: request => functions.call(request),
      }
    );

    dispatcher.logEvents$.subscribe(event => handleLogEvent(options, event));

    return handleCompileResponse(
      await new Promise<proto.OutboundMessage_CompileResponse>(
        (resolve, reject) =>
          dispatcher.sendCompileRequest(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response!);
            }
          })
      )
    );
  }

  compileAsync(
    path: string,
    options?: OptionsWithLegacy<'async'>
  ): Promise<CompileResult> {
    this.throwIfDisposed();
    const importers = new ImporterRegistry(options);
    return this.compileRequestAsync(
      newCompilePathRequest(path, importers, options),
      importers,
      options
    );
  }

  compileStringAsync(
    source: string,
    options?: StringOptionsWithLegacy<'async'>
  ): Promise<CompileResult> {
    this.throwIfDisposed();
    const importers = new ImporterRegistry(options);
    return this.compileRequestAsync(
      newCompileStringRequest(source, importers, options),
      importers,
      options
    );
  }

  /** Kills the child process, cleaning up all associated Observables. */
  async dispose() {
    this.disposed = true;
    this.process.stdin.end();
    await this.exit$;
  }
}

export async function initAsyncCompiler(): Promise<AsyncCompiler> {
  return new AsyncCompiler();
}
