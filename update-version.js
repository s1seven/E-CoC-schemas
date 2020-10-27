const fs = require('fs');
const { promisify } = require('util');

const serverUrl = 'https://raw.githubusercontent.com/s1seven/E-CoC-schemas';
// TODO: when schema-deploys stable
// const serverUrl = 'https://schemas.en10204.io/E-CoC';

function readFile(path) {
  return promisify(fs.readFile)(path, 'utf8');
}

function writeFile(path, data) {
  return promisify(fs.writeFile)(path, data);
}

const schemaFilePaths = ['e-CoC.schema.json'];

async function updateSchemasVersion(version) {
  await Promise.all(
    schemaFilePaths.map(async (filePath) => {
      const schema = JSON.parse(await readFile(filePath));
      const [schemaName] = filePath.split('.');
      schema.$id = `${serverUrl}/${version}/${schemaName}.schema.json`;
      await writeFile(filePath, JSON.stringify(schema, null, 2));
    })
  );
}

(async function (argv) {
  const version = argv[2];
  await updateSchemasVersion(version);
})(process.argv);