# openapi-mock-server
While developing front-end application that relies or an API or testing one API that depends on another API for its function,
in those cases there is a need to mock the dependant API in order to make development easier.
OpenAPI Mock Server, is a simple API server mocks based on configuration, to allow for mocking responses bases on request matching.

## Usage
```bash
$ openapi-mock --source <json configuration> --port <the desired port number>
```

## Example Configurations

```json
{
  "config": {
    "defaults": {
      "contentType": "application/json",
      "noMatch": {
        "code": 404,
        "body": {
          "message": "Not found"
        }
      }
    }
  },
  "paths": [
  {
    "path": "/api/test",
    "method": "GET",
    "response": {
      "code": 200,
      "body": {
        "message": "Some data for GET..."
      }
    }
  },
  {
    "path": "/api/test",
    "method": "POST|PUT",
    "response": {
      "code": 200,
      "body": {
        "message": "Some data for POST/PUT..."
      }
    }
  },
  {
    "path": "/api/test2",
    "method": "*",
    "response": {
      "code": 200,
      "body": {
        "message": "Some data for all methods..."
      }
    }
  }]
}
```
