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
    return this.client.status('/')
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

  getAllDataplanes (params) {
    return this.client.get('/dataplanes', { params })
  }

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
   * Traffic Logs
   */

  // get all traffic logs
  getAllTrafficLogs (params) {
    return this.client.get('/traffic-logs', { params })
  }

  // get all traffic logs from mesh
  getAllTrafficLogsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  getTrafficLog (mesh, trafficlog, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${trafficlog}`, { params })
  }

  /**
   * Traffic Permissions
   */

  // get traffic permissions
  getAllTrafficPermissions (params) {
    return this.client.get('/traffic-permissions', { params })
  }

  // get traffic permissions from mesh
  getAllTrafficPermissionsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  getTrafficPermission (mesh, trafficpermission, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${trafficpermission}`, { params })
  }

  /**
   * Traffic Routes
   */

  // get all traffic routes
  getAllTrafficRoutes (params) {
    return this.client.get('/traffic-routes', { params })
  }

  // get traffic routes from mesh
  getAllTrafficRoutesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  getTrafficRoute (mesh, trafficroute, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${trafficroute}`, { params })
  }

  /**
   * Traffic Traces
   */

  // get all traffic traces
  getAllTrafficTraces (params) {
    return this.client.get('/traffic-traces', { params })
  }

  // get traffic traces from mesh
  getAllTrafficTracesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-traces`, { params })
  }

  // get traffic trace details
  getTrafficTrace (mesh, traffictrace, params) {
    return this.client.get(`/meshes/${mesh}/traffic-traces/${traffictrace}`, { params })
  }

  /**
   * Proxy Templates
   */

  // get all proxy templates
  getAllProxyTemplates (params) {
    return this.client.get('/proxytemplates', { params })

    // this may change to this:
    // return this.client.get('/proxy-templates', { params })
  }

  // get all proxy templates from mesh
  getAllProxyTemplatesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  getProxyTemplate (mesh, proxytemplate, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${proxytemplate}`, { params })
  }

  /**
   * Health Checks
   */

  // get all health checks
  getAllHealthChecks (params) {
    return this.client.get('/health-checks', { params })
  }

  // get all health checks from mesh
  getAllHealthChecksFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  getHealthCheckFromMesh (mesh, name, params) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   * Fault Injections
   */

  // get all fault injections
  getAllFaultInjections (params) {
    return this.client.get('/fault-injections', { params })
  }

  // get all fault injections from mesh
  getAllFaultInjectionsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/fault-injections`, { params })
  }

  // get fault injection details
  getFaultInjection (mesh, faultinjection, params) {
    return this.client.get(`/meshes/${mesh}/fault-injections/${faultinjection}`, { params })
  }

  /**
   *
   * NOTE:
   * There are no endpoints yet for fetching service information.
   * The below calls are placeholders for when those endpoints are added.
   *
   */

  // get all services
  getAllServices (params) {
    return this.client.get('/services', { params })
  }

  // get all services from mesh
  getAllServicesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/services`, { params })
  }

  // get service details
  getService (name, service, params) {
    return this.client.get(`/meshes/${name}/services/${service}`, { params })
  }
}
