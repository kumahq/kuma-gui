import { toYaml } from '@/utilities/toYaml'

/**
 * Encapsulate the YAML entity code with proper Bash commands and provide the user with an out-of-box, paste-ready snippet to create various entities within Kuma
 *
 * @param {Object} content The content that gets converted to YAML.
 * @param {String} codeClosing If you want to override the command that is run after echoing out your code, you can do so with this.
 */
export function formatForCLI(content: any, codeClosing: string = '" | kumactl apply -f -'): string {
  const codeOpening = 'echo "'
  const entity = toYaml(content)

  return `${codeOpening}${entity}${codeClosing}`
}
