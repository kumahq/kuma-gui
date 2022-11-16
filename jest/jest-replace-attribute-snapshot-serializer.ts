// Imports the appropriate plugin type from the library Jest uses for snapshot serialization.
import { NewPlugin } from 'pretty-format'

const DEFAULT_UUID = 'aaaabbbb-cccc-dddd-eeee-ffffffffffff'

function hasUuidAttribute(element: Element, attribute: string): boolean {
  const value = element.getAttribute(attribute)

  return value !== null && /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(value)
}

const processedValues = new Set()

export function replaceAttributesSnapshotSerializer(
  attributes: string[],
  uuid = DEFAULT_UUID,
): NewPlugin {
  return {
    /**
     * Matches elements which haven’t been processed by this serializer before.
     */
    test: (value) => value instanceof Element && !processedValues.has(value)
      ? attributes.some((attribute) => hasUuidAttribute(value, attribute))
      : false,

    /**
     * Replaces the attribute values of an element with a static value.
     */
    serialize: (value: Element, config, indentation, depth, refs, printer) => {
      for (const attribute of attributes) {
        if (hasUuidAttribute(value, attribute)) {
          value.setAttribute(attribute, uuid)
        }
      }

      processedValues.add(value)

      return printer(value, config, indentation, depth, refs)
    },
  }
}
