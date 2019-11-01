import RestClient from '@/services/restClient'

export default class Kuma {
  constructor (options) {
    const opts = options || {}

    this.options = opts
    this.client = opts.client || new RestClient(opts)
    // `workspace` = `mesh` in this context
    this.workspace = opts.workspace
  }

  buildUrl (path) {
    return this.client.buildUrl(path)
  }

  getAllMeshes () {
    return this.client.get('/meshes')
  }

  getMesh (name, params) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  getAllDataplanes (name, params) {
    return this.client.get(`/meshes/${name}/dataplanes`, { params })
  }

  getDataplane (name, dataplane, params) {
    return this.client.get(`/meshes/${name}/dataplanes/${dataplane}`, { params })
  }
}
