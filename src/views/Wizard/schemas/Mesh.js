module.exports = {
  groups: [{
    general: {
      title: 'Mesh Information',
      fields: [
        {
          title: 'meshName',
          type: 'text',
          id: 'mesh-name',
          placeholder: 'your-mesh-name',
          normalize: true
        },
        {
          title: 'meshMutualTLS',
          type: 'radio',
          id: 'mesh-mtls',
          options: [
            {
              label: 'Enabled',
              value: 'enabled',
              default: false,
              checked: ''
            },
            {
              label: 'Disabled',
              value: 'disabled',
              default: true
            }
          ]
        }
      ]
    },
    logging: {

    },
    tracing: {

    },
    metrics: {

    }
  }]
}
