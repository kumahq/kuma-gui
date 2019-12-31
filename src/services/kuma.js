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

  getStatus () {
    return this.client.status()
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

  /**
   * Traffic / Policies
   */

  // get traffic logs
  getTrafficLogs (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  getTrafficLog (mesh, trafficlog, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${trafficlog}`, { params })
  }

  // get traffic permissions
  getTrafficPermissions (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  getTrafficPermission (mesh, trafficpermission, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${trafficpermission}`, { params })
  }

  // get traffic routes
  getTrafficRoutes (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  getTrafficRoute (mesh, trafficroute, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${trafficroute}`, { params })
  }

  /**
   * Proxies
   */

  // get proxy templates
  getProxyTemplates (mesh, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  getProxyTemplate (mesh, proxytemplate, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${proxytemplate}`, { params })
  }

  /**
   * Health Checks
   */

  // get health checks
  getHealthChecks (mesh, params) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  getHealthCheckFromMesh (mesh, name, params) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   *
   * NOTE:
   * There are no endpoints yet for fetching service information.
   * The below calls are placeholders.
   *
   */

  // get all services
  getAllServices (name, params) {
    return this.client.get(`/meshes/${name}/services`, { params })
  }

  // get service details
  getService (name, service, params) {
    return this.client.get(`/meshes/${name}/services/${service}`, { params })
  }

  // get service overviews
  getServiceOverviews (mesh, service, params) {
    return this.client.get(`/meshes/${mesh}/services+insights/${service}`, { params })
  }
}
