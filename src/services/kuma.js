import RestClient from '@/services/restClient'

export default class Kuma {
  constructor (options) {
    const opts = options || {}

    this.options = opts
    this.client = new RestClient(opts)
  }

  buildUrl (path) {
    return this.client.buildUrl(path)
  }

  /**
   * Info
   */

  getInfo () {
    return this.client.get('/')
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  getAllMeshes () {
    return this.client.get('/meshes')
  }

  // get a single mesh
  getMesh (name, params) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  // get a list of all dataplanes
  getAllDataplanesFromMesh (name, params) {
    return this.client.get(`/meshes/${name}/dataplanes`, { params })
  }

  // get a single dataplane
  getDataplane (name, dataplane, params) {
    return this.client.get(`/meshes/${name}/dataplanes/${dataplane}`, { params })
  }

  // get dataplane overviews
  getDataplaneOverviews (mesh, dataplane, params) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights/${dataplane}`, { params })
  }

  // a makeshift way to get all dataplanes
  // getAllDataplanes () {
  //   const getDataplanes = async () => {
  //     const meshes = await this.getAllMeshes()
  //     const result = []

  //     for (let i = 0; i < meshes.items.length; i++) {
  //       const dataplanes = await this.getAllDataplanesFromMesh(meshes.items[i].name)
  //       const items = await dataplanes.items

  //       items.forEach(item => {
  //         result.push({
  //           name: item.name,
  //           mesh: item.mesh
  //         })
  //       })
  //     }

  //     return result
  //   }

  //   getDataplanes()
  // }

  /**
   * Traffic / Policies
   */

  // get traffic logs
  getTrafficLogs (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/`, { params })
  }

  // get traffic permissions
  getTrafficPermissions (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic routes
  getTrafficRoutes (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  /**
   * Proxies
   */

  getProxyTemplates (mesh, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  /**
   *
   * NOTE:
   * There are no endpoints yet for fetching service information.
   * The below calls are placeholders.
   *
   */

  // get a list of all services
  getAllServices (name, params) {
    return this.client.get(`/meshes/${name}/services`, { params })
  }

  // get a single service
  getService (name, service, params) {
    return this.client.get(`/meshes/${name}/services/${service}`, { params })
  }

  // get service overviews
  getServiceOverviews (mesh, service, params) {
    return this.client.get(`/meshes/${mesh}/services+insights/${service}`, { params })
  }
}
