// Imports the appropriate plugin type from the library Jest uses for snapshot serialization.
import { Config, NewPlugin, Printer, Refs } from 'pretty-format'

const DEFAULT_UUID = 'aaaabbbb-cccc-dddd-eeee-ffffffffffff'

function hasUuidAttribute(element: Element, attribute: string): boolean {
  const value = element.getAttribute(attribute)

  return value !== null && value !== DEFAULT_UUID && /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(value)
}

export function replaceAttributesSnapshotSerializer(
  attributes: string[],
  uuid = DEFAULT_UUID,
): NewPlugin {
  return {
    /**
     * Matches elements which haven’t been processed by this serializer before.
     */
    test: (value: any) => {
      if (!(value instanceof Element)) {
        return false
      }

      return (
        attributes.some((attribute) => hasUuidAttribute(value, attribute)) ||
          Object.values(value.attributes).some((attribute) => attribute.name.startsWith('data-v-'))
      )
    },

    /**
     * Replaces the attribute values of an element with a static value.
     */
    serialize: (value: Element, config: Config, indentation: string, depth: number, refs: Refs, printer: Printer) => {
      for (const attribute of attributes) {
        if (hasUuidAttribute(value, attribute)) {
          value.setAttribute(attribute, uuid)
        }
      }

      for (const attribute of value.attributes) {
        if (attribute.name.startsWith('data-v-')) {
          value.removeAttribute(attribute.name)
        }
      }

      return printer(value, config, indentation, depth, refs)
    },
  }
}
