import type { FS } from './index'
import _1 from '@/api/mocks/src/config'
import _0 from '@/api/mocks/src/index'
import _5 from '@/api/mocks/src/meshes/_/dataplanes/_'
import _7 from '@/api/mocks/src/meshes/_/dataplanes/_/clusters'
import _4 from '@/api/mocks/src/meshes/_/dataplanes/_/stats'
import _8 from '@/api/mocks/src/meshes/_/dataplanes/_/xds'
import _3 from '@/api/mocks/src/meshes/_/dataplanes+insights'
import _6 from '@/api/mocks/src/meshes/_/dataplanes+insights/_'
import _2 from '@/api/mocks/src/meshes/_/traffic-permissions'

export const fs: FS = {
  '/': _0,
  '/config': _1,
  '/meshes/:mesh/traffic-permissions': _2,
  '/meshes/:mesh/dataplanes+insights': _3,
  '/meshes/:mesh/dataplanes+insights/:name': _6,
  '/meshes/:mesh/dataplanes/:name': _5,
  '/meshes/:mesh/dataplanes/:name/clusters': _7,
  '/meshes/:mesh/dataplanes/:name/stats': _4,
  '/meshes/:mesh/dataplanes/:name/xds': _8,
}
