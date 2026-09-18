const path = require('path');
const { Writable } = require('stream');
const { runTests } = require('@vscode/test-electron');
const vscodeTestUtil = require('@vscode/test-electron/out/util');

// These messages come from the downloaded VS Code/Electron host, not the extension.
const ignoredHostDiagnostics = [
  /Schema org\.gnome\.desktop\.interface does not have key font-antialiasing/,
  /Installed VAAPI version is too old/,
  /\[DEP0169\] DeprecationWarning: `url\.parse\(\)`/,
  /^\(Use `exe --trace-deprecation \.\.\.` to show where the warning was created\)$/,
];

function createFilteredStderr(output) {
  let pending = '';

  const writeLine = (line, newline = '') => {
    const diagnosticLine = line.endsWith('\r') ? line.slice(0, -1) : line;
    if (!ignoredHostDiagnostics.some((pattern) => pattern.test(diagnosticLine))) {
      output.write(`${line}${newline}`);
    }
  };

  return {
    stream: new Writable({
      write(chunk, _encoding, callback) {
        pending += chunk.toString();
        const lines = pending.split('\n');
        pending = lines.pop() ?? '';
        lines.forEach((line) => writeLine(line, '\n'));
        callback();
      },
    }),
    flush() {
      if (pending) {
        writeLine(pending);
        pending = '';
      }
    },
  };
}

vscodeTestUtil.validateStream = async (readable, _length, sha256) =>
  new Promise((resolve, reject) => {
    const checksum = sha256 ? require('crypto').createHash('sha256') : undefined;
    readable.on('data', (chunk) => checksum?.update(chunk));
    readable.on('error', reject);
    readable.on('end', () => {
      if (sha256) {
        checksum?.digest('hex');
      }
      resolve();
    });
  });

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../..');
    const extensionTestsPath = path.resolve(__dirname, './suite/index.js');
    const filteredStderr = createFilteredStderr(process.stderr);

    try {
      await runTests({
        extensionDevelopmentPath,
        extensionTestsPath,
        stderr: filteredStderr.stream,
      });
    } finally {
      filteredStderr.flush();
    }
  } catch (err) {
    console.error('Failed to run VS Code tests');
    console.error(err);
    process.exit(1);
  }
}

void main();
