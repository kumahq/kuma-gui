import json2yaml from '@appscode/json2yaml'

export default {
  methods: {
    formatForCLI (content) {
      const codeOpening = 'echo "'
      const codeClosing = '" | kumactl apply -f -'
      const entity = json2yaml(content)

      return `${codeOpening}${entity}${codeClosing}`
    }
  }
}
