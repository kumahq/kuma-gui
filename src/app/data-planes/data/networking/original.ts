export interface DataplaneNetworkingInboundHealth {
  ready: boolean;
}

export interface DataplaneNetworkingInboundServiceProbeTcp {
}

// @TODO Duration ?
export interface DataplaneNetworkingInboundServiceProbe {
  interval:
  | number
  | undefined;
  timeout:
  | number
  | undefined;
  unhealthyThreshold:
  | number
  | undefined;
  healthyThreshold:
  | number
  | undefined;
  tcp: DataplaneNetworkingInboundServiceProbeTcp | undefined;
}

export interface DataplaneNetworking {
  address: string;
  gateway?: {
    tags: Record<string, string>
    type?: 'builtin' | 'delegated' | undefined
  },
  outbound?: {
    port: number
    tags: Record<string, string>
  }[]
}

export interface DataplaneNetworkingInbound {
  port: number;
  servicePort: number;
  serviceAddress: string;
  address: string;
  tags: { [key: string]: string };
  health: DataplaneNetworkingInboundHealth | undefined
  serviceProbe: DataplaneNetworkingInboundServiceProbe | undefined;
}
