const fs = require('node:fs');
const path = require('node:path');

// Remove this patch when TypeDoc supports minimatch 11's public partial-match API.
let packagePath;
try {
  packagePath = require.resolve('typedoc/package.json');
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    // Production-only installs omit TypeDoc along with the other dev dependencies.
    console.log('Skipping TypeDoc compatibility patch: TypeDoc is not installed.');
    process.exit(0);
  }
  throw error;
}
const { version } = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (version !== '0.28.20') {
  throw new Error(`Review the minimatch compatibility patch for TypeDoc ${version}.`);
}

const sourcePath = path.join(path.dirname(packagePath), 'dist/node-utils.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const original = `return mini.set.some((row) => mini.matchOne(
        childPath,
        row,
        /* partial */
        true
      ));`;
const patched = `return mini.match(childPath.join('/'), true);`;

if (source.includes(original)) {
  if (source.indexOf(original) !== source.lastIndexOf(original)) {
    throw new Error('Unexpected TypeDoc source: multiple minimatch traversal checks found.');
  }
  fs.writeFileSync(sourcePath, source.replace(original, patched));
  console.log('Applied TypeDoc compatibility patch for minimatch 11.');
} else if (!source.includes(patched)) {
  throw new Error('Unexpected TypeDoc source: minimatch compatibility patch could not be applied.');
}
