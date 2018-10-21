export class OpenApiMock {
  constructor(specs) {
    this.init(specs);
  }

  init(specs) {
    this.config = specs.config;
    this.paths = specs.paths;
  }

  match(request) {
    var matchedPaths = this.paths.filter(p =>
      this.matchPath(request.path, p.path)
      && this.matchMethod(request.method, p.method)
      && this.matchBody(request.body, p.body));

    if (matchedPaths.length < 1) {
      return this.config.defaults.noMatch;
    }

    if (matchedPaths.length > 1) {
      // TODO: Configuration issue where more than one path matched the request
    }

    return matchedPaths[0].response;
  }

  handle(request, response) {
    let matchedResponse = this.match(request);

    matchedResponse = this.applyDefaults(matchedResponse);
    this.writeHeaders(matchedResponse, response);
    this.writeBody(matchedResponse, response);
  }

  matchPath(requestPath, pathPattern) {
    // TODO: add pattern matching not just exact matching
    return requestPath === pathPattern;
  }

  matchMethod(requestMethod, methodPattern) {
    if (methodPattern === "*") {
      return true;
    }
    if (methodPattern.indexOf("|") != -1) {
      let targetMethods = methodPattern.split("|");
      for(var i = 0; i < targetMethods.length; i++) {
        if (this.matchMethod(requestMethod, targetMethods[i])) {
          return true;
        }
      }

      return false;
    } else {
      return requestMethod.toUpperCase() === methodPattern.toUpperCase();
    }
  }

  matchBody(requestBody, bodyPattern) {
    // TODO: Implement body matching
    return true;
  }

  applyDefaults(matchedResponse) {
    if (!matchedResponse.contentType) {
      matchedResponse.contentType = this.config.defaults.contentType;
    }

    return matchedResponse;
  }

  writeHeaders(matchedResponse, response) {
    response.writeHead(matchedResponse.code, {
      'Content-Type': matchedResponse.contentType });
  }

  writeBody(matchedResponse, response) {
    let content = "";
    if (matchedResponse.contentType === "application/json") {
      content = JSON.stringify(matchedResponse.body);
    } else {
      content = "Content type is not curently supported";
    }
    response.end(content, "utf-8");
  }
}
