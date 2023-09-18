import _124 from './kuma.io/latest_version'
import _1 from './src/config'
import _3 from './src/dataplanes'
import _4 from './src/dataplanes+insights'
import _6 from './src/external-services'
import _5 from './src/global-insights'
import _0 from './src/index'
import _13 from './src/mesh-insights'
import _14 from './src/mesh-insights/_'
import _15 from './src/meshes'
import _16 from './src/meshes/_'
import _17 from './src/meshes/_/circuit-breakers'
import _18 from './src/meshes/_/circuit-breakers/_'
import _125 from './src/meshes/_/circuit-breakers/_/dataplanes'
import _19 from './src/meshes/_/dataplanes/_'
import _122 from './src/meshes/_/dataplanes/_/clusters'
import _20 from './src/meshes/_/dataplanes/_/policies'
import _123 from './src/meshes/_/dataplanes/_/rules'
import _121 from './src/meshes/_/dataplanes/_/stats'
import _120 from './src/meshes/_/dataplanes/_/xds'
import _21 from './src/meshes/_/dataplanes+insights'
import _22 from './src/meshes/_/dataplanes+insights/_'
import _23 from './src/meshes/_/external-services'
import _24 from './src/meshes/_/external-services/_'
import _27 from './src/meshes/_/fault-injections'
import _28 from './src/meshes/_/fault-injections/_'
import _29 from './src/meshes/_/health-checks'
import _30 from './src/meshes/_/health-checks/_'
import _52 from './src/meshes/_/meshfaultinjections'
import _53 from './src/meshes/_/meshfaultinjections/_'
import _31 from './src/meshes/_/meshgatewayroutes'
import _32 from './src/meshes/_/meshgatewayroutes/_'
import _33 from './src/meshes/_/meshgateways'
import _34 from './src/meshes/_/meshgateways/_'
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
import _51 from './src/provision-zone'
import _7 from './src/service-insights'
import _126 from './src/zone-ingresses/_'
import _127 from './src/zoneegresses/_'
import _10 from './src/zoneegressoverviews'
import _49 from './src/zoneegressoverviews/_'
import _9 from './src/zoneingresses+insights'
import _48 from './src/zoneingresses+insights/_'
import _8 from './src/zones'
import _50 from './src/zones/_'
import _11 from './src/zones+insights'
import _12 from './src/zones+insights/_'
import type { FS } from '@/test-support'

export const fs: FS = {
  'https://kuma.io/latest_version': _124,
  '/': _0,
  '/config': _1,
  '/policies': _2,
  '/dataplanes': _3,
  '/dataplanes+insights': _4,
  '/global-insights': _5,
  '/external-services': _6,
  '/service-insights': _7,
  '/zones': _8,
  '/zones/:name': _50,
  '/provision-zone': _51,
  '/zone-ingresses/:name': _126,
  '/zoneingresses+insights': _9,
  '/zoneingresses+insights/:name': _48,
  '/zoneegresses/:name': _127,
  '/zoneegressoverviews': _10,
  '/zoneegressoverviews/:name': _49,
  '/zones+insights': _11,
  '/zones+insights/:name': _12,
  '/mesh-insights': _13,
  '/mesh-insights/:mesh': _14,
  '/meshes': _15,
  '/meshes/:mesh': _16,
  '/meshes/:mesh/circuit-breakers': _17,
  '/meshes/:mesh/circuit-breakers/:name': _18,
  '/meshes/:mesh/circuit-breakers/:name/dataplanes': _125,
  '/meshes/:mesh/dataplanes/:name': _19,
  '/meshes/:mesh/dataplanes/:name/policies': _20,
  '/meshes/:mesh/dataplanes/:name/xds': _120,
  '/meshes/:mesh/dataplanes/:name/stats': _121,
  '/meshes/:mesh/dataplanes/:name/clusters': _122,
  '/meshes/:mesh/dataplanes/:name/rules': _123,
  '/meshes/:mesh/dataplanes+insights': _21,
  '/meshes/:mesh/dataplanes+insights/:name': _22,
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
  '/meshes/:mesh/meshgatewayroutes': _31,
  '/meshes/:mesh/meshgatewayroutes/:name': _32,
  '/meshes/:mesh/meshgateways': _33,
  '/meshes/:mesh/meshgateways/:name': _34,
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
