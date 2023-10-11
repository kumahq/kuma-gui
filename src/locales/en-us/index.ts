import common from './common/index.yaml'
import components from './components/index.yaml'
import http from './http/index.yaml'
import dataplanes from '@/app/data-planes/locales/en-us/index.yaml'
import diagnostics from '@/app/diagnostics/locales/en-us/index.yaml'
import gateways from '@/app/gateways/locales/en-us/index.yaml'
import mainoverview from '@/app/main-overview/locales/en-us/index.yaml'
import meshes from '@/app/meshes/locales/en-us/index.yaml'
import onboarding from '@/app/onboarding/locales/en-us/index.yaml'
import policies from '@/app/policies/locales/en-us/index.yaml'
import services from '@/app/services/locales/en-us/index.yaml'
import zoneEgresses from '@/app/zone-egresses/locales/en-us/index.yaml'
import zoneIngresses from '@/app/zone-ingresses/locales/en-us/index.yaml'
import zones from '@/app/zones/locales/en-us/index.yaml'

export default {
  ...common,
  ...http,
  ...components,
  ...mainoverview,
  ...onboarding,
  ...diagnostics,
  ...meshes,
  ...services,
  ...policies,
  ...dataplanes,
  ...gateways,
  ...zones,
  ...zoneIngresses,
  ...zoneEgresses,
}
