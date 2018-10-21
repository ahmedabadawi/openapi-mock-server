import program from 'commander';

import { OpenApiMockServer } from './src/openapi-mock-server';

program
  .version('0.0.1')
  .option('-s, --source <source>', 'The source mock-spec to serve')
  .option('-p, --port <port>', 'The port on which the mock server listens')
  .parse(process.argv);

if (!program.source || !program.port) {
  console.log('Source and Port must be specified');
  process.exit(-1);
}

var sourceSpec = program.source.toString();
var port = parseInt(program.port.toString());

let server = new OpenApiMockServer(
  sourceSpec, port);

server.start();
