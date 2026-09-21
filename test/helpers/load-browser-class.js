// load-browser-class.js - Load a browser-only class into Node for testing
//
// XmasMM has no build step: js/ files are bare class declarations loaded via
// <script> tags by ModuleLoader, with no module.exports. Rather than add export
// plumbing to production files, wrap the source in a function and return the class
// from it. The source file stays untouched.
//
// new Function rather than vm.runInNewContext on purpose: a vm context is a separate
// realm, so arrays the solver builds there have a different Array.prototype and
// assert.deepStrictEqual rejects them. Passing `console` and `window` as parameters
// shadows the globals inside the loaded source, which is enough isolation here.

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

// The game logs on construction and on code generation. Silence it unless asked.
const VERBOSE = Boolean(process.env.XMASMM_TEST_VERBOSE);

function makeConsole() {
  if (VERBOSE) return console;
  const noop = () => {};
  return { log: noop, warn: noop, error: noop, info: noop, debug: noop };
}

/**
 * @param {string} relativePath - e.g. 'js/utils/ConstraintSolver.js'
 * @param {string} className - the class declared at top level in that file
 * @returns {Function} the class
 */
function loadBrowserClass(relativePath, className) {
  const filename = path.join(PROJECT_ROOT, relativePath);
  const source = fs.readFileSync(filename, 'utf8');

  // `window` is stubbed because some modules self-register on it at load time.
  const factory = new Function(
    'console',
    'window',
    `${source}\n;return typeof ${className} === 'undefined' ? undefined : ${className};`
  );
  const loaded = factory(makeConsole(), {});

  if (typeof loaded !== 'function') {
    throw new Error(`${relativePath} did not declare a top-level class ${className}`);
  }
  return loaded;
}

module.exports = { loadBrowserClass, PROJECT_ROOT };
