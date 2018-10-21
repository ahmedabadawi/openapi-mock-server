"use strict"

const http = require('http');
const fs = require('fs');
const path = require('path');

import { OpenApiMock } from './openapi-mock';

export class OpenApiMockServer {
  constructor(source, port) {
    this.source = source;
    this.port = port;
    let specs = JSON.parse(fs.readFileSync(this.source));
    this.mock = new OpenApiMock(specs);
  }

  start() {

    http.createServer((request, response) => {
      this.transformRequest(request, (transformedRequest) => {
        this.mock.handle(transformedRequest, response);
      });
    })
    .listen(this.port);

    console.log('Server running on ' + this.port);
  }


  transformRequest(request, callback) {
    let transformed = {};
    transformed.path = request.url;
    transformed.method = request.method;
    transformed.contentType = request.headers['content-type'];
    transformed.accept = request.headers['accept'];

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        transformed.body =  body;

        callback(transformed);
    });
  }
};
