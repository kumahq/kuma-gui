import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('workspaces', {
      workspace: state => state.workspace,
      workspaces: state => state.workspaces
    })
  },

  methods: {
    fetchWorkspace () {
      return this.$api.getWorkspace(this.workspace)
    },

    getDefaultConfig () {
      return this.$store.dispatch('getInfo').then(res => {
        return res.data.configuration
      })
    },

    async getWorkspaceConfig () {
      const workspace = await this.fetchWorkspace()
      const defaultConfig = await this.getDefaultConfig()
      const config = {}

      Object.keys(defaultConfig).forEach((key) => {
        config[key] = (workspace.config[key] !== null && workspace.config[key] !== undefined)
          ? workspace.config[key]
          : defaultConfig[key]
      })

      Object.keys(workspace.config).forEach((key) => {
        if (!config[key]) {
          config[key] = workspace.config[key]
        }
      })

      return config
    },

    getWorkspaceList () {
      return Promise.all(this.workspaces.map(async ws => {
        const res = await this.$api.query(`${ws.name}/workspaces/${ws.name}`)

        return res.data
      }))
    }
  }
}
