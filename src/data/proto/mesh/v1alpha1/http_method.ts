/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

export enum HttpMethod {
  NONE = "NONE",
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function httpMethodFromJSON(object: any): HttpMethod {
  switch (object) {
    case 0:
    case "NONE":
      return HttpMethod.NONE;
    case 1:
    case "CONNECT":
      return HttpMethod.CONNECT;
    case 2:
    case "DELETE":
      return HttpMethod.DELETE;
    case 3:
    case "GET":
      return HttpMethod.GET;
    case 4:
    case "HEAD":
      return HttpMethod.HEAD;
    case 5:
    case "OPTIONS":
      return HttpMethod.OPTIONS;
    case 6:
    case "PATCH":
      return HttpMethod.PATCH;
    case 7:
    case "POST":
      return HttpMethod.POST;
    case 8:
    case "PUT":
      return HttpMethod.PUT;
    case 9:
    case "TRACE":
      return HttpMethod.TRACE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HttpMethod.UNRECOGNIZED;
  }
}

export function httpMethodToJSON(object: HttpMethod): string {
  switch (object) {
    case HttpMethod.NONE:
      return "NONE";
    case HttpMethod.CONNECT:
      return "CONNECT";
    case HttpMethod.DELETE:
      return "DELETE";
    case HttpMethod.GET:
      return "GET";
    case HttpMethod.HEAD:
      return "HEAD";
    case HttpMethod.OPTIONS:
      return "OPTIONS";
    case HttpMethod.PATCH:
      return "PATCH";
    case HttpMethod.POST:
      return "POST";
    case HttpMethod.PUT:
      return "PUT";
    case HttpMethod.TRACE:
      return "TRACE";
    case HttpMethod.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
