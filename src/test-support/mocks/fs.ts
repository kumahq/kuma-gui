import _124 from './kuma.io/latest_version'
import _1 from './src/config'
import _3 from './src/dataplanes'
import _4 from './src/dataplanes/_overview'
import _6 from './src/external-services'
import _5 from './src/global-insight'
import _13 from './src/mesh-insights'
import _14 from './src/mesh-insights/_'
import _15 from './src/meshes'
import _16 from './src/meshes/_'
import _17 from './src/meshes/_/circuit-breakers'
import _18 from './src/meshes/_/circuit-breakers/_'
import _125 from './src/meshes/_/circuit-breakers/_/_resources/dataplanes'
import _19 from './src/meshes/_/dataplanes/_'
import _22 from './src/meshes/_/dataplanes/_/_overview'
import _128 from './src/meshes/_/dataplanes/_/_rules'
import _122 from './src/meshes/_/dataplanes/_/clusters'
import _20 from './src/meshes/_/dataplanes/_/policies'
import _121 from './src/meshes/_/dataplanes/_/stats'
import _120 from './src/meshes/_/dataplanes/_/xds'
import _21 from './src/meshes/_/dataplanes/_overview'
import _228 from './src/meshes/_/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/_overview'
import _230 from './src/meshes/_/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/_rules'
import _229 from './src/meshes/_/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/stats'
import _328 from './src/meshes/_/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/_overview'
import _330 from './src/meshes/_/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/_rules'
import _329 from './src/meshes/_/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/stats'
import _628 from './src/meshes/_/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/_overview'
import _630 from './src/meshes/_/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/_rules'
import _629 from './src/meshes/_/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/stats'
import _528 from './src/meshes/_/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/_overview'
import _530 from './src/meshes/_/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/_rules'
import _529 from './src/meshes/_/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/stats'
import _428 from './src/meshes/_/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/_overview'
import _430 from './src/meshes/_/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/_rules'
import _429 from './src/meshes/_/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/stats'
import _129 from './src/meshes/_/dataplanes/test-dataplane/_rules'
import _23 from './src/meshes/_/external-services'
import _24 from './src/meshes/_/external-services/_'
import _27 from './src/meshes/_/fault-injections'
import _28 from './src/meshes/_/fault-injections/_'
import _29 from './src/meshes/_/health-checks'
import _30 from './src/meshes/_/health-checks/_'
import _138 from './src/meshes/_/meshexternalservices'
import _139 from './src/meshes/_/meshexternalservices/_'
import _52 from './src/meshes/_/meshfaultinjections'
import _53 from './src/meshes/_/meshfaultinjections/_'
import _54 from './src/meshes/_/meshfaultinjections/_/_resources/dataplanes'
import _31 from './src/meshes/_/meshgatewayroutes'
import _32 from './src/meshes/_/meshgatewayroutes/_'
import _33 from './src/meshes/_/meshgateways'
import _34 from './src/meshes/_/meshgateways/_'
import _130 from './src/meshes/_/meshgateways/_/_resources/dataplanes'
import _131 from './src/meshes/_/meshgateways/_/_rules'
import _134 from './src/meshes/_/meshgateways/test-meshgateway/_'
import _135 from './src/meshes/_/meshgateways/test-meshgateway/_rules'
import _132 from './src/meshes/_/meshhttproutes'
import _133 from './src/meshes/_/meshhttproutes/_'
import _140 from './src/meshes/_/meshmultizoneservices'
import _141 from './src/meshes/_/meshmultizoneservices/_'
import _136 from './src/meshes/_/meshservices'
import _137 from './src/meshes/_/meshservices/_'
import _35 from './src/meshes/_/proxytemplates'
import _36 from './src/meshes/_/proxytemplates/_'
import _37 from './src/meshes/_/rate-limits'
import _38 from './src/meshes/_/retries'
import _25 from './src/meshes/_/service-insights'
import _26 from './src/meshes/_/service-insights/_'
import _39 from './src/meshes/_/timeouts'
import _40 from './src/meshes/_/traffic-logs'
import _41 from './src/meshes/_/traffic-logs/_'
import _42 from './src/meshes/_/traffic-permissions'
import _43 from './src/meshes/_/traffic-permissions/_'
import _44 from './src/meshes/_/traffic-routes'
import _45 from './src/meshes/_/traffic-traces'
import _46 from './src/meshes/_/traffic-traces/_'
import _47 from './src/meshes/_/virtual-outbounds'
import _2 from './src/policies'
import _7 from './src/service-insights'
import _126 from './src/zone-ingresses/_'
import _48 from './src/zone-ingresses/_/_overview'
import _9 from './src/zone-ingresses/_overview'
import _127 from './src/zoneegresses/_'
import _49 from './src/zoneegresses/_/_overview'
import _149 from './src/zoneegresses/_/xds'
import _10 from './src/zoneegresses/_overview'
import _148 from './src/zoneingresses/_/xds'
import _8 from './src/zones'
import _50 from './src/zones/_'
import _12 from './src/zones/_/_overview'
import _11 from './src/zones/_overview'
import type { FS } from '@/test-support'

export const fs: FS = {
  'https://kuma.io/latest_version': _124,
  '/config': _1,
  '/policies': _2,
  '/dataplanes': _3,
  '/dataplanes/_overview': _4,
  '/global-insight': _5,
  '/external-services': _6,
  '/service-insights': _7,
  '/zones': _8,
  '/zones/_overview': _11,
  '/zones/:name': _50,
  '/zones/:name/_overview': _12,
  '/zone-ingresses/_overview': _9,
  '/zone-ingresses/:name': _126,
  '/zone-ingresses/:name/_overview': _48,
  '/zoneingresses/:name/xds': _148,
  '/zoneegresses/_overview': _10,
  '/zoneegresses/:name': _127,
  '/zoneegresses/:name/_overview': _49,
  '/zoneegresses/:name/xds': _149,
  '/mesh-insights': _13,
  '/mesh-insights/:mesh': _14,
  '/meshes': _15,
  '/meshes/:mesh': _16,
  '/meshes/:mesh/circuit-breakers': _17,
  '/meshes/:mesh/circuit-breakers/:name': _18,
  '/meshes/:mesh/circuit-breakers/:name/_resources/dataplanes': _125,
  '/meshes/:mesh/dataplanes/_overview': _21,
  '/meshes/:mesh/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/_overview': _228,
  '/meshes/:mesh/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/stats': _229,
  '/meshes/:mesh/dataplanes/default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo/_rules': _230,
  '/meshes/:mesh/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/_overview': _328,
  '/meshes/:mesh/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/stats': _329,
  '/meshes/:mesh/dataplanes/demo-app-fcc8bc4cb-5xjwd.kuma-demo/_rules': _330,
  '/meshes/:mesh/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/_overview': _428,
  '/meshes/:mesh/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/stats': _429,
  '/meshes/:mesh/dataplanes/redis-54754f5b57-xl2tw.kuma-demo/_rules': _430,
  '/meshes/:mesh/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/_overview': _528,
  '/meshes/:mesh/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/stats': _529,
  '/meshes/:mesh/dataplanes/kong-gateway-5bcc776cb4-578gc.kong/_rules': _530,
  '/meshes/:mesh/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/_overview': _628,
  '/meshes/:mesh/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/stats': _629,
  '/meshes/:mesh/dataplanes/grpc-service-75b4ccdfd5-z2jmp.kuma-demo/_rules': _630,
  '/meshes/:mesh/dataplanes/test-dataplane/_rules': _129,
  '/meshes/:mesh/dataplanes/:name': _19,
  '/meshes/:mesh/dataplanes/:name/_overview': _22,
  '/meshes/:mesh/dataplanes/:name/_rules': _128,
  '/meshes/:mesh/dataplanes/:name/policies': _20,
  '/meshes/:mesh/dataplanes/:name/xds': _120,
  '/meshes/:mesh/dataplanes/:name/stats': _121,
  '/meshes/:mesh/dataplanes/:name/clusters': _122,
  '/meshes/:mesh/external-services': _23,
  '/meshes/:mesh/external-services/:name': _24,
  '/meshes/:mesh/service-insights': _25,
  '/meshes/:mesh/service-insights/:name': _26,
  '/meshes/:mesh/fault-injections': _27,
  '/meshes/:mesh/fault-injections/:name': _28,
  '/meshes/:mesh/health-checks': _29,
  '/meshes/:mesh/health-checks/:name': _30,
  '/meshes/:mesh/meshfaultinjections': _52,
  '/meshes/:mesh/meshfaultinjections/:name': _53,
  '/meshes/:mesh/meshfaultinjections/:name/_resources/dataplanes': _54,
  '/meshes/:mesh/meshgatewayroutes': _31,
  '/meshes/:mesh/meshgatewayroutes/:name': _32,
  '/meshes/:mesh/meshgateways': _33,
  '/meshes/:mesh/meshgateways/test-meshgateway': _134,
  '/meshes/:mesh/meshgateways/test-meshgateway/_rules': _135,
  '/meshes/:mesh/meshgateways/:name': _34,
  '/meshes/:mesh/meshgateways/:name/_resources/dataplanes': _130,
  '/meshes/:mesh/meshgateways/:name/_rules': _131,
  '/meshes/:mesh/meshservices': _136,
  '/meshes/:mesh/meshservices/:name': _137,
  '/meshes/:mesh/meshmultizoneservices': _140,
  '/meshes/:mesh/meshmultizoneservices/:name': _141,
  '/meshes/:mesh/meshexternalservices': _138,
  '/meshes/:mesh/meshexternalservices/:name': _139,
  '/meshes/:mesh/meshhttproutes': _132,
  '/meshes/:mesh/meshhttproutes/:name': _133,
  '/meshes/:mesh/proxytemplates': _35,
  '/meshes/:mesh/proxytemplates/:name': _36,
  '/meshes/:mesh/rate-limits': _37,
  '/meshes/:mesh/retries': _38,
  '/meshes/:mesh/timeouts': _39,
  '/meshes/:mesh/traffic-logs': _40,
  '/meshes/:mesh/traffic-logs/:name': _41,
  '/meshes/:mesh/traffic-permissions': _42,
  '/meshes/:mesh/traffic-permissions/:name': _43,
  '/meshes/:mesh/traffic-routes': _44,
  '/meshes/:mesh/traffic-traces': _45,
  '/meshes/:mesh/traffic-traces/:name': _46,
  '/meshes/:mesh/virtual-outbounds': _47,
}
