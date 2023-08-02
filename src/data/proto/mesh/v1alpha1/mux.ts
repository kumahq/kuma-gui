/* eslint-disable */
import { Observable } from "rxjs";
import { DiscoveryRequest, DiscoveryResponse } from "../../envoy/api/v2/discovery";
import {
  DiscoveryRequest as DiscoveryRequest1,
  DiscoveryResponse as DiscoveryResponse2,
} from "../../envoy/service/discovery/v3/discovery";

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface Message {
  legacyRequest?: DiscoveryRequest | undefined;
  legacyResponse?: DiscoveryResponse | undefined;
  request?: DiscoveryRequest1 | undefined;
  response?: DiscoveryResponse2 | undefined;
}

function createBaseMessage(): Message {
  return {};
}

export const Message = {
  fromJSON(object: any): Message {
    return {
      legacyRequest: isSet(object.legacyRequest) ? DiscoveryRequest.fromJSON(object.legacyRequest) : undefined,
      legacyResponse: isSet(object.legacyResponse) ? DiscoveryResponse.fromJSON(object.legacyResponse) : undefined,
      request: isSet(object.request) ? DiscoveryRequest1.fromJSON(object.request) : undefined,
      response: isSet(object.response) ? DiscoveryResponse2.fromJSON(object.response) : undefined,
    };
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    message.legacyRequest !== undefined &&
      (obj.legacyRequest = message.legacyRequest ? DiscoveryRequest.toJSON(message.legacyRequest) : undefined);
    message.legacyResponse !== undefined &&
      (obj.legacyResponse = message.legacyResponse ? DiscoveryResponse.toJSON(message.legacyResponse) : undefined);
    message.request !== undefined &&
      (obj.request = message.request ? DiscoveryRequest1.toJSON(message.request) : undefined);
    message.response !== undefined &&
      (obj.response = message.response ? DiscoveryResponse2.toJSON(message.response) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Message>): Message {
    const message = Object.create(createBaseMessage()) as Message;
    message.legacyRequest = (object.legacyRequest !== undefined && object.legacyRequest !== null)
      ? DiscoveryRequest.fromPartial(object.legacyRequest)
      : undefined;
    message.legacyResponse = (object.legacyResponse !== undefined && object.legacyResponse !== null)
      ? DiscoveryResponse.fromPartial(object.legacyResponse)
      : undefined;
    message.request = (object.request !== undefined && object.request !== null)
      ? DiscoveryRequest1.fromPartial(object.request)
      : undefined;
    message.response = (object.response !== undefined && object.response !== null)
      ? DiscoveryResponse2.fromPartial(object.response)
      : undefined;
    return message;
  },
};

export interface MultiplexService {
  StreamMessage(request: Observable<Message>): Observable<Message>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
