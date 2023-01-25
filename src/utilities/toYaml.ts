import jsYaml from 'js-yaml'

export function toYaml(obj: any): string {
  return jsYaml
    .dump(obj, { lineWidth: -1 })
    // Removes the trailing new line js-yaml is outputting.
    .replace(/\n$/, '')
}
