/**
 * FormatForCLI
 *
 * This mixin formats code for use with the Kuma
 * command line. It will encapsulate the YAML entity
 * code with proper Bash commands and provide the user
 * with an out-of-box, paste-ready snippet to create
 * various entities within Kuma
 *
 * @param {Object} content The content that gets
 * converted to YAML.
 * @param {String} codeClosing If you want to override
 * the command that is run after echoing out your code,
 * you can do so with this.
 */

import json2yaml from '@appscode/json2yaml'

export default {
  methods: {
    formatForCLI (content, codeClosing = '" | kumactl apply -f -') {
      const codeOpening = 'echo "'
      const entity = json2yaml(content)

      return `${codeOpening}${entity}${codeClosing}`
    }
  }
}
